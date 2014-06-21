var mongoose =  require('mongoose');
var UserModel = require('../model/user');
var MatchModel = require('../model/match');
var PredictionModel = require('../model/prediction');

var predictionsJSON = require('../predictions.json');

var db = require('../db')();


var usersLen = predictionsJSON.users.length;

predictionsJSON.users.forEach(function(user, userIndex){

	var matchsLen = user.matches.length;

	user.matches.forEach(function(match, matchIndex){
		var homeTeam = match[0];
		var awayTeam = match[2];

		MatchModel.findByTeamNames(homeTeam, awayTeam, function(err, selectedMatch){
			if(!selectedMatch){
				console.log('Cant find match based on teams', homeTeam, awayTeam);
				return;
			}
			PredictionModel.findByUserEmailAndMatchId(user.email, selectedMatch._id, function(err, predictionRecord){
				
					if(!predictionRecord){
						console.log(user.email, ' no prediction record for', homeTeam, awayTeam, selectedMatch._id );
						return;
					}
					predictionRecord.homeScore = match[1];
					predictionRecord.awayScore = match[3];

					predictionRecord.save(function(err){
						console.log("saved prediction score - it: match index",matchIndex, " ", match , " for ", user.email);
						if( matchsLen - 1 === matchIndex && usersLen - 1 === userIndex){
				//			process && process.exit();
						}
					});
				})
		});

	});
});