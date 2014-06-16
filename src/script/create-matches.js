var mongoose =  require('mongoose');
var MatchModel = require('../model/match');
var request = require('request');


mongoose.connect('mongodb://localhost/fifa');

function process(data){

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

}


request("http://worldcup.kimonolabs.com/api/matches?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
  process(JSON.parse(body));
});
