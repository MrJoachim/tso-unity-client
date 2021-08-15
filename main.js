// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const urlLib = require('url');
const appPath = app.getPath("userData");


function download(url, dest, cb) {
  fetch(url).then((response) => {
     var destination = fs.createWriteStream(dest);
     response.body.pipe(destination);
     destination.on('finish', function() {
       cb();
     });
 });
 };

var server = "";

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title:"TSO Unity Client",
    icon: path.join(app.getAppPath(), 'icon.ico'),
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      preload: path.join(app.getAppPath(), 'preload.js'),
    }
  });
  // and load the index.html of the app.
  // mainWindow.loadURL('https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&lang=nl-NL&nextUrl=https:%2F%2Fwww.thesettlersonline.nl%2Fplay');
  mainWindow.loadURL(path.join(app.getAppPath(), 'serverselector.html'));

  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(mainWindow.webContents.getURL());
    event.returnValue = mainWindow.webContents.getURL();
  });
  ipcMain.on('redirectToGame', (event, arg) => {
    mainWindow.loadURL(server + "/play");
  });
  ipcMain.on('loadLogin', (event) => {
    mainWindow.loadURL('https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&nextUrl=' + server + '%2Fplay');
  });
  ipcMain.on('setServer', (event, arg) => {
    server = arg;
    console.log('https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&nextUrl=' + server);
    mainWindow.loadURL('https://connect.ubisoft.com/login?appId=39164658-8187-4bf4-b46c-375f68356e3b&nextUrl=' + server);
  });
  ipcMain.on('loadGame', (event, arg) => {
    mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURI("<h1>The game is downloading.. Please do not close.</h1>"));

    var html = arg;

    var jsonPath = path.join(appPath, 'game.json');

    var url = html.match(/(?<=UnityLoader\.instantiate\(\"unityContainer\", \")(.*?)(?=\"\,)/g);
    fetch(url).then(data => data.text()).then(data => {
      var dataObj = JSON.parse(data);

        data = data.replace("must-revalidate", "public");
        data = data.replace("\"preserveDrawingBuffer\": false", "\"preserveDrawingBuffer\": true");
        var dataObjChange = JSON.parse(data);
        dataObjChange.dataUrl = urlLib.pathToFileURL(path.join(appPath, dataObj.dataUrl));
        dataObjChange.wasmCodeUrl = urlLib.pathToFileURL(path.join(appPath, dataObj.wasmCodeUrl));
        dataObjChange.wasmFrameworkUrl = urlLib.pathToFileURL(path.join(appPath, dataObj.wasmFrameworkUrl));
        data = JSON.stringify(dataObjChange);
        // data = data.replace("\"dataUrl\": \"355313f2c895c035ca985e8a1d4c830e.unityweb\"", "\"dataUrl\": \"\"");
        // data = data.replace(/\s+/g,'');
        // data = data.replace(/"/g, '\\"');

        fs.writeFileSync(jsonPath, data);

        var newData = html.replace(/(?<=UnityLoader\.instantiate\(\"unityContainer\", \")(.*?)(?=\"\,)/g, urlLib.pathToFileURL(jsonPath));
        // var newData = document.querySelector("#gameContainer > script:nth-child(4)").innerHTML.replace(/(?<=UnityLoader\.instantiate\(\"unityContainer\"\,) (.*?)(?=\,)/g, "\"" + data  + "\"");
        html = newData;
        html = html.replace('</body>', ' <script>       var loaderInterval = setInterval(function () {          if (document.getElementById("consentNotification").children[0] != undefined) {            clearInterval(loaderInterval);            document.querySelector("#consentNotification > div > div > div > div.button-container > button:nth-child(3)").click();          }        }, 100);      </script>  </body>')
        html = html.replace("id=\"dialogContainer\"", "id=\"dialogContainer\" style=\"display:none\"");
        html = html.replace("id=\"dialogOverlay\"", "id=\"dialogOverlay\" style=\"display:none\"");
        console.log(html);
        if(!fs.existsSync(path.join(appPath, dataObj.dataUrl)) || !fs.existsSync(path.join(appPath, dataObj.wasmCodeUrl)) || !fs.existsSync(path.join(appPath, dataObj.wasmFrameworkUrl))){
        
          download("https://ubistatic-a.akamaihd.net/0018/live/debug/unity/SWMMO/Build/" + dataObj.dataUrl, path.join(appPath, dataObj.dataUrl), () => {

            download("https://ubistatic-a.akamaihd.net/0018/live/debug/unity/SWMMO/Build/" + dataObj.wasmCodeUrl, path.join(appPath, dataObj.wasmCodeUrl), () => {

              download("https://ubistatic-a.akamaihd.net/0018/live/debug/unity/SWMMO/Build/" + dataObj.wasmFrameworkUrl, path.join(appPath, dataObj.wasmFrameworkUrl), () => {
                fs.writeFileSync( path.join(appPath, 'game.html'), html);  
                mainWindow.loadURL(path.join(appPath, 'game.html'));
              });
            });

          });
      }else{
        fs.writeFileSync( path.join(appPath, 'game.html'), html);  
        mainWindow.loadURL(path.join(appPath, 'game.html'));
      }

    });

    mainWindow.on('close', function(e) { 
      e.preventDefault();
      mainWindow.destroy();
  });

    
  });
  
  // Open the DevTools.
  //  mainWindow.webContents.openDevTools()
}



// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
