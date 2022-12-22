const Keybind = {
	ev: new (require("events").EventEmitter),
	listening: true,
	lock: false,
	bindEmit: true,
	pressed: []
},
	Path = require("path"), Storage = require(Path.join(__dirname, "storage.js"));
Keybind.loadBindings = () => Keybind.bindings = Storage.get("bindings");
Keybind.saveBindings = () => Storage.set("bindings", Keybind.bindings);
Keybind.loadBindings();
window.addEventListener("gamepadconnected", event => {
	console.log("Gamepad connected", event.gamepad);
	Keybind.gamepads = navigator.getGamepads();
	Keybind.ev.emit("gamepadconnected", event.gamepad);
});
window.addEventListener("gamepaddisconnected", event => {
	console.log("Gamepad disconnected", event.gamepad);
	Keybind.gamepads = navigator.getGamepads();
	Keybind.ev.emit("gamepaddisconnected", event.gamepad);
});
window.addEventListener("keydown", event => {
	if (!Keybind.listening || Keybind.pressed[event.code]) {
		return;
	}
	if (Keybind.lock) {
		event.preventDefault();
	}
	Keybind.pressed[event.code] = Date.now();
	Keybind.ev.emit("keyholdstart", Keybind.getBinding(event.code), event.code);
	if (Keybind.bindEmit && Keybind.getBinding(event.code)) {
		Keybind.ev.emit("keyholdstart_" + Keybind.getBinding(event.code), event.code);
	}
});
window.addEventListener("keyup", event => {
	if (!Keybind.listening) {
		return;
	}
	if (Keybind.lock) {
		event.preventDefault();
	}
	if (Date.now() - 500 <= Keybind.pressed[event.code]) {
		Keybind.ev.emit("keypress", Keybind.getBinding(event.code), event.code);
		if (Keybind.bindEmit && Keybind.getBinding(event.code)) {
			Keybind.ev.emit("keypress_" + Keybind.getBinding(event.code), event.code);
		}
	}
	delete Keybind.pressed[event.code];
	Keybind.ev.emit("keyholdend", Keybind.getBinding(event.code), event.code);
	if (Keybind.bindEmit && Keybind.getBinding(event.code)) {
		Keybind.ev.emit("keyholdend_" + Keybind.getBinding(event.code), event.code);
	}
});
function frame() {
	window.requestAnimationFrame(frame);
	if (!Keybind.listening) {
		return;
	}
	Keybind.gamepads.forEach(gamepad => {
		if (!gamepad) {
			return;
		}
		gamepad.buttons.forEach((button, j) => {
			var id = `Gamepad ${gamepad.id} ${j}`;
			if (button.pressed && !Keybind.pressed[id]) {
				Keybind.pressed[id] = Date.now();
				Keybind.ev.emit("keyholdstart", Keybind.getBinding(id), id);
				if (Keybind.bindEmit && Keybind.getBinding(id)) {
					Keybind.ev.emit("keyholdstart_" + Keybind.getBinding(id), id);
				}
			}
			if (!button.pressed && Keybind.pressed[id]) {
				if (Date.now() - 500 <= Keybind.pressed[id]) {
					Keybind.ev.emit("keypress", Keybind.getBinding(id), id);
					if (Keybind.bindEmit && Keybind.getBinding(id)) {
						Keybind.ev.emit("keypress_" + Keybind.getBinding(id), id);
					}
				}
				delete Keybind.pressed[id];
				Keybind.ev.emit("keyholdend", Keybind.getBinding(id), id);
				if (Keybind.bindEmit && Keybind.getBinding(id)) {
					Keybind.ev.emit("keyholdend_" + Keybind.getBinding(id), id);
				}
			}
		});
	});
}
Keybind.getBinding = key => {
	for (var i of Object.keys(Keybind.bindings)) {
		if (Keybind.bindings[i].includes(key)) {
			return i;
		}
	}
	return null;
}
module.exports = Keybind;
Keybind.ev.on("keyholdstart", (bind, key) => console.log("keyholdstart", bind, key));
Keybind.ev.on("keyholdend", (bind, key) => console.log("keyholdend", bind, key));
Keybind.ev.on("keypress", (bind, key) => console.log("keypress", bind, key));