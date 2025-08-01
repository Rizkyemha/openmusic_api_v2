require("dotenv").config();
const Hapi = require("@hapi/hapi");
const pool = require("./utils/database");
const Jwt = require("@hapi/jwt");

const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/albumsService");
const validatorAlbums = require("./validator/albums");

const songs = require("./api/songs");
const SongsService = require("./services/postgres/songsService");
const validatorSongs = require("./validator/songs");

const users = require("./api/users");
const UsersService = require("./services/postgres/usersServices");
const validatorUsers = require("./validator/users");

const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/authenticationsService");
const tokenManager = require("./tokenize/tokenManager");
const validatorAuthentications = require("./validator/authentications");

const init = async () => {
	const albumsService = new AlbumsService(pool);
	const songsService = new SongsService(pool);
	const usersService = new UsersService(pool);
	const authenticationsService = new AuthenticationsService(pool);

	const server = Hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	});

	await server.register([
		{
			plugin: Jwt,
		},
	]);

	server.auth.strategy("openmusic_jwt", "jwt", {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_AGE,
		},
		validate: (artifacts) => ({
			isValid: true,
			credentials: {
				id: artifacts.decoded.payload.id,
			},
		}),
	});

	await server.register([
		{
			plugin: albums,
			options: {
				service: albumsService,
				validator: validatorAlbums,
			},
		},
		{
			plugin: songs,
			options: {
				service: songsService,
				validator: validatorSongs,
			},
		},
		{
			plugin: users,
			options: {
				service: usersService,
				validator: validatorUsers,
			},
		},
		{
			plugin: authentications,
			options: {
				authenticationsService,
				usersService,
				tokenManager,
				validator: validatorAuthentications,
			},
		},
	]);

	server.ext("onPreResponse", (request, h) => {
		const { response } = request;

		if (response instanceof Error) {
			const newError = h.response({
				status: "fail",
				message: response.message,
			});
			newError.code(response.statusCode);
			return newError;
		}
		return h.continue;
	});

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
