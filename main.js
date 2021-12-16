const { app, BrowserWindow, ipcMain, session, protocol, net  } = require("electron");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const urlLib = require("url");
const portable = true;
var appPath = app.getPath("userData");

if(portable){
  appPath = path.join(app.getAppPath() + "/data");
  app.setPath ('userData', appPath);
  console.log(app.getPath("userData"));
}



function download(url, dest, cb) {
  fetch(url).then((response) => {
    var destination = fs.createWriteStream(dest);
    response.body.pipe(destination);
    destination.on("finish", function () {
      cb();
    });
  });
}

var server = "";

function createWindow() {


  const mainWindow = new BrowserWindow({
    title: "TSO Unity Client",
    // icon: "icon.ico",
    icon: path.join(app.getAppPath(), "icon.ico"),
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      // preload: "preload.js",
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });
  
  
  // mainWindow.webContents.openDevTools();

  mainWindow.loadFile("serverselector.html");
  // mainWindow.loadURL(path.join(app.getAppPath(), "serverselector.html"));
  ipcMain.on("synchronous-message", (event, arg) => {
    console.log(mainWindow.webContents.getURL());
    event.returnValue = mainWindow.webContents.getURL();
  });
  ipcMain.on("redirectToGame", (event, arg) => {
    mainWindow.loadFile(server + "/play");
  });
  ipcMain.on("loadLogin", (event) => {
    mainWindow.loadURL(
      "https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&nextUrl=" +
        server +
        "%2Fplay"
    );
  });
  ipcMain.on("setServer", (event, arg) => {
    server = arg;
    console.log(
      "https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&nextUrl=" +
        server
    );
    mainWindow.loadURL(
      "https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&nextUrl=" +
        server
    );
  });
  ipcMain.on("loadGame", (event, arg) => {
    mainWindow.loadURL(
      "data:text/html;charset=utf-8," +
        encodeURI("<h1>The game is downloading.. Please do not close.</h1>")
    );

    var html = arg;

    var jsonPath = path.join(appPath, "game.json");

    var url = html.match(
      /(?<=UnityLoader\.instantiate\(\"unityContainer\", \")(.*?)(?=\"\,)/g
    );
    fetch(url)
      .then((data) => data.text())
      .then((data) => {
        var dataObj = JSON.parse(data);

        data = data.replace("must-revalidate", "public");
        data = data.replace(
          '"preserveDrawingBuffer": false',
          '"preserveDrawingBuffer": true'
        );
        var dataObjChange = JSON.parse(data);
        dataObjChange.dataUrl = urlLib.pathToFileURL(
          path.join(appPath, dataObj.dataUrl)
        );
        dataObjChange.wasmCodeUrl = urlLib.pathToFileURL(
          path.join(appPath, dataObj.wasmCodeUrl)
        );
        dataObjChange.wasmFrameworkUrl = urlLib.pathToFileURL(
          path.join(appPath, dataObj.wasmFrameworkUrl)
        );
        data = JSON.stringify(dataObjChange);
        fs.writeFileSync(jsonPath, data);

        var newData = html.replace(
          /(?<=UnityLoader\.instantiate\(\"unityContainer\", \")(.*?)(?=\"\,)/g,
          urlLib.pathToFileURL(jsonPath)
        );
        html = newData;
        html = html.replace(
          "</body>",
          ' <script>       var loaderInterval = setInterval(function () {          if (document.getElementById("consentNotification").children[0] != undefined) {            clearInterval(loaderInterval);            document.querySelector("#consentNotification > div > div > div > div.button-container > button:nth-child(3)").click();          }        }, 100);      </script>  </body>'
        );
        html = html.replace(
          'id="dialogContainer"',
          'id="dialogContainer" style="display:none"'
        );
        html = html.replace(
          'id="dialogOverlay"',
          'id="dialogOverlay" style="display:none"'
        );
        console.log(html);
        if (
          !fs.existsSync(path.join(appPath, dataObj.dataUrl)) ||
          !fs.existsSync(path.join(appPath, dataObj.wasmCodeUrl)) ||
          !fs.existsSync(path.join(appPath, dataObj.wasmFrameworkUrl))
        ) {
          download(
            "https://ubistatic-a.akamaihd.net/0018/live/debug/unity/SWMMO/Build/" +
              dataObj.dataUrl,
            path.join(appPath, dataObj.dataUrl),
            () => {
              download(
                "https://ubistatic-a.akamaihd.net/0018/live/debug/unity/SWMMO/Build/" +
                  dataObj.wasmCodeUrl,
                path.join(appPath, dataObj.wasmCodeUrl),
                () => {
                  download(
                    "https://ubistatic-a.akamaihd.net/0018/live/debug/unity/SWMMO/Build/" +
                      dataObj.wasmFrameworkUrl,
                    path.join(appPath, dataObj.wasmFrameworkUrl),
                    () => {
                      fs.writeFileSync(path.join(appPath, "game.html"), html);
                      mainWindow.loadURL(path.join(appPath, "game.html"));
                    }
                  );
                }
              );
            }
          );
        } else {
          fs.writeFileSync(path.join(appPath, "game.html"), html);
          mainWindow.loadFile(path.join(appPath, "game.html"));
          // mainWindow.loadURL(path.join(appPath, "game.html"));
        }
      });

    mainWindow.on("close", function (e) {
      e.preventDefault();
      mainWindow.destroy();
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
