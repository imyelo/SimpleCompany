var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var CarrerSchema = new Schema({
  department: {type: String},
  job: {type: String},
  place: {type: String},
  amount: {type: String},
  description: {type: String},
  create_at: {type: Date, default: Date.now}
});

mongoose.model('Carrer', CarrerSchema);