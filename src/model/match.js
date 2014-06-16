var mongoose =  require('mongoose');

var TeamModel = require('./team');

var matchSchema =  new mongoose.Schema({
	homeScore: Number,
	awayScore: Number,
	currentGameMinute: Number,
	startTime: Date,
	status: String,
	venue: String,
	group: String,
	awayTeamId: String,
	homeTeamId: String,
	id: String,
	type: String
});

matchSchema.statics.findByTeamNames = function (homeTeamName, awayTeamName, cb) {

	

	var that = this;
	TeamModel.find({
		name: {
			$in: [ awayTeamName, homeTeamName] 
		}
	}).exec(function(error, teams){
		if(error){
			throw  error;
		}
		if(teams.length < 2){
			console.log('One or Two team are not found', homeTeamName, awayTeamName);
		}
		
		var teamIds = [];
		var homeTeamId;
		var awayTeamId;

		
		teams.forEach(function(team){
			if(team.name === homeTeamName){
				homeTeamId = team.id;
			}else{
				awayTeamId = team.id;
			}

		});

		that.findOne({ 
	  		homeTeamId: homeTeamId, 
  			awayTeamId: awayTeamId
  		}, cb);

	});
}

var MatchModel = mongoose.model('Match', matchSchema);

module.exports = MatchModel;
