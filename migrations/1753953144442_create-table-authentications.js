exports.up = (pgm) => {
	pgm.createTable("authentications", {
		refresh_token: {
			type: "TEXT",
			notNull: true,
			unique: true,
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable("authentications");
};
