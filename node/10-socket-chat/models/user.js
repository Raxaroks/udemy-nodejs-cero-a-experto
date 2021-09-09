const { Schema, model } = require("mongoose");

const UserSchema = Schema({
	username: {
		type: String,
		required: [true, "Nombre obligatorio."],
	},
	email: {
		type: String,
		required: [true, "Email obligatorio."],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password obligatorio."],
	},
	img: {
		type: String,
	},
	role: {
		type: String,
		required: true,
        default: "USER_ROLE",
		emun: ["ADMIN_ROLE", "USER_ROLE"],
	},
	status: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
});

UserSchema.methods.toJSON = function() {
	const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
	return user;
}

module.exports = model( "User", UserSchema );