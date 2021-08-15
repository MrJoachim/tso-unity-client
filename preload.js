// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require('electron');


function init() {
  window.ipcRenderer = ipcRenderer
}
// window.alert = function () { console.log('yes') }
// window.Notification = function () { console.log('yes') }

init();



window.addEventListener("load",() => {
  var links= document.getElementsByClassName('linkedTerritoryLink');
  for (var i=0;i<links.length;i++){
      links[i].addEventListener("click",(e) => {
        // console.log('setServer', e.target.parentElement.href + e.target.parentElement.getElementsByTagName("img")[0].alt);
        var url = e.target.parentElement.href + e.target.parentElement.getElementsByTagName("img")[0].alt;
        if(url.endsWith("/")){
          url = url.slice(0, -1);
        }

        var elem = document.createElement('div');
        elem.id = "overrideDiv";
        elem.style.cssText = 'position: absolute;      width: 100vw;      height: 100vh;      opacity: 1;      z-index: 999999999999999999999999999;      background: white;';
    
        elem.innerHTML = "<h1 style='font-size:32px;'>Loading...</h1>";
    
        document.body.prepend(elem);

        setTimeout(() => {
          ipcRenderer.sendSync('setServer', url);
        }, 1000)
        e.preventDefault();
      })
  }
});



window.addEventListener('DOMContentLoaded', () => {
  let pathname = ipcRenderer.sendSync('synchronous-message', "");
  console.log(pathname);
  if(pathname.includes("homepage")){
    if(document.getElementById("overrideDiv") == null){

      var elem = document.createElement('div');
      elem.id = "overrideDiv";
      elem.style.cssText = 'position: absolute;      width: 100vw;      height: 100vh;      opacity: 1;      z-index: 999999999999999999999999999;      background: white;';
  
      elem.innerHTML = "<h1 style='font-size:32px;'>Game is loading..</h1>";
  
      document.body.prepend(elem);
    }
      setTimeout(() => {
        // document.getElementById("shieldButtonOverlay").click();
        // document.location.href = "https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&lang=nl-NL&nextUrl=https:%2F%2Fwww.thesettlersonline.nl%2Fplay";
        ipcRenderer.sendSync('loadLogin', "");
      }, 5000)
  }

  if(pathname.includes("/play")){
    console.log("TRUE1");
    
    ipcRenderer.sendSync('loadGame', document.documentElement.innerHTML);
  }
  // if(document.querySelector("#gameContainer > script:nth-child(3)") != null){
  //   document.querySelector("#gameContainer > script:nth-child(3)").innerHTML = "";
  
  // }
  // if(document.querySelector("#gameContainer > script:nth-child(4)") != null){
  
  //   console.log("TRUE1");
  //   var url = document.querySelector("#gameContainer > script:nth-child(4)").innerHTML.match(/(?<=UnityLoader\.instantiate\(\"unityContainer\", \")(.*?)(?=\"\,)/g);
  
  //   fetch(url).then(data => data.text()).then(data => {
  //       data = data.replace("must-revalidate", "public");
  //       data = data.replace("\"preserveDrawingBuffer\": false", "\"preserveDrawingBuffer\": true");
  //       data = data.replace("\"dataUrl\": \"355313f2c895c035ca985e8a1d4c830e.unityweb\"", "\"dataUrl\": \"\"");
  //       data = data.replace(/\s+/g,'');
  //       data = data.replace(/"/g, '\\"');
  //       var newData = document.querySelector("#gameContainer > script:nth-child(4)").innerHTML.replace(/(?<=UnityLoader\.instantiate\(\"unityContainer\", \")(.*?)(?=\"\,)/g, data);
  //       // var newData = document.querySelector("#gameContainer > script:nth-child(4)").innerHTML.replace(/(?<=UnityLoader\.instantiate\(\"unityContainer\"\,) (.*?)(?=\,)/g, "\"" + data  + "\"");
  //       document.querySelector("#gameContainer > script:nth-child(4)").innerHTML = newData;
  //   });
  // }
});


window.onload = () => {
  let pathname = ipcRenderer.sendSync('synchronous-message', "");
  
  if(pathname.includes("login") || pathname.includes("homepage")){
    var cookiesInterval = setInterval(() => {
      console.log("test");
      if(document.getElementById("privacy__modal__accept") != null){
        console.log("test1");
        document.getElementById("privacy__modal__accept").click();
        clearInterval(cookiesInterval);
      }
    }, 100);
    console.log("test");

  }
  if(pathname.includes("homepage")){


      var loaderInterval = setInterval(() => {
        if(document.getElementById("consentNotification").children[0] != undefined){
          clearInterval(loaderInterval);
          document.querySelector("#consentNotification > div > div > div > div.button-container > button:nth-child(3)").click();
        }
      }, 100);


}
  
};
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {

    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }


});
