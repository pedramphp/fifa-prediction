var shell = require('shelljs');

var child = shell.exec('node update-match-scores', {async:false}, updateUserPredictionScore);

function updateUserPredictionScore(){
	var a = shell.exec('node update-prediction-scores.js', {async:false}, function(code, output){
		console.log("WE ARE DONE BABY");
	});
}