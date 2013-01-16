var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var SiteSchema = new Schema({
  company_name: {type: String, default: 'Company'},
  company_description: {type: String, default: 'description'},
  contact: {type: String},
  installed: {type: Boolean, default: false}
});

mongoose.model('Site', SiteSchema);