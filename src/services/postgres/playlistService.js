const {
	createPlaylistId,
	createPlaylistSongsId,
} = require("../../utils/nanoId");
const InvariantError = require("../../utils/exceptions/InvariantError");
const NotFoundError = require("../../utils/exceptions/NotFoundError");
const AuthenticationError = require("../../utils/exceptions/AuthenticationError");

class PlaylistService {
	constructor(pool) {
		this._pool = pool;
	}

	async verifyPlaylistAccess(playlistId, userId) {
		try {
			await this.verifyPlaylistOwner(playlistId, userId);
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}
			try {
				console.log("mengecek collaboration");
			} catch (error) {
				throw new AuthenticationError(
					"Anda tidak berhak mengakses resource ini"
				);
			}
		}
	}

	async verifyPlaylistOwner(playlistId, ownerId) {
		const query = {
			text: "SELECT owner FROM playlists WHERE id = $1",
			values: [playlistId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Playlist tidak ditemukan");
		}

		const { owner } = result.rows[0];

		if (owner !== ownerId) {
			throw new AuthenticationError(
				"Anda tidak berhak mengakses resource ini"
			);
		}
	}

	async verifySongInPlaylist(playlistId, { songId }) {
		const query = {
			text: "SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
			values: [playlistId, songId],
		};

		const result = await this._pool.query(query);

		if (result.rows.length) {
			throw new InvariantError("Lagu sudah ada di dalam playlist");
		}
	}

	async addPlaylist(ownerId, { name }) {
		const id = createPlaylistId();
		const query = {
			text: "INSERT INTO playlist (id, name, owner) VALUES ($1, $2, $3) RETURNING id",
			values: [id, name, ownerId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Playlist gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	async getPlaylists(ownerId) {
		const query = {
			text: `
          SELECT
            p.id,
            p.name,
            u.username
          FROM 
            playlist AS p
          JOIN
            users AS u ON p.owner = u.id
          WHERE p.owner = $1`,
			values: [ownerId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Tidak ada playlist ditemukan");
		}

		return result.rows;
	}

	async deletePlaylistById(id) {
		const query = {
			text: "DELETE FROM playlist WHERE id = $1",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
		}
	}

	async addSongToPlaylist(playlistId, { songId }) {
		const id = createPlaylistSongsId();
		const query = {
			text: "INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id",
			values: [id, playlistId, songId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Gagal menambahkan lagu ke playlist");
		}
	}

	async getSongsFromPlaylist(playlistId) {
		const query = {
			text: `
          SELECT
            p.id,
            p.name,
            u.username,
          COALESCE(
            json_agg(
              json_build_object(
                'id', s.id,
                'title', s.title,
                'performer', s.performer
              )
            ) FILTER (WHERE s.id IS NOT NULL),
            '[]'::json
          ) AS songs
          FROM
            playlist AS p
            LEFT JOIN playlist_songs AS ps ON ps.playlist_id = p.id
            LEFT JOIN songs AS s ON ps.song_id = s.id
            JOIN users AS u ON p.owner = u.id
          WHERE
            p.id = $1
          GROUP BY
            p.id, u.username
            `,
			values: [playlistId],
		};

		const result = await this._pool.query(query);

		return result.rows[0];
	}

	async deleteSongFromPlaylist(playlistId, { songId }) {
		const query = {
			text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
			values: [playlistId, songId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(
				"Gagal menghapus lagu dari playlist. Id tidak ditemukan"
			);
		}
	}
}

module.exports = PlaylistService;
