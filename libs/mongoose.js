var mongoose = require('mongoose');
var log = require('./log')(module);
var config = require('./config');


mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function(err) {
  log.error('connection error:', err.message);
});
db.once('open', function callback() {
  log.info('Connected to DB!');
});

var Schema = mongoose.Schema;

// Schemas



var Photo = new Schema({
  name: {type: String, required: true},
  path: {type: String, required: true},
  description: {type: String, required: true},
  vkID: {type: Number, required: false},

});



var PhotoModel = mongoose.model('Photo', Photo);



module.exports.PhotoModel = PhotoModel;