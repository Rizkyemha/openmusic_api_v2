const { createCollaborationId } = require("../../utils/nanoId");

class CollaborationsService {
	constructor(pool) {
		this._pool = pool;
	}

	async addCollaborator({ playlistId, userId }) {
		const id = createCollaborationId();

		const query = {
			text: "INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id",
			values: [id, playlistId, userId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Kolaborasi gagal ditambahkan.");
		}

		return id;
	}

	async deleteCollaborator({ playlistId, userId }) {
		const query = {
			text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
			values: [playlistId, userId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(
				"Kolaborasi gagal dihapus. Kolaborasi tidak ditemukan."
			);
		}
	}
}

module.exports = CollaborationsService;
