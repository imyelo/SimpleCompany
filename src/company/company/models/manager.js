var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var ManagerSchema = new Schema({
  username: {type: String},
  password: {type: String}
});

mongoose.model('Manager', ManagerSchema);