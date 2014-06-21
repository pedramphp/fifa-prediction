var shell = require('shelljs');

var child = shell.exec('node clean-collections.js', {async:false}, createUsers);

function updateUserPredictionScore(){
	var a = shell.exec('node update-prediction-scores.js', {async:false}, function(code, output){
		console.log("WE ARE DONE BABY");
	});
}


function insertUserPredictions(){
	shell.exec('node insert-user-prediction.js', {async:false}, updateUserPredictionScore);
}

function createEmptyPredictions(){
	shell.exec('node create-empty-prediction.js', {async:false}, insertUserPredictions);
}


function createMatches(){
	shell.exec('node create-matches.js', {async:false}, createEmptyPredictions);	
}

function createTeams(){
	shell.exec('node create-teams.js', {async:false}, createMatches);
}


function createUsers(data){
	shell.exec('node create-users.js', {async:false}, createTeams);
}