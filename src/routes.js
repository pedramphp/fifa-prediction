"use strict";
var request = require('request');

var predictionsJSON = require('./predictions.json');
var usersJSON = require('./users.json');
var flagsJSON = require('./flags.json');

var request = require("request");
var mongoose =  require('mongoose');
var _ = require('underscore');

var db = require('./db')();


var TeamModel = require('./model/team');
var UserModel = require('./model/user');
var PredictionModel = require('./model/prediction');
var MatchModel = require('./model/match');
var moment = require('moment');

var helpers = {
	getTeamName: function(teamId){
		return this.teams.filter(function(team){
			return team.id === teamId;
		})[0].name;
	},

	getTeamPic: function(teamId){
		return this.teams.filter(function(team){
			return team.id === teamId;
		})[0].logo;
	},

	getMatchScore: function(score){
		return score >= 0 ? score : '-'; 
	},

	getScoreType: function(score){
		var types ={
			'-1': 'not-started',
			'0': 'wrong',
			'1': 'correct-win',
			'3': 'correct-win-goal-diff',
			'5': 'correct'
		}
		return types[score];

	},
	getDate: function(date){
		return moment(date).format("MMM Do - HH:mm zz");
	},
	getTeamFlag: function(teamId){
		var that = (this.data && this.data[0]) || this;

		var teamName = that.teams.filter(function(team){
			return team.id === teamId;
		})[0].name;

		var teamShortName = flagsJSON[teamName];
		if(teamShortName){
			return "http://img.fifa.com/images/flags/4/" + teamShortName + ".png";
		}
		return "no";
	}
};

exports.userMatch = function(req, res){
	function renderView(data){

		res.render('pages/user-matches', {
	        isDev: process.env.NODE_ENV === "development",
			title: "About Me",
			data: data,
			helpers: helpers,
	        layout: "main"
		});

	}

	var userId = req.param('userId');

	PredictionModel.find({ 
		_user: mongoose.Types.ObjectId(userId)
	}).populate({
		path: '_match _user'
	}).lean().exec(function(error, predictions){

		predictions.sort(function(a, b){

			if (new Date(a._match.startTime) > new Date(b._match.startTime))
		      return 1;

			if (new Date(a._match.startTime) < new Date(b._match.startTime))
			 		      return -1;
		    // a must be equal to b
		    return 0;
		});

		var p, ps = [];
		var len = predictions.length;
		predictions.forEach(function(prediction, index){
			TeamModel.findTeamsById([prediction._match.homeTeamId,prediction._match.awayTeamId], function(err, teams){
				prediction.teams = teams;
				
				if(len - 1 === index){

					renderView(predictions);
				}
			});
		});
	});

//	renderView({});

};

exports.matchPrediciotns = function(req, res){

	function renderView(data){

		res.render('pages/match-predictions', {
	        isDev: process.env.NODE_ENV === "development",
			title: "About Me",
			data: data,
			helpers: helpers,
	        layout: "main"
		});	
	}

	var matchId = req.param('matchId');

	PredictionModel.find({ 
		_match: mongoose.Types.ObjectId(matchId)
	}).populate({
		path: '_match _user'
	}).sort({
		score: -1
	}).lean().exec(function(error, predictions){



		var p, ps = [];
		var len = predictions.length;
		var i = 0;
		predictions.forEach(function(prediction, index){
			TeamModel.findTeamsById([prediction._match.homeTeamId,prediction._match.awayTeamId], function(err, teams){
				prediction.teams = teams;
			

				if(len - 1 !== i){
					i++;
					return;
				}
				console.log('GIT HERE');
				predictions.sort(function(a, b){

					var aScore = a.score;
					var bScore = b.score;
					
					if(aScore === bScore){
						if(a._user.firstname === b._user.firstname){
							return 0
						}
						return a._user.firstname > b._user.firstname ? 1 : -1;
					}
					return aScore > bScore ? -1 : 1;
								
				});
				renderView(predictions);
				
				i++;
			});
		});
	});


}

exports.home = function(req, res){

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
		results = JSON.parse(JSON.stringify(results));
		if(!results){
			renderView(results);
		}

		var len = results.length;
		var i = 0;
		results.forEach(function(record, index){
			UserModel
				.findOne({
					_id: mongoose.Types.ObjectId( record._id )
				})
				.lean()
				.exec(function(error, user){
					record.user = user;
					if(len - 1 !== i){
						i++;
						return;
					}
					results.sort(function(a, b){
						var aScore = a.totalScore;
						var bScore = b.totalScore;
						
						if(aScore === bScore){
							if(a.user.firstname === b.user.firstname){
								return 0
							}
							return a.user.firstname > b.user.firstname ? 1 : -1;
						}
						return aScore > bScore ? -1 : 1;
						

					});
					renderView(results);
					i++;
				});
				
		});
	});
};