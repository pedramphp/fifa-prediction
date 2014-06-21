var mongoose =  require('mongoose');
var MatchModel = require('../model/match');
var UserModel = require('../model/user');
var PredictionModel = require('../model/prediction');
var db = require('../db')();



// #2 : Create Empty Prediction Records Per User. One time Job


MatchModel.find().exec(function(err, matches){
	if (err) throw err;
	UserModel.find().exec(function(err, users){
		if (err) throw err;
		createPrediction(matches, users);
				
	});
});

var newPrediction;
function createPrediction(matches, users){
	var userLen = users.length;

	users.forEach(function(user, userIndex){
		var matchLen = matches.length;
		matches.forEach(function(match, matchIndex){

			newPrediction = new PredictionModel();
			newPrediction._user = user._id;
			newPrediction._match = match._id;
			newPrediction.score = -1;
			newPrediction.status = 'pending';
			newPrediction.homeScore = -1;
			newPrediction.awayScore = -1;

			newPrediction.save(function(err){
				if (err) throw err;
				console.log('New Prediction: ' + match.id + ' ' + user.email + ' created');
				if(matchLen -1  === matchIndex && userLen -1  === userIndex){
					process && process.exit();
				}
			});

		});
	});
}