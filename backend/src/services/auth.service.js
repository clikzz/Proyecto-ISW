const bcrypt = require('bcrypt');
const { findByEmail, createUser } = require('../models/User');

const registerUser = async (rut, name_user, email, password_user, role_user) => {
	const hashedPassword = await bcrypt.hash(password_user, 10);
	return await createUser(rut, name_user, email, hashedPassword, role_user);
};

const loginUser = async (email, password) => {
	const user = await findByEmail(email);
	if (user && await bcrypt.compare(password, user.password_user)) {
		return user;
	}
	throw new Error('Credenciales incorrectas');
};

module.exports = { registerUser, loginUser };
