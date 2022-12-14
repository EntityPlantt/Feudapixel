const Path = require("path"), Expose = require("electron").contextBridge.exposeInMainWorld,
Sound = require(Path.join(__dirname, "js/sound.js")),
THREE = require(Path.join(__dirname, "js/three.js")),
UI = require(Path.join(__dirname, "js/ui.js")),
Keybind = require(Path.join(__dirname, "js/keybind.js"));
UI.document = document;
Sound.passObj(Audio);
var music = new Sound.SoundLayer(0.5);
music.set("music.main-menu");

Expose("THREE", THREE);
Expose("Sound", Sound);
Expose("UI", UI);
Expose("switchMusic", id => music.switch(id));
Expose("Keybind", Keybind);