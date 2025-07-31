const {
	usernameScema,
	passwordScema,
	refreshTokenScema,
} = require("../schemaElement");
const Joi = require("../utils/joi");

const authenticationsCreateRefreshTokenSchema = Joi.object({
	username: usernameScema,
	password: passwordScema,
});

const authenticationsRefreshTokenSchema = Joi.object({
	refreshToken: refreshTokenScema,
});

module.exports = {
	authenticationsCreateRefreshTokenSchema,
	authenticationsRefreshTokenSchema,
};
