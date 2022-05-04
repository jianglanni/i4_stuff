// index.js
// This is our main server file

// include express
const express = require("express");
const bodyParser = require('body-parser');
const db = require('./sqlWrap');
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/my_videos.html");
});

app.use(bodyParser.text());

app.post("/videoData", function(req, res, next) {
    let bodhi = JSON.parse(req.body);
    console.log("Received\n" + bodhi.nickname);
    update_and_insert(bodhi).then((msg) => {res.send(msg);}).catch((err) => {console.log("ERROR", err)});
});

app.get("/getMostRecent", function (req, res, next) {
    db.get('select * from VideoTable where flag = 1').then(function(result) {
        res.send(result);
    });
});

app.get("/getList", function(req, res, next) {
    dumpTable().then(function (t) {
        res.send(t);
    });
});

app.post("/deleteEntry", function(req, res, next) {
    let row = req.body; //which is already a string here.
    console.log("Bye! row", row);
    db.run("delete from VideoTable where rowIdNum="+row).then(()=>{res.send("done");}).catch((err)=>{console.log("ERROR", err)});
});

// Need to add response if page not found!
app.use(function(req, res){ res.status(404); res.type('txt'); res.send('404 - File '+req.url+' not found'); });
// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


async function insertVideo(v) {
    const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";

    await db.run(sql,[v.url, v.nickname, v.userid]);
}

// an async function to get the whole contents of the database 
async function dumpTable() {
    const sql = "select * from VideoTable"
  
    let result = await db.all(sql);
    return result;
}

// an async function to get a video's database row by its nickname
async function getVideo(nickname) {

  // warning! You can only use ? to replace table data, not table name or column name.
    const sql = 'select * from VideoTable where nickname = ?';
    let result = await db.get(sql, [nickname]);
    return result;
}

async function update_and_insert(v) {
    let temp = await dumpTable();
    if (temp.length >= 8)
        return "Database Full!";
    await db.run("update VideoTable set flag=0 where flag=1");
    await insertVideo(v);
    return "got POST <3";
}