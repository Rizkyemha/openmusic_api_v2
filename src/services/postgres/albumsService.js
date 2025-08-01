const { createAlbumId } = require("../../utils/nanoId");
const NotFoundError = require("../../utils/exceptions/NotFoundError");
const InvariantError = require("../../utils/exceptions/InvariantError");

class AlbumsService {
	constructor(pool) {
		this._pool = pool;
	}

	async addAlbum({ name, year }) {
		const id = createAlbumId();
		const query = {
			text: "INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id",
			values: [id, name, year],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Album gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	async getAlbumById(id) {
		const query = {
			text: `
				SELECT
					albums.id,
					albums.name,
					albums.year,
				COALESCE(
						JSON_AGG(
								JSON_BUILD_OBJECT('id', songs.id, 'title', songs.title, 'performer', songs.performer)
						) FILTER (WHERE songs.id IS NOT NULL),
						'[]'::json
				) AS songs
				FROM
						albums
				LEFT JOIN
						songs ON songs.album_id = albums.id
				WHERE
						albums.id = $1
				GROUP BY
						albums.id;
			`,
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Album tidak ditemukan");
		}

		return result.rows[0];
	}

	async editAlbumById(id, { name, year }) {
		const query = {
			text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
			values: [name, year, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
		}
	}

	async deleteAlbumById(id) {
		const query = {
			text: "DELETE FROM albums WHERE id = $1 RETURNING id",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
		}
	}
}

module.exports = AlbumsService;
