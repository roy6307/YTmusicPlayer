const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs')

var Volu;

/*
https://www.flaticon.com/packs/music-audio
https://codepen.io/noahblon/pen/OyajvN
7. 재생한거 다시 재생
9. 캐쉬처럼 쌓아놓고 나중에 ffmpeg 같은걸로 널널할때 변환해서 용량 줄여놓기, 나중에 같은거 재생할때 용량이랑 로딩이 줄을거임.
*/

function createWindow(){
    let win = new BrowserWindow({
        width:1180,
        height:664,
        resizable:false,
        frame:false,
        webPreferences:{
            nodeIntegration:true
        }
    });
    win.webContents.openDevTools();
    win.loadFile('view.html');

    fs.exists(__dirname+"/data", (IsExist) => {

        if(IsExist == false) fs.mkdir(__dirname+"/data", (err) => {console.log(err);});

        fs.exists(__dirname+"/data/cache", (IsExist2) => {

            if(IsExist2 == false) fs.mkdir(__dirname+"/data/cache", (err) => {console.log(err);});

        })

        fs.exists(__dirname+"/data/settings.json", (IsExist3) => {

            if(IsExist3 == false) fs.writeFile(__dirname+"/data/settings.json", '{\n"API": ""\n,"Volume": "0.5"}', (err) => {console.log(err);})

        })

    });

    function RemoveCache(){

        fs.readdirSync(__dirname+"/data/cache/").forEach(file => {

            if(file != false){

                fs.unlink(__dirname+"/data/cache/"+file, err => {

                    console.log(err);

                });

            }

        });

    }

}

ipcMain.on("Vol-Change", (event,n) => {

    Volu = n;
    event.returnValue = "Got";

});

app.on("window-all-closed", () => {
    
    fs.readFile(__dirname+"/data/settings.json", (err,d) => {

        var jn = JSON.parse(d);
        jn.Volume = Volu/100;
        
        fs.writeFile(__dirname+"/data/settings.json", JSON.stringify(jn), 'utf8', (err) => {console.log(err);});

    });

    app.quit();

});

app.on('ready', createWindow);