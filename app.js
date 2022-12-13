const Electron = require("electron"), Path = require("path");
Electron.app.whenReady().then(() => {
	const win = new Electron.BrowserWindow({
		kiosk: true,
		autoHideMenuBar: true,
		webPreferences: {
			preload: Path.join(__dirname, "lib/index.js")
		}
	});
	win.loadFile(Path.join(__dirname, "lib/index.html"));
});
Electron.app.on("window-all-closed", Electron.app.quit);