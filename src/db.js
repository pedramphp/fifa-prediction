var db_name = 'fifa';
//provide a sensible default for local development
mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

var mongoose =  require('mongoose');

var db;


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + mongodb_connection_string);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('SIGINT - Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

function disconnect(start){
      mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        if( start){
            db = mongoose.connect(mongodb_connection_string);
        }
      });
}

module.exports = function(){
    disconnect(true);
    return {
      load: function(){

      },
      instance: db,
      disconnect: function(){
        disconnect();
      }
    }
};