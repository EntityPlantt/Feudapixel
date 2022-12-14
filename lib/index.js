const Path = require("path"), Expose = require("electron").contextBridge.exposeInMainWorld,
Sound = require(Path.join(__dirname, "js/sound.js")),
THREE = require(Path.join(__dirname, "js/three.js"));
Expose("THREE", THREE);
Expose("Sound", Sound);
Sound.passObj(Audio);
console.log("Hi! Nodejs is", process.version);
Sound.loop("music.main-menu", 0.5);