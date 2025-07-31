const { nanoid } = require("nanoid");

const createSongId = () => {
	const id = nanoid(16);
	return `song-${id}`;
};
const createAlbumId = () => {
	const id = nanoid(16);
	return `album-${id}`;
};

module.exports = { createSongId, createAlbumId };
