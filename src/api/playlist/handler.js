class PlaylistHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.addPlaylistHandler = this.addPlaylistHandler.bind(this);
		this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
		this.deletePlaylistByIdHandler =
			this.deletePlaylistByIdHandler.bind(this);
		this.addSongToPlaylistByIdHandler =
			this.addSongToPlaylistByIdHandler.bind(this);
		this.getSongsFromPlaylistByIdHandler =
			this.getSongsFromPlaylistByIdHandler.bind(this);
		this.deleteSongFromPlaylistByIdHandler =
			this.deleteSongFromPlaylistByIdHandler.bind(this);
	}

	async addPlaylistHandler(request, h) {
		this._validator.validateCreatePlaylistPayload(request.payload);
		const { id: ownerId } = request.auth.credentials;

		const playlistId = await this._service.addPlaylist(
			ownerId,
			request.payload
		);

		const response = h.response({
			status: "success",
			data: {
				playlistId,
			},
		});

		response.code(201);
		return response;
	}

	async getPlaylistsHandler(request) {
		const { id: ownerId } = request.auth.credentials;

		// belum membuat authorization service
		// await this._validator.verifyPlaylistOwner(id);

		const playlists = await this._service.getPlaylists(ownerId);

		return {
			status: "success",
			data: {
				playlists,
			},
		};
	}

	async deletePlaylistByIdHandler(request, h) {
		const { id } = request.params;
		const { id: ownerId } = request.auth.credentials;

		// belum membuat authorization service
		// await this._validator.verifyPlaylistOwner(id);

		await this._service.deletePlaylistById(id);

		return {
			status: "success",
			message: "Playlist berhasil dihapus",
		};
	}

	async addSongToPlaylistByIdHandler(request, h) {
		this._validator.validateAddSongsPlaylistPayload(request.payload);

		const { id: ownerId } = request.auth.credentials;
		const { id: playlistId } = request.params;

		// belum membuat authorization service
		// await this._validator.verifyPlaylistOwner(id);

		// Memastikan bahwa lagu yang akan ditambahkan ada

		await this._service.verifySongInPlaylist(playlistId, request.payload);
		await this._service.addSongToPlaylist(playlistId, request.payload);

		const response = h.response({
			status: "success",
			message: "Lagu berhasil ditambahkan ke playlist",
		});

		response.code(201);
		return response;
	}

	async getSongsFromPlaylistByIdHandler(request, h) {
		const { id: ownerId } = request.auth.credentials;
		const { id: playlistId } = request.params;

		// belum membuat authorization service
		// await this._validator.verifyPlaylistOwner(ownerId);

		const playlist = await this._service.getSongsFromPlaylist(playlistId);

		return {
			status: "success",
			data: {
				playlist,
			},
		};
	}

	async deleteSongFromPlaylistByIdHandler(request, h) {
		this._validator.validateAddSongsPlaylistPayload(request.payload);

		const { id: ownerId } = request.auth.credentials;
		const { id: playlistId } = request.params;

		// belum membuat authorization service
		// await this._validator.verifyPlaylistOwner(ownerId);

		await this._service.deleteSongFromPlaylist(playlistId, request.payload);

		return {
			status: "success",
			message: "Lagu berhasil dihapus dari playlist",
		};
	}
}

module.exports = PlaylistHandler;
