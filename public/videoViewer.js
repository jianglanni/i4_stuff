// This viewer takes a TikTok video URL and displays it in a nice magenta box, and gives it a reload button in case you want to watch it again. 

// for example, these are hardcoded
const example = 'https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854';


// grab elements we'll use 
// these are global! 
let reloadButton = document.getElementById("viewer");
let divElmt = document.getElementById("tiktokDiv");

// set up button
reloadButton.addEventListener("click", go_back);

// add the blockquote element that TikTok wants to load the video into
if (window.innerWidth >= 325) {
    fetch("/getMostRecent").then(function(msg) {return msg.text();}).then(function(txt) {
        let obj = JSON.parse(txt);
        document.getElementById("var_nick").textContent = obj.nickname;
        addVideo(obj.url, divElmt);
        document.getElementById("reload_button").addEventListener("click", ()=>{reloadVideo(obj.url);});
    }).then(loadTheVideos).catch((err)=>{console.log("ERROR", err)});
} else {
    document.getElementById("reload_button").textContent = "";
    let bg = document.getElementById("viewerbg");
    bg.style.backgroundColor="#FFFFFF";
}

// addVideo(example, divElmt);


// Add the blockquote element that tiktok will load the video into
async function addVideo(tiktokurl,divElmt) {

  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;
  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id",videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);
  
  divElmt.appendChild(block);
}

// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.id = "tiktokScript";
  return script;
}

// the reload button; takes out the blockquote and the scripts, and puts it all back in again.
// the browser thinks it's a new video and reloads it
function reloadVideo (link) {
  
  // get the two blockquotes
  let blockquotes 
 = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(link, divElmt);
  loadTheVideos();
}

function go_back() {
    window.location = "/my_videos.html";
}