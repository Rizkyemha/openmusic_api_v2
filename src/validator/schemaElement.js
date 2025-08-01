const Joi = require("../utils/joi");

const idScema = Joi.string().required();
const nameScema = Joi.string().required();
const yearScema = Joi.number().required();
const titleScema = Joi.string().required();
const genreScema = Joi.string().required();
const performerScema = Joi.string().required();
const durationScema = Joi.number().optional();
const albumIdScema = Joi.string().optional();

// users
const usernameScema = Joi.string().required();
const passwordScema = Joi.string().required();

// authentications
const refreshTokenScema = Joi.string().required();

// playlist
const namePlaylistScema = Joi.string().required();
const songIdScema = Joi.string().required();

module.exports = {
	idScema,
	nameScema,
	yearScema,
	titleScema,
	genreScema,
	performerScema,
	durationScema,
	albumIdScema,
	usernameScema,
	passwordScema,
	refreshTokenScema,
	namePlaylistScema,
	songIdScema,
};
