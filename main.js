const {app, BrowserWindow} = require('electron');


function createWindow(){
    let win = new BrowserWindow({
        width:730,
        height:400,
        webPreferences:{
            nodeIntegration:true
        }
    });
    win.webContents.openDevTools();
    win.setMenu(null);
    win.loadFile('view.html');

}

app.on('ready', createWindow);