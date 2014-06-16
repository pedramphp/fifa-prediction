var mongoose =  require('mongoose');
var UserModel = require('../model/user');

var predictionSchema =  new mongoose.Schema({
	_user: { type: String, ref: 'User' },
	_match: { type: String, ref: 'Match' },
	homeScore: Number,
	awayScore: Number,
	score: Number,
	status: String
});


predictionSchema.statics.findByUserEmailAndMatchId = function(email, matchId, cb){
	var that = this;
	UserModel
		.findOne({
			email: email
		})
		.exec(function(error, user){
			that.findOne({ 
				_match: mongoose.Types.ObjectId(matchId),
				_user: mongoose.Types.ObjectId(user._id)
			}).populate({
				path: '_match _user'
			}).exec(cb);
		})

};


var PredictionModel = mongoose.model('Prediction', predictionSchema);


module.exports = PredictionModel;