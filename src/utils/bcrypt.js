const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
};

const matchPassword = async (password, hashedPassword) => {
	return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, matchPassword };
