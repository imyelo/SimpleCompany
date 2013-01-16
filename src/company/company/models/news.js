var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var NewsSchema = new Schema({
  title: {type: String},
  create_at: {type: Date, default: Date.now},
  content: {type: String}
});

mongoose.model('News', NewsSchema);