var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var MessageSchema = new Schema({
  title: {type: String},
  name: {type: String},
  email: {type: String},
  content: {type: String},
  create_at: {type: Date, default: Date.now}
});

mongoose.model('Message', MessageSchema);