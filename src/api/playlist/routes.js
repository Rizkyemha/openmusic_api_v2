const routes = (handler) => [
	{
		method: "POST",
		path: "/playlists",
		handler: handler.addPlaylistHandler,
		options: {
			auth: "openmusic_jwt",
		},
	},
	{
		method: "GET",
		path: "/playlists",
		handler: handler.getPlaylistsHandler,
		options: {
			auth: "openmusic_jwt",
		},
	},
	{
		method: "DELETE",
		path: "/playlists/{id}",
		handler: handler.deletePlaylistByIdHandler,
		options: {
			auth: "openmusic_jwt",
		},
	},
	{
		method: "POST",
		path: "/playlists/{id}/songs",
		handler: handler.addSongToPlaylistByIdHandler,
		options: {
			auth: "openmusic_jwt",
		},
	},
	{
		method: "GET",
		path: "/playlists/{id}/songs",
		handler: handler.getSongsFromPlaylistByIdHandler,
		options: {
			auth: "openmusic_jwt",
		},
	},
	{
		method: "DELETE",
		path: "/playlists/{id}/songs",
		handler: handler.deleteSongFromPlaylistByIdHandler,
		options: {
			auth: "openmusic_jwt",
		},
	},
	{
		method: "GET",
		path: "/playlists/{id}/activities",
		handler: handler.getPlaylistActivitiesHandler,
		options: {
			auth: "openmusic_jwt",
		},
	},
];

module.exports = routes;
