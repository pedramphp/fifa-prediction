"use strict";
var request = require('request');

var predictionsJSON = require('./predictions.json');
var usersJSON = require('./users.json');


var request = require("request");
var mongoose =  require('mongoose');
var _ = require('underscore');

var db = require('./db')();


var TeamModel = require('./model/team');
var UserModel = require('./model/user');
var PredictionModel = require('./model/prediction');
var MatchModel = require('./model/match');

exports.userMatch = function(req, res){
	function renderView(data){

		res.render('pages/user-matches', {
	        isDev: process.env.NODE_ENV === "development",
			title: "About Me",
			data: data,
			helpers:{
				getTeamName: function(teamId){
					return this.teams.filter(function(team){
						return team.id === teamId;
					})[0].name;
				},

				getTeamPic: function(teamId){
					return this.teams.filter(function(team){
						return team.id === teamId;
					})[0].logo;
				}
	        },
	        layout: "main"
		});

	}

	var userId = req.param('userId');

	PredictionModel.find({ 
		_user: mongoose.Types.ObjectId(userId),
		score: { 
			$ne: -1 
		}
	}).populate({
		path: '_match _user'
	}).lean().exec(function(error, predictions){
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

		if(!results){
			renderView(results);
		}

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