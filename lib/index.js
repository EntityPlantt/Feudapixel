const Path = require("path"), Expose = require("electron").contextBridge.exposeInMainWorld,
Sound = require(Path.join(__dirname, "js/sound.js")),
THREE = require(Path.join(__dirname, "js/three.js")),
UI = {}, FS = require("fs");
UI.open = (ui, ...params) => {
	var elm = document.createElement("div"), bg = document.createElement("div");
	elm.setAttribute("ui", ui);
	bg.setAttribute("ui-bg", ui);
	document.body.appendChild(bg);
	document.body.appendChild(elm);
	bg.setAttribute("onclick", `UI.close(${JSON.stringify(ui)})`);
	(UI[ui]?.open || new Function)(elm, ...params);
};
UI.close = ui => {
	var elm = document.querySelector(`[ui=${ui}]`), bg = document.querySelector(`[ui-bg=${ui}]`);
	(UI[ui]?.close || new Function)(elm);
	elm.parentElement.removeChild(elm);
	bg.parentElement.removeChild(bg);
};
UI.credits = {
	open(elm) {
		elm.innerText = FS.readFileSync(Path.join(__dirname, "credits.txt"));
	}
};
Sound.passObj(Audio);
Sound.loop("music.main-menu", 0.5);

Expose("THREE", THREE);
Expose("Sound", Sound);
Expose("UI", UI);