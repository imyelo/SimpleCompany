var models = require('../models');
var Site = models.Site;
var News = models.News;
var Carrer = models.Carrer;
var Manager = models.Manager;
var Util = require('../libs/util');
var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;
var news_ctrl = require('./news');
var carrer_ctrl = require('./carrer');
var manage_ctrl = require('./manage');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
  var render = function (site, news, carrer) {
    res.render('index', {
      title: res.site.company_name,
      category: 'home',
      site: site,
      list_news: news,
      list_carrer: carrer
    });
  };
  var opt = {skip: 0, limit: 5, sort: [['_id', 'desc']]};
  var proxy = EventProxy.create("site", "news", "carrer", render);
  proxy.once('error', function (err) {
    proxy.unbind();
    next(err);
  });
  get_site(function (err, site) {
    if (err) {
      return next(err);
    }
    proxy.emit("site", site);
  });
  news_ctrl.get_news_by_query({}, opt, function (err, news) {
    proxy.emit("news", news);
  });
  carrer_ctrl.get_carrer_by_query({}, opt, function (err, carrer) {
    proxy.emit("carrer", carrer);
  });
};

exports.install = function (req, res, next) {
  var method = req.method.toLowerCase();
  if (method === 'get') {
    get_site(function (err, site) {
      if (err) {
        return next(err);
      }
      if (!site) {
        var theSite = new Site({});
        theSite.save(function (err, newsite) {
          if (err) {
            return next(err);
          }
          // manager
          var username = "admin";
          var password = "admin";
          password = manage_ctrl.md5(password);
          var theManager = new Manager({
            username: username,
            password: password
          });
          theManager.save(function (err, manager) {
            if (err) {
              return next(err);
            }
            res.redirect('/');
          });
        });
      } else {
        res.redirect('/');
      }
    });
  }
};

exports.uninstall = function (req, res, next) {
  get_site(function (err, site) {
    if (err) {
      return next(err);
    }
    if (site) {
      site.remove();
      // manager
      var username = "admin";
      Manager.findOne({username: username}, function (err, manager) {
        if (err) {
          return next(err);
        }
        manager.remove(function(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      });
    } else {
      res.redirect('/');
    }
  });
};

exports.global = function (req, res, next) {
  get_site(function (err, site) {
    if (err) {
      return next(err);
    }
    if (site) {
      res.site = {};
      res.site.company_name = site.company_name;
      res.locals.company_name = site.company_name;
      return next();
    } else {
      res.site = {};
      res.site.company_name = 'Default Company';
      res.locals.company_name = 'Default Company';
      return next();
    }
  });
};

function get_site(cb) {
  Site.findOne({}, cb);
}
exports.get_site = get_site;
