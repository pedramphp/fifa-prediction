var mongoose =  require('mongoose');
var UserModel = require('../model/user');
var MatchModel = require('../model/match');
var PredictionModel = require('../model/prediction');

var predictionsJSON = require('../predictions.json');

mongoose.connect('mongodb://localhost/fifa');


predictionsJSON.users.forEach(function(user){
	user.matches.forEach(function(match){
		var homeTeam = match[0];
		var awayTeam = match[2];
		MatchModel.findByTeamNames(homeTeam, awayTeam, function(err, selectedMatch){
			if(!selectedMatch){
				console.log('Cant find match based on teams', homeTeam, awayTeam);
				return;
			}
		
			PredictionModel.findByUserEmailAndMatchId(user.email, selectedMatch._id, function(err, predictionRecord){
				
					if(!predictionRecord){
						console.log(' it was empty');
						return;
					}
					predictionRecord.homeScore = match[1];
					predictionRecord.awayScore = match[3];

					predictionRecord.save(function(err){
						console.log("saved it", match , " for ", user.email);

					});
				})
		});

	});
});