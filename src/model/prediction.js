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
			email: email.toLowerCase()
		})
		.exec(function(error, user){
			if(!user){
				cb();
				return;
			}
			that.findOne({ 
				_match: mongoose.Types.ObjectId(matchId),
				_user: mongoose.Types.ObjectId(user._id)
			}).populate({
				path: '_match _user'
			}).exec(cb);
		})

};

predictionSchema.statics.findByUserEmailAndMatchId = function(email, matchId, cb){
	var that = this;
	UserModel
		.findOne({
			firstname: email.toLowerCase().split(" ")[0],
			lastname: email.toLowerCase().split(" ")[1]
		})
		.exec(function(error, user){
			if(!user){
				cb();
				return;
			}
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