const albumsSchema = require("./albums/scema");
const songsScema = require("./songs/scema");
const InvariantError = require("../utils/exceptions/InvariantError");

const validatePayload = {
	validateAlbumsPayload: (payload) => {
		const validationResult = albumsSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateSongsPayload: (payload) => {
		const validationResult = songsScema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatePayload;
