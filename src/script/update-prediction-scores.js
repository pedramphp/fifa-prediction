// #4: Update Prediction Scores based On matches - checks the DB - RUN THIS EVERY DAY.

var mongoose =  require('mongoose');
var PredictionModel = require('../model/prediction');
var MatchModel = require('../model/match');


var db = require('../db')();

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
		var len = predictions.length;
		predictions.forEach(function(prediction, index){
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

				console.log("Prediction Score update", prediction);
				if(len -1 === index){

					console.log('prediction finished');
					process.exit();
				}
			});
		});
	});