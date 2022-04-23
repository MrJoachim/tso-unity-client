const { ipcRenderer } = require("electron");

function init() {
  window.ipcRenderer = ipcRenderer;
}

init();

window.addEventListener("load", () => {
  var links = document.getElementsByClassName("linkedTerritoryLink");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", (e) => {
      var url =
        e.target.parentElement.href +
        e.target.parentElement.getElementsByTagName("img")[0].alt;
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }

      document.body.innerHTML = "";
      document.body.removeAttribute("class");
      var elem = document.body;
      elem.id = "overrideDiv";
      elem.style.cssText = "z-index:10000;position:absolute; background-color: #FEF3EA;min-width:100vw;height:100vh;max-width:100vw;        display:flex;        justify-content: center;        align-items: center;        flex:1;        height:100vh;        padding:0;        margin:0;      font-family: arial;";
      var elemh1 = document.createElement("h1");
      elemh1.style.cssText = "font-size:32px;text-align:center;";
      elemh1.innerHTML = "Please wait while the game is loading."
      elem.prepend(elemh1);
      // document.body.prepend(elem);

      setTimeout(() => {
        ipcRenderer.sendSync("setServer", url);
      }, 1000);
      e.preventDefault();
    });
  }
});

window.addEventListener("DOMContentLoaded", () => {
  let pathname = ipcRenderer.sendSync("synchronous-message", "");
  console.log(pathname);
  if (pathname.includes("homepage")) {
    if (document.getElementById("overrideDiv") == null) {

      document.body.innerHTML = "";
      document.body.removeAttribute("class");
      var elem = document.body;
      elem.id = "overrideDiv";
      elem.style.cssText = "z-index:10000;position:absolute; background-color: #FEF3EA;min-width:100vw;height:100vh;max-width:100vw;        display:flex;        justify-content: center;        align-items: center;        flex:1;        height:100vh;        padding:0;        margin:0;      font-family: arial;";
      var elemh1 = document.createElement("h1");
      elemh1.style.cssText = "font-size:32px;text-align:center;";
      elemh1.innerHTML = "Please wait while the game is loading."
      elem.prepend(elemh1);
      // document.body.prepend(elem);

    }
    setTimeout(() => {
      ipcRenderer.sendSync("loadLogin", "");
    }, 5000);
  }

  if (pathname.includes("/play")) {
    console.log("TRUE1");

    ipcRenderer.sendSync("loadGame", document.documentElement.innerHTML);
  }
});

window.onload = () => {
  let pathname = ipcRenderer.sendSync("synchronous-message", "");

  if (pathname.includes("login") || pathname.includes("homepage")) {
    var cookiesInterval = setInterval(() => {
      console.log("test");
      if (document.getElementById("privacy__modal__accept") != null) {
        console.log("test1");
        document.getElementById("privacy__modal__accept").click();
        clearInterval(cookiesInterval);
      }
    }, 100);
    console.log("test");
  }
  if (pathname.includes("homepage")) {
    var loaderInterval = setInterval(() => {
      if (
        document.getElementById("consentNotification").children[0] != undefined
      ) {
        clearInterval(loaderInterval);
        document
          .querySelector(
            "#consentNotification > div > div > div > div.button-container > button:nth-child(3)"
          )
          .click();
      }
    }, 100);
  }
};
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
