const {app, BrowserWindow} = require('electron');

/*
2.재생도중 새 음악 재생
4. 재생목록
5. 디자인
7. 재생한거 다시 재생
9. 캐쉬처럼 쌓아놓고 나중에 ffmpeg으로 널널할때 변환해서 용량 줄여놓기, 나중에 같은거 재생할때 용량이랑 로딩이 줄을거임.
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