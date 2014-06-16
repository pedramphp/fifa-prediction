"use strict";
var request = require('request');

var predictionsJSON = require('./predictions.json');
var usersJSON = require('./users.json');


var request = require("request");
var mongoose =  require('mongoose')
mongoose.connect('mongodb://localhost/fifa');

var TeamModel = require('./model/team');
var UserModel = require('./model/user');
var PredictionModel = require('./model/prediction');



exports.home = function(req, res){



// #1: Creating All Users Record - One time job	
// #2 : Create Empty Prediction Records Per User. One time Job	
// #3 -Insert user predictions to DB. ONE TIME ONLY
// #4: Update Prediction Scores based On matches - checks the DB - RUN THIS EVERY DAY.




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