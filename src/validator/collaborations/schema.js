const { songIdScema, playlistIdScema } = require("../schemaElement");
const Joi = require("../../utils/joi");

const collaborationsSchema = Joi.object({
	playlistId: playlistIdScema,
	songId: songIdScema,
});

module.exports = collaborationsSchema;
