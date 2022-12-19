const FS = require("fs"), UI = Object.create(null);
UI.open = (ui, ...params) => {
	var elm = UI.document.createElement("div"), bg = UI.document.createElement("div");
	elm.setAttribute("ui", ui);
	bg.setAttribute("ui-bg", ui);
	UI.document.body.appendChild(bg);
	UI.document.body.appendChild(elm);
	bg.setAttribute("onclick", `UI.close(${JSON.stringify(ui)})`);
	(UI[ui]?.open || new Function)(elm, ...params);
};
UI.close = ui => {
	var elm = UI.document.querySelector(`[ui=${ui}]`), bg = UI.document.querySelector(`[ui-bg=${ui}]`);
	(UI[ui]?.close || new Function)(elm);
	elm.parentElement.removeChild(elm);
	bg.parentElement.removeChild(bg);
};
UI.credits = {
	open(elm) {
		elm.innerText = FS.readFileSync(Path.join(__dirname, "credits.txt"));
	}
};
module.exports = UI;