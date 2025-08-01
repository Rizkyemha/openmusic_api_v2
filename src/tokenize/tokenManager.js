const Jwt = require("@hapi/jwt");
const InvariantError = require("../utils/exceptions/InvariantError");

const tokenManager = {
	generateAccessToken: (payload) =>
		Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
	generateRefreshToken: (payload) =>
		Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
	verifyRefreshToken: (refreshToken) => {
		try {
			const artifact = Jwt.token.decode(refreshToken);
			Jwt.token.verifySignature(artifact, process.env.REFRESH_TOKEN_KEY);
			const { payload } = artifact.decoded;
			return payload;
		} catch (error) {
			throw new InvariantError("Refresh token tidak valid");
		}
	},
};

module.exports = tokenManager;
