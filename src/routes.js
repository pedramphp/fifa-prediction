"use strict";
var request = require('request');

var predictionsJSON = require('./predictions.json');


exports.home = function(req, res){


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
				console.log('no team found', homeTeamName, awayTeamName);
			}
			var teamIds = [];
			teams.forEach(function(team){
				teamIds.push(team.id);
			});

	  		that.findOne({ 
    	  		homeTeamId: teamIds[0], 
	  			awayTeamId: teamIds[1]
	  		}, cb);

		});
	}

	var MatchModel = mongoose.model('Match', matchSchema);


	var predictionSchema =  new mongoose.Schema({
		_user: { type: String, ref: 'User' },
		_match: { type: String, ref: 'Match' },
		homeScore: Number,
		awayScore: Number,
		score: Number
	});


	var PredictionModel = mongoose.model('Prediction', predictionSchema);
	

	/* INsert user predictions.

	predictionsJSON.users.forEach(function(user){
		user.matches.forEach(function(match){

			MatchModel.findByTeamNames(match[0], match[2], function(err, selectedMatch){
				if(!selectedMatch){
					console.log('FUCK it', selectedMatch);
					return;
				}
				console.log(selectedMatch, "selectedmatch");
			
				PredictionModel
					.findOne({ 
						_match: mongoose.Types.ObjectId(selectedMatch._id)
					})
					.exec(function(err, predictionRecord){
						if(!predictionRecord){
							console.log(' it was empty');
							return;
						}
						predictionRecord.homeScore = match[1];
						predictionRecord.awayScore = match[3];
						predictionRecord.save(function(err){
							console.log("saved it", arguments);

						});
					})
			});

		});
	});
	

	*/
	


	// Calculate Empty Prediction Records Per User.
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
				newPrediction.homeScore = 1;
				newPrediction.awayScore = 2;

				newPrediction.save(function(err){
					if (err) throw err;
					console.log('New Prediction: ' + match.id + ' ' + user.email + ' created');
				});

			});
		});
	}*/
	


	
	// Update Prediction Scores based On matches
/*
	var match,
		matchScoreDiff,
		predictioncoreDiff;

	PredictionModel
		.find()
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
	var users = [];
	users.push({
		firstname: 'mahdi',
		lastname: 'pedram',
		email: 'pedramphp@gmail.com'
	});

	users.forEach(function(user){

		var newuser = new UserModel();
		
		newuser.firstname=user.firstname;
		newuser.lastname= user.lastname;
		newuser.email= user.email;


		newuser.save(function(err){
			if (err) throw err;
			console.log('New User: ' + newuser.firstname + ' ' + newuser.lastname + ' created');
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
	var MatchModel = mongoose.model('Match', matchSchema);


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

	function renderView(data){



		res.render('pages/home', {
	        isDev: process.env.NODE_ENV === "development",
			title: "About Me",
			data: {
				title: "this is a title",
				data: data
			},
			helpers:{
	        },
	        layout: "main"
		});		
	}

	renderView({});



};
