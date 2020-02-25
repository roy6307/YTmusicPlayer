const {app, BrowserWindow} = require('electron');

/*
2.재생도중 새 음악 재생
3.재생 끝낼시, 삭제
4. 재생목록
5. 디자인
*/

function createWindow(){
    let win = new BrowserWindow({
        width:580,
        height:310,
        resizable:false,
        webPreferences:{
            nodeIntegration:true
        }
    });
    win.webContents.openDevTools();
    win.setMenu(null);
    win.loadFile('view.html');

}

app.on('ready', createWindow);