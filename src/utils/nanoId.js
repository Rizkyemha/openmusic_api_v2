const { nanoid } = require("nanoid");

const createSongId = () => {
	const id = nanoid(16);
	return `song-${id}`;
};
const createAlbumId = () => {
	const id = nanoid(16);
	return `album-${id}`;
};
const createUserId = () => {
	const id = nanoid(16);
	return `user-${id}`;
};

module.exports = { createSongId, createAlbumId, createUserId };
