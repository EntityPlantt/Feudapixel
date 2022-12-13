var Path = require("path"), Audio;
module.exports.play = (id, volume = 1) => {
	var audio = new Audio(Path.join(__dirname, `../audio/${id}.mp3`));
	audio.volume = volume;
	audio.play();
	return audio;
};
module.exports.passObj = obj => {
	Audio = obj;
}