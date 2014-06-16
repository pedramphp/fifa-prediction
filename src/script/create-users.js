var mongoose =  require('mongoose');
var UserModel = require('../model/user');

var usersJSON = require('../users.json');	
var users = usersJSON.users;


//#1: Creating All Users Record - One time job

mongoose.connect('mongodb://localhost/fifa');

users.forEach(function(user){

	var newuser = new UserModel();
	
	newuser.firstname=user[0];
	newuser.lastname= user[1];
	newuser.email= user[2];
	console.log(newuser);

	
	newuser.save(function(err){
		if (err) throw err;
		console.log('New User: ' + newuser.firstname + ' ' + newuser.lastname + ' created');
	});
	
});