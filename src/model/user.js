var mongoose =  require('mongoose');

var userSchema =  new mongoose.Schema({
	firstname: {
		type: String,
		lowercase: true
	},
	lastname: {
		type: String,
		lowercase: true
	},
	email: {
		type: String,
		lowercase: true
	}
});

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
