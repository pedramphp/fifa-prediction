var mongoose =  require('mongoose');
var MatchModel = require('../model/match');
var request = require('request');
//#1: Creating All Users Record - One time job

var db = require('../db')();



function process(data){
	var len = data.length;
	data.forEach(function(match, index){
		if(match.status !== 'Final'){
			return;
		}
	
		MatchModel.findOne({
			id: match.id,
			status:{
				 $in:['Pre-game','In-progress']
			}
		}).exec(function(err, matchInstance){
			
			if(!matchInstance ){
				console.log('no match found');
				return;
			}

			matchInstance.homeScore	=	match.homeScore;
			matchInstance.awayScore	=	match.awayScore;
			matchInstance.status	=	match.status;

			matchInstance.save(function(err){
				if (err) throw err;
				console.log('Update match score: Team: ' + match.id + ' ' + match.homeScore + ' ' + match.awayScore + ' updated');
				if( index === len -1){
					process.exit();
				}
			});

		})

	});
}

request("http://worldcup.kimonolabs.com/api/matches?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
  process(JSON.parse(body));
});
