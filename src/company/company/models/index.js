var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

require('./site');
require('./news');
require('./carrer');
require('./message');
require('./manager');

exports.Site = mongoose.model('Site');
exports.News = mongoose.model('News');
exports.Carrer = mongoose.model('Carrer');
exports.Message = mongoose.model('Message');
exports.Manager = mongoose.model('Manager');
