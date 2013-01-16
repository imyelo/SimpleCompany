var models = require('../models');
var Carrer = models.Carrer;
var Util = require('../libs/util');
var config = require('../config').config;

exports.index = function (req, res, next) {
  var page = Number(req.query.p) || 1;
  var limit = config.list_news_count;

  var render = function (list_carrer) {
    for (var i in list_carrer) {
      list_carrer[i].friendly_create_at = Util.format_date(list_carrer[i].create_at, true);
    }
    res.render('carrer/index', {
      title: '招聘 - ' + res.site.company_name,
      category: 'carrer',
      list_carrer: list_carrer
    });
  };

  var query = {};
  var opt = {skip: (page - 1) * limit, limit: limit, sort: [['_id', 'desc']]};
  get_carrer_by_query(query, opt, function (err, list_carrer) {
    if (err) {
        return next(err);
    }
    render(list_carrer);
  });
};

exports.single = function (req, res, next) {
  var id = req.params.id;
  var render = function (single_carrer) {
    single_carrer.friendly_create_at = Util.format_date(single_carrer.create_at, true);
    res.render('carrer/single', {
      title: single_carrer.title + ' - ' + res.site.company_name,
      category: 'carrer',
      single_carrer: single_carrer
    });
  };
  get_carrer_by_id(id, function (err, carrer) {
    if (err) {
        return next(err);
    }
    render(carrer);
  });
};

function get_carrer_by_id(id, cb) {
  Carrer.findById(id, cb);
}
function get_carrer_by_query(query, opt, cb) {
  Carrer.find(query, null, opt, cb);
}

exports.get_carrer_by_id = get_carrer_by_id;
exports.get_carrer_by_query = get_carrer_by_query;