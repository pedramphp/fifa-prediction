var mongoose =  require('mongoose');
var MatchModel = require('../model/match');
var request = require('request');
//#1: Creating All Users Record - One time job

mongoose.connect('mongodb://localhost/fifa');


function process(data){

	data.forEach(function(match){
		if(match.status !== 'Final'){
			return;
		}
	
		MatchModel.findOne({
			id: match.id,
			status: 'Pre-game'
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
				console.log('New Team: ' + match.id + ' ' + match.homeScore + ' ' + match.awayScore + ' updated');
			});

		})

	});
}

request("http://worldcup.kimonolabs.com/api/matches?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
  process(JSON.parse(body));
});