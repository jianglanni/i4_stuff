'use strict';

let myvideosButton = document.getElementById("my_videos");

// set up button
myvideosButton.addEventListener("click", go_back);

function go_back() {
    window.location = "/my_videos.html";
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

let continue_button = document.getElementById("continue");
continue_button.addEventListener("click", trigger);

function trigger() {
    let username_box = document.getElementById("username").value;
    let url_box = document.getElementById("video_link").value;
    let nickname_box = document.getElementById("nickname").value;
    const jsonPack = {"userid": username_box, 
                      "url": url_box, 
                      "nickname": nickname_box};
    sendPostRequest("/videoData", JSON.stringify(jsonPack)).then(function (data) {
    console.log("got back the following string");
    console.log(data); 
    if (data == "Database Full!") {
        alert(data);
        window.location = "/my_videos.html";
    } else {
        window.location = "/videoViewer.html";
    }
  })
  .catch(function (error) {
     console.error('Error:', error);
  });
}