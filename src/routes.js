"use strict";
var request = require('request');

var predictionsJSON = require('./predictions.json');
var usersJSON = require('./users.json');


var request = require("request");


var mongoose =  require('mongoose');

mongoose.connect('mongodb://localhost/fifa');


var teamSchema =  new mongoose.Schema({
	address: String,
	draws: Number,
	foundedYear: Number,
	goalsAgainst: Number,
	goalsDiff: String,
	goalsFor: Number,
	group: String,
	groupPoints: Number,
	groupRank: Number,
	homeStadium: String,
	id: String,
	logo: String,
	losses: Number,
	matchesPlayed: Number,
	name: String,
	stadiumCapacity: Number,
	type: String,
	website: String,
	wins: Number
});

var TeamModel = mongoose.model('Team', teamSchema);


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

var matchSchema =  new mongoose.Schema({
	homeScore: Number,
	awayScore: Number,
	currentGameMinute: Number,
	startTime: Date,
	status: String,
	venue: String,
	group: String,
	awayTeamId: String,
	homeTeamId: String,
	id: String,
	type: String
});

matchSchema.statics.findByTeamNames = function (homeTeamName, awayTeamName, cb) {

	

	var that = this;
	TeamModel.find({
		name: {
			$in: [ awayTeamName, homeTeamName] 
		}
	}).exec(function(error, teams){
		if(error){
			throw  error;
		}
		if(teams.length < 2){
			console.log('One or Two team are not found', homeTeamName, awayTeamName);
		}
		
		var teamIds = [];
		var homeTeamId;
		var awayTeamId;

		
		teams.forEach(function(team){
			if(team.name === homeTeamName){
				homeTeamId = team.id;
			}else{
				awayTeamId = team.id;
			}

		});

		that.findOne({ 
	  		homeTeamId: homeTeamId, 
  			awayTeamId: awayTeamId
  		}, cb);

	});
}

var MatchModel = mongoose.model('Match', matchSchema);


var predictionSchema =  new mongoose.Schema({
	_user: { type: String, ref: 'User' },
	_match: { type: String, ref: 'Match' },
	homeScore: Number,
	awayScore: Number,
	score: Number,
	status: String
});


predictionSchema.statics.findByUserEmailAndMatchId = function(email, matchId, cb){
	var that = this;
	UserModel
		.findOne({
			email: email
		})
		.exec(function(error, user){
			that.findOne({ 
				_match: mongoose.Types.ObjectId(matchId),
				_user: mongoose.Types.ObjectId(user._id)
			}).populate({
				path: '_match _user'
			}).exec(cb);
		})

};


var PredictionModel = mongoose.model('Prediction', predictionSchema);
	



exports.home = function(req, res){



	//#1: Creating All Users Record - One time job
	/*
	var users = usersJSON.users;

	users.forEach(function(user){

		var newuser = new UserModel();
		
		newuser.firstname=user[0];
		newuser.lastname= user[1];
		newuser.email= user[2];


		newuser.save(function(err){
			if (err) throw err;
			console.log('New User: ' + newuser.firstname + ' ' + newuser.lastname + ' created');
		});
	});
	
	*/


	// #2 : Create Empty Prediction Records Per User. One time Job
	/*
	MatchModel.find().exec(function(err, matches){
		if (err) throw err;
		UserModel.find().exec(function(err, users){
			if (err) throw err;
			createPrediction(matches, users);
					
		});
	});

	var newPrediction;
	function createPrediction(matches, users){
		users.forEach(function(user){
			matches.forEach(function(match){

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
				});

			});
		});
	}
	*/


// #3 -Insert user predictions to DB. ONE TIME ONLY
/*
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
	*/
	
	
// #4: Update Prediction Scores based On matches - checks the DB - RUN THIS EVERY DAY.
/*
	var match,
		matchScoreDiff,
		predictioncoreDiff;

	PredictionModel
		.find({
		  	status: 'pending'
		})
		.populate({
		  path: '_match',
		  match: {
		  	status: 'Final'
		  },
		  select: 'awayScore homeScore status'
		})
		.exec(function (err, predictions) {
			predictions.forEach(function(prediction){
				if(!prediction._match || !prediction._match.status){
					return ;
				}
				match = prediction._match;

				//correct winner
				if( ( (match.awayScore > match.homeScore) && (prediction.awayScore > prediction.homeScore) )  ||
					( (match.awayScore < match.homeScore) && (prediction.awayScore < prediction.homeScore) )  ||
					( (match.awayScore === match.homeScore) && (prediction.awayScore === prediction.homeScore) )  

					){

					matchScoreDiff = Math.abs(match.awayScore - match.homeScore );
					predictioncoreDiff = Math.abs(prediction.awayScore - prediction.homeScore );
					
					if(match.awayScore === prediction.awayScore && match.homeScore === prediction.homeScore ){
						
						prediction.score = 5;

					}else if(predictioncoreDiff === matchScoreDiff){
					
						prediction.score = 3;
					
					}else{ 
						prediction.score = 1;
					}


				}else{
					//wrong winner
					prediction.score = 0;
				}
				
				prediction.status = 'done';

				prediction.save(function(err){
					if(err){
						throw err;
					}
				});
				console.log(prediction);
			});
		});
*/




	/*
	var teamSchema =  new mongoose.Schema({
		address: String,
		draws: Number,
		foundedYear: Number,
		goalsAgainst: Number,
		goalsDiff: String,
		goalsFor: Number,
		group: String,
		groupPoints: Number,
		groupRank: Number,
		homeStadium: String,
		id: String,
		logo: String,
		losses: Number,
		matchesPlayed: Number,
		name: String,
		stadiumCapacity: Number,
		type: String,
		website: String,
		wins: Number
	});

	var TeamModel = mongoose.model('Team', teamSchema);


	function render(data){

		data.forEach(function(team){

			var newTeam = new TeamModel();
			newTeam.address=team.address;
			newTeam.draws= team.draws;
			newTeam.foundedYear= team.foundedYear;
			newTeam.goalsAgainst= team.goalsAgainst;
			newTeam.goalsDiff= team.goalsDiff;
			newTeam.goalsFor= team.goalsFor;
			newTeam.group= team.group;
			newTeam.groupPoints= team.groupPoints;
			newTeam.groupRank= team.groupRank;
			newTeam.homeStadium= team.homeStadium;
			newTeam.id= team.id;
			newTeam.logo= team.logo;
			newTeam.losses= team.losses;
			newTeam.matchesPlayed= team.matchesPlayed;
			newTeam.name= team.name;
			newTeam.stadiumCapacity= team.stadiumCapacity;
			newTeam.type= team.type;
			newTeam.website= team.website;
			newTeam.wins= team.wins;

			newTeam.save(function(err){
				if (err) throw err;
				console.log('New Team: ' + newTeam.name + ' created');
			});

		});



	request("http://worldcup.kimonolabs.com/api/teams?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
	  render(JSON.parse(body));
	});


	}
	*/

	/*

	//Adding all new Matches.


	function render(data){

		data.forEach(function(match){

			var newMatch = new MatchModel();
			newMatch.homeScore=match.homeScore;
			newMatch.awayScore= match.awayScore;
			newMatch.currentGameMinute= match.currentGameMinute;
			newMatch.startTime= match.startTime;
			newMatch.status= match.status;
			newMatch.venue= match.venue;
			newMatch.group= match.group;
			newMatch.awayTeamId= match.awayTeamId;
			newMatch.homeTeamId= match.homeTeamId;
			newMatch.id= match.id;
			newMatch.type= match.type;

			newMatch.save(function(err){
				if (err) throw err;
				console.log('New Team: ' + match.id + ' created');
			});

		});

		renderView(data);
	}


	request("http://worldcup.kimonolabs.com/api/matches?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
	  render(JSON.parse(body));
	});

	*/


	
/*
	function render(data){

		data.forEach(function(match){
			if(match.status !== 'final'){
				return;
			}

			MatchModel.findOne({
				id: match.id,
				status: 'Pre-game'
			}).exec(function(err, matchInstance){
				
				if(!matchInstance ){
					return;
				}

				matchInstance.homeScore	=	match.homeScore;
				matchInstance.awayScore	=	match.awayScore;
				matchInstance.status	=	match.status;

				matchInstance.save(function(err){
					if (err) throw err;
					console.log('New Team: ' + match.id + ' ' + match.homeScore + ' ' + match.awayScore + ' updated');
				});

			})

		});

		renderView(data);
	}


	request("http://worldcup.kimonolabs.com/api/matches?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
	  render(JSON.parse(body));
	});

	
*/




	function renderView(data){

		res.render('pages/home', {
	        isDev: process.env.NODE_ENV === "development",
			title: "About Me",
			data: data,
			helpers:{
	        },
	        layout: "main"
		});		
	}

	
	//	RENDER PAGE
	PredictionModel.aggregate({
		$match:{  
			score:{ 
				$gt: -1 
			}
		}
	}).group({
		_id: "$_user",
		totalScore:{
			$sum: "$score"
		}		
	}).sort({
		totalScore: -1
	}).exec(function(error, results){
		var len = results.length;
		results.forEach(function(record, index){
			UserModel
				.findOne({
					_id: mongoose.Types.ObjectId( record._id )
				})
				.exec(function(error, user){
					record.user = user;
					if(len - 1 === index){
						renderView(results);
					}
				});
				
		});


	});


	
};
