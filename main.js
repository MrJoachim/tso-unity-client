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


  
  const collectibles = [
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/3d22e289f157476f3a79a53c1ce2d16b29064c8a.png", // buffad_collectible_bridge_base_material.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/27b0441fe4a8812665b8af61972966d5294a9ecb.png", // buffad_collectible_picks.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/2283394af62449b6d1012dc0c2a8ddfc2cabd34c.png", // c_banana.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/c11e14421d3f64ac4cf2f26888deff9f4ad0e964.png", // c_boxing_glove.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/144e19ee3f16e12972695cea95ba2024b9dec3cf.png", // c_christmas_bells.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/c55f730b452e9ac32a2fa2de53f71493712a2db5.png", // c_christmas_candy_cane.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/6d11dcde93afce91bc146f88e622f450201e4fff.png", // c_christmas_gingerbread.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/15e6e9e0530c90735c5cf589c4f7289bfff345ed.png", // c_clue.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/fd051d9f5c663494141f9c891ae026e9ac0af62b.png", // c_corner_flag.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/0f6796a0845db6618f98d949a67a0979d03ec7de.png", // c_eggpaint.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/8c7f90c5f97c733c0975b2db5a6b8e6605549f47.png", // c_football.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/2fec40fa97eca571ebb00672a8c73c193f38b71f.png", // c_mushroom_red.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/70dc23e44a76aa0eca1a59cbae657bbd3cfd2b63.png", // c_plain_egg.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/be974b1d2f2b57bd6d43edfdd08d4768f8e909bb.png", // c_red_paint.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/b66acaaa3a29fd7a1ce8ea1654a316ca86127bdf.png", // c_shoe.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/de44eef412ce71fe5dd9275dc67e685ed1f8fd2e.png", // c_spring.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/b7639e0a05e784364057a1c555ade7863e9e1419.png", // c_telescope.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/c318a870415a5f5eed83785e10e5a886ad8c6cc4.png", // c_wicker_basket.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/dd01c5236d806713229fa7791e310776aa62b965.png", // collectible_adamantium.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/7095574d01338c042aa53c08ef4d4c0c38d51359.png", // collectible_axe.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/8d48c788455abfad5e18b8bde4952b9f7ce0162d.png", // collectible_banner.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/0848be1ac854a26511a47e0c85a880663a975a08.png", // collectible_barrels.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/ef295ac38d8f7772a1ed0f382a145ef564c2ec4b.png", // collectible_boards.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/e9e1b9782d61146c2795167c4d7c1510681b86a7.png", // collectible_bronze_cauldron.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/2640a50bd6148ffe691b5ca386c533701eb14911.png", // collectible_bucket.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/c0a1d931b960997abdb1b727fa27c9fff26eff58.png", // collectible_cake_candles.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/77f9564a4f3a36bae4b5dee6290081f60d9be161.png", // collectible_cake_dough.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/d8554de0337f5a4fea7a227154cf572222600846.png", // collectible_dead_crops.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/542da7f7b0e2bcc8e8f7348c2502d56f6a3f615b.png", // collectible_dead_tree_wood.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/8806f72ac4e322714f1d3f0564c2110443809810.png", // collectible_easter2015_frightened_chicken.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/3baeb0cffbcc8647681b011bca36347008bf4f78.png", // collectible_easter2015_stinky_plant.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/5ddad335cf8a2deb1caad9d742c632942529e4d2.png", // collectible_egg.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/5d0f9c3b15d856ea170908830b238d23a7fa066a.png", // collectible_fire_wood.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/08beb0ce46efc7a2e67170139060554e72c50cd0.png", // collectible_flower.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/41e2ddd8857dbb689db88943e37b810b34e790a5.png", // collectible_food_cart.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/de8e32fd201db2ce4d6ed13568053ed9c2a93891.png", // collectible_furniture.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/3f24a7c79c7047c1c65e60416276d9f3f8edbd40.png", // collectible_furs.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/eef8de2ab600ebe3a866ea4db2e9906c1f1be018.png", // collectible_glowing_herbs.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/57879fa1fcdf116f9cc1b90be758fe422dc1ae00.png", // collectible_grain_sacks.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/85f7298c6a75698b11b6b5a21750f90d345b1c42.png", // collectible_heart_fruit.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/e12aae65aabfe05a2220059965d5ecca06edd269.png", // collectible_herbs.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/1266cc37d5d7c2243ee9c0f2a2ad4ed1da29ae0c.png", // collectible_kettle.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/2b57691bf0e9fdf52d06df3bdb8f195ec622ca5c.png", // collectible_magic_stone.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/39bd270f33fd585365315020ab938866f6ea061e.png", // collectible_mounten_ore.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/d3fea8ea1bd7568720f782dc6415dab49bb697f5.png", // collectible_obsidian_shard.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/314095c559aafba9844d7d60d586d2570025d875.png", // collectible_plants.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/35547500798ad2822b8b1d5d1cf4879e44596ba5.png", // collectible_pumpkin.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/470899b868390b6017bb1ec6931cb2d7d83e35b2.png", // collectible_sacks.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/b1c1400ee024f102417514a5449fd75c63eb95b1.png", // collectible_scarecrow.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/3d31ec420b92573da45c321741a0d0081e97c18a.png", // collectible_scrap.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/d85dd693901cfbd921a319e29da941ef7b4f36ef.png", // collectible_stinky_mushroom.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/233979928224b1254b60f63c7eafd96651f9ea6a.png", // collectible_training_dummy_01.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/74b33ba575bb069e8d62e736dbf906dbdc668534.png", // collectible_used_hammer.png
    "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/41295d3a07b1854f2f4c77204bd926b990a93da3.png", // collectible_wine_barrel.png
  ];

  session.defaultSession.webRequest.onBeforeRequest({urls: collectibles}, (details, callback) => {
    callback({cancel: false, redirectURL: "https://ubistatic-a.akamaihd.net/0018/live/GFX_HASHED/building_lib/f9f7e2bacd84c76001820a3621bda5c6959d609d.png"});
  })


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
