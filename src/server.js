require("dotenv").config();
const Hapi = require("@hapi/hapi");
const pool = require("./utils/database");
const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/albumsService");
const songs = require("./api/songs");
const SongsService = require("./services/postgres/songsService");
const validatePayload = require("./validator");

const init = async () => {
	const albumsService = new AlbumsService(pool);
	const songsService = new SongsService(pool);

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
			plugin: albums,
			options: {
				service: albumsService,
				validator: validatePayload.validateAlbumsPayload,
			},
		},
		{
			plugin: songs,
			options: {
				service: songsService,
				validator: validatePayload.validateSongsPayload,
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
