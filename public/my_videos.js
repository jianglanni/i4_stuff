//redirect page back to main page. 
let addnewbutton = document.getElementById("add_new");
let playgamebutton = document.getElementById("play-game");


async function sendGetRequest(url) {
    console.log("about to send get request");
    let response = await fetch(url);
    if (response.ok) {
      let data = await response.text();
      return data;
    } else {
      throw Error(response.status);
    }
}

async function sendPostRequest(url,data) {
    console.log("about to send post request");
    let response = await fetch(url, {
      method: 'POST', 
      headers: {'Content-Type': 'text/plain'},
      body: data });
    if (response.ok) {
      let data = await response.text();
      return data;
    } else {
      throw Error(response.status);
    }
}

sendGetRequest("/getList").then(function (txt) {
    let vD = JSON.parse(txt);
    console.log(vD.length, vD);
    if (vD.length <= 7) {
        addnewbutton.addEventListener("click", go_back);
        playgamebutton.style.backgroundColor="rgba(238, 29, 82, 0.2)";
      }
    else {
        addnewbutton.style.backgroundColor="rgba(238, 29, 82, 0.2)";
    }

    // Nicknames, Border, DeleteButton definition
    for (index = 0; index < vD.length; ++index) {
        console.log(vD[index]);
        let txt_bar = document.getElementById("id_"+String(index));
        txt_bar.textContent = vD[index].nickname;
        let border_bar = document.getElementById("f_"+String(index));
        border_bar.style.border = "1px solid gray";
        border_bar.style.backgroundColor = "rgb(244,244,244)";
        let delete_button = document.getElementById("d_"+String(index));
        del_adder(delete_button, vD[index].rowIdNum);
    }
    
}).catch((err)=>{console.log("ERROR", err);});

function go_back() {
    window.location = "/tiktokpets.html";
}

//post request to delete db items


function del_adder(vButton, row_id) {
    vButton.addEventListener("click", () => {
        sendPostRequest("/deleteEntry", String(row_id)).then((res) => {location.reload();}).catch((err)=>{console.log(err);});
    });
}


