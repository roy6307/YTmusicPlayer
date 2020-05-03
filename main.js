const {app, BrowserWindow, Menu, shell} = require('electron');
const fs = require('fs')

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

            if(IsExist3 == false) fs.writeFile(__dirname+"/data/settings.json", '{\n"API": ""\n}', (err) => {console.log(err);})

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

    const template = [
        {
          label: 'File',
          submenu: [
            {
                label: "Config API key",
                click: async () => {
                    await shell.openItem(__dirname+"/data/settings.json");
                }
            },
            {
                label: "Remove caches",
                click: async () => {
                    await RemoveCache();
                }
            }
          ]
        },
        {
            type: 'separator'
        },
        {
          role: 'help',
          submenu: [
            {
                label: 'Source code',
                click: async () => {
                    await shell.openExternal('https://github.com/roy6307/YTmusicPlayer');
                }
            }
          ]
        }
      ]
      
      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    

}

app.on('ready', createWindow);