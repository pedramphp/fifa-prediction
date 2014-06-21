var mongoose =  require('mongoose');
var TeamModel = require('../model/team');
var request = require('request');
var db = require('../db')();
console.log('AFTER DB COnnection');


function processData(data){
	var len = data.length;
	data.forEach(function(team, index){

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
			if(len- 1 === index){
				 process && process.exit();
			}
		});

	});
}


request("http://worldcup.kimonolabs.com/api/teams?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a", function(err, response, body) {
  processData(JSON.parse(body));
});