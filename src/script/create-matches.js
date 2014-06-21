var mongoose =  require('mongoose');
var MatchModel = require('../model/match');
var request = require('request');

var db = require('../db')();


function processData(data){
	var len = data.length;
	data.forEach(function(match, index){

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
			console.log('New Match: ' + match.id + ' created');
			if(len- 1 === index){
				 process && process.exit();
			}
		});

	});

}


request("http://worldcup.kimonolabs.com/api/matches?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
  processData(JSON.parse(body));
});
