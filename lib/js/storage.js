const Path = require("path"), FS = require("fs"), dir = Path.join(__dirname, "../../storage");
module.exports.set = (name, obj) => {
	FS.writeFileSync(Path.join(dir, name) + ".json", JSON.stringify(obj, null, "\t"), "utf8");
};
module.exports.get = name => FS.existsSync(Path.join(dir, name) + ".json")
	? JSON.parse(FS.readFileSync(Path.join(dir, name) + ".json", "utf8"))
	: {};