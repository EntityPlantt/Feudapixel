const FS = require("fs"), UI = Object.create(null), Path = require("path"),
	Keybind = require(Path.join(__dirname, "keybind.js")), MD = require("markdown-it")(),
	Shell = require("electron").shell, Sound = require(Path.join(__dirname, "sound.js"));
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
		elm.innerHTML = MD.render(FS.readFileSync(Path.join(__dirname, "../credits.md"), "utf8"));
	}
};
UI.bindings = {
	open(root) {
		root.innerHTML = "<ul></ul>";
		for (var i of Object.keys(Keybind.bindings)) {
			var li = document.createElement("li");
			li.setAttribute("bind", i);
			li.innerText = i;
			for (var key of Keybind.bindings[i]) {
				var elm = document.createElement("span");
				elm.className = "keybind";
				li.appendChild(elm);
				elm.innerHTML = `${key}
				<span onclick="UI.bindings.deleteKeybind('${i}', '${key}', this.parentElement)">
				&times;</span>`;
			}
			root.querySelector("ul").appendChild(li);
			li.innerHTML += `<span onclick="UI.bindings.addKeybind('${i}', this)"
			class="keybind">+</span>`;
		}
	},
	deleteKeybind(bind, key, elm) {
		Keybind.bindings[bind].splice(Keybind.bindings[bind].indexOf(key), 1);
		Keybind.saveBindings();
		elm.parentElement.removeChild(elm);
	},
	addKeybind(bind, elm) {
		Keybind.bindEmit = false;
		Keybind.lock = true;
		Keybind.ev.once("keyholdend", (_, key) => {
			Keybind.bindEmit = true;
			Keybind.lock = false;
			Keybind.bindings[bind].push(key);
			Keybind.saveBindings();
			var parent = elm.parentElement;
			parent.removeChild(elm);
			parent.innerHTML += `<span class=keybind>${key}
			<span onclick="UI.bindings.deleteKeybind('${bind}', '${key}', this.parentElement)">
			&times;</span></span>`;
			parent.appendChild(elm);
		});
	}
};
module.exports = UI;
window.addEventListener("click", event => {
	if (event.target.tagName == "A") {
		event.preventDefault();
		Shell.openExternal(event.target.href);
		Sound.play("ui.click");
	}
});