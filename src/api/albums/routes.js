const routes = (handler) => [
	{
		method: "POST",
		path: "/albums",
		handler: handler.addAlbumHandler,
	},
	{
		method: "GET",
		path: "/albums/{id}",
		handler: handler.getAlbumByIdHandler,
	},
	{
		method: "PUT",
		path: "/albums/{id}",
		handler: handler.editAlbumByIdHandler,
	},
	{
		method: "DELETE",
		path: "/albums/{id}",
		handler: handler.deleteAlbumByIdHandler,
	},
];

module.exports = routes;
