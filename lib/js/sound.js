var Path = require("path"), Audio;
module.exports.play = (id, volume = 1) => {
	var audio = new Audio(Path.join(__dirname, `../audio/${id}.mp3`));
	audio.volume = volume;
	audio.play();
	return audio;
};
module.exports.loop = (id, volume = 1) => {
	var audio = module.exports.play(id, volume);
	audio.loop = true;
	return audio;
};
module.exports.SoundLayer = class SoundLayer {
	constructor(volume = 1) {
		this.audio = new Audio;
		this.audio.volume = volume;
	}
	audio;
	async switch(id, time = 500) {
		var newAudio = module.exports.loop(id, 0), volume = this.audio.volume;
		for (var i = 0; i < time; i++) {
			this.audio.volume = Math.max(this.audio.volume - volume / time, 0);
			newAudio.volume = Math.min(newAudio.volume + volume / time, volume);
			await new Promise(arg => setTimeout(arg, 1));
		}
		this.audio.pause();
		this.audio = newAudio;
	}
	set(id) {
		this.audio.pause();
		this.audio = module.exports.loop(id, this.audio.volume);
	}
};
module.exports.passObj = obj => Audio = obj;