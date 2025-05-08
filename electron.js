const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false // 드래그 불가능, 드래그가 가능하게 하고 싶은 곳에 CSS로 "-webkit-app-region: drag;" 속성을 주면 해당 부분을 통해 윈도우를 움직일 수 있다.
        },
        frame: false
    });

    win.setMenu(null); // 기본 상단바 제거
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);