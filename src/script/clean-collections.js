var mongoose =  require('mongoose');
var TeamModel = require('../model/team');
var UserModel = require('../model/user');
var PredictionModel = require('../model/prediction');
var MatchModel = require('../model/match');

var db = require('../db');


TeamModel.remove({}, function(err) { 
   console.log('Team model empty'); 
});


UserModel.remove({}, function(err) { 
   console.log('User model empty'); 
});



MatchModel.remove({}, function(err) { 
   console.log('Match model empty'); 
});

PredictionModel.remove({}, function(err) { 
   console.log('PredictionModel model empty'); 
});