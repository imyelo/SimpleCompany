var models = require('../models');
var News = models.News;
var Util = require('../libs/util');
var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;

exports.index = function (req, res, next) {
  var page = Number(req.query.p) || 1;
  var limit = config.list_news_count;

  var render = function (list_news) {
    for (var i in list_news) {
      list_news[i].friendly_create_at = Util.format_date(list_news[i].create_at, true);
    }
    res.render('news/index', {
      title: 'News - ' + res.site.company_name,
      category: 'news',
      list_news: list_news
    });
  };

  var query = {};
  var opt = {skip: (page - 1) * limit, limit: limit, sort: [['_id', 'desc']]};
  get_news_by_query(query, opt, function (err, list_news) {
    if (err) {
        return next(err);
    }
    render(list_news);
  });
};

exports.single = function (req, res, next) {
  var id = req.params.id;
  var render = function (single_news) {
    single_news.friendly_create_at = Util.format_date(single_news.create_at, true);
    res.render('news/single', {
      title: single_news.title + ' - ' + res.site.company_name,
      category: 'news',
      single_news: single_news
    });
  };
  get_news_by_id(id, function (err, news) {
    if (err) {
        return next(err);
    }
    render(news);
  });
};

exports.create = function (req, res, next) {
  var title = req.query.title;
  var content = req.query.content;
  var theNews = new News({title: title, content: content});
  theNews.save();
};

function get_news_by_id (id, cb) {
  News.findById(id, cb);
}
function get_news_by_query(query, opt, cb) {
  News.find(query, null, opt, cb);
}

exports.get_news_by_query = get_news_by_query;
exports.get_news_by_id = get_news_by_id;