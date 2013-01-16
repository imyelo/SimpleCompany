var models = require('../models');
var Site = models.Site;
var News = models.News;
var Carrer = models.Carrer;
var Message = models.Message;
var Manager = models.Manager;
var Util = require('../libs/util');
var config = require('../config').config;
var crypto = require('crypto');
var EventProxy = require('eventproxy').EventProxy;
var site_ctrl = require('./site');
var news_ctrl = require('./news');
var carrer_ctrl = require('./carrer');
var message_ctrl = require('./message');

exports.global = function (req, res, next) {
  var method, company_name, company_description, site, id, render;
  method = req.method.toLowerCase();
  if (method === 'post') {
    company_name = req.body.company_name;
    company_description = req.body.company_description;
    site_ctrl.get_site(function (err, site) {
      if (err) {
        return next(err);
      }
      id = site._id;
      Site.update({_id: id}, {
        company_name: company_name, company_description: company_description
      }, function (err, newsite) {
        if (err) {
          return next(err);
        }
        res.redirect('/manage/global');
      });
    });
  }
  if (method === 'get') {
    render = function (site) {
      res.render('manage/global', {
        layout: 'manage_layout',
        title: 'Simple Company',
        pageName: 'global',
        site: site
      });
    };
    site_ctrl.get_site(function (err, site) {
      if (err) {
        return next(err);
      }
      render(site);
    });
  }
};

exports.login = function (req, res, next) {
  var method = req.method.toLowerCase();
  if (method === 'get') {
    res.render('manage/login', {
      title: '登录管理系统' + res.site.company_name,
      category: 'home'
    });
  }
  if (method === 'post') {
    var username = req.body.username.trim();
    var password = md5(req.body.password.trim());
    if (!username || !password) {
      return res.redirect('/manage/login');
    }
    Manager.findOne({username: username}, function (err, manager) {
      if (err) {
        return next(err);
      }
      if (!manager) {
        return res.redirect('/manage/login');
      }
      if (manager.password !== password) {
        return res.redirect('/manage/login');
      }
      req.session.manager = username;
      return res.redirect('/manage');
    });
  }
};

exports.logout = function (req, res, next) {
  req.session.destroy();
  res.redirect(req.headers.referer || '/');
};

exports.chgpsw = function (req, res, next) {
  var method = req.method.toLowerCase();
  if (method === 'get') {
    res.render('manage/chgpsw', {
      layout: 'manage_layout',
      title: 'Simple Company',
      pageName: 'chgpsw'
    });
  }
  if (method === 'post') {
    var username = req.session.manager;
    var oldpsw = md5(req.body.oldpsw.trim());
    var newpsw = md5(req.body.newpsw.trim());
    var repsw = md5(req.body.repsw.trim());
    if (newpsw !== repsw) {
      return res.redirect('/manage/chgpsw');
    }
    Manager.update({username: username, password:oldpsw}, {password: newpsw}, function (err, manager) {
      if (err) {
        return next(err);
      }
      if (manager) {
        return res.redirect('/manage');
      } else {
        return res.redirect('/manage/chgpsw');
      }
    });
  }
};

exports.news = {};

exports.news.index = function (req, res, next) {
  var page = Number(req.query.p) || 1;
  var limit = config.list_news_count;

  var render = function (list_news) {
    for (var i in list_news) {
      list_news[i].friendly_create_at = Util.format_date(list_news[i].create_at, true);
    }
    res.render('manage/news/index', {
      layout: 'manage_layout',
      title: 'Simple Company',
      pageName: 'news',
      list_news: list_news
    });
  };

  var query = {};
  var opt = {skip: (page - 1) * limit, limit: limit, sort: [['_id', 'desc']]};
  news_ctrl.get_news_by_query(query, opt, function (err, list_news) {
    if (err) {
        return next(err);
    }
    render(list_news);
  });

};

exports.news.add = function (req, res, next) {
  var method = req.method.toLowerCase();
  if (method === 'get') {
    res.render('manage/news/add', {
      layout: 'manage_layout',
      title: 'Simple Company',
      pageName: 'news/add'
    });
  }
  if (method === 'post') {
    var title = req.body.title;
    var content = req.body.content;
    var theNews = new News({title: title, content: content});
    theNews.save(function (err, news) {
      if (err) {
        return next(err);
      }
      res.redirect('/manage/news');
    });
  }
};

exports.news.edit = function (req, res, next) {
  var method, id, render,title, content;
  method = req.method.toLowerCase();
  if (method === 'get') {
    id = req.params.id;

    render = function (single_news) {
      res.render('manage/news/edit', {
        layout: 'manage_layout',
        title: 'Simple Company',
        pageName: 'news',
        single_news: single_news
      });
    };
    news_ctrl.get_news_by_id(id, function (err, news) {
      if (err) {
        return next(err);
      }
      render(news);
    });
  }
  if (method === 'post') {
    id = req.params.id;
    title = req.body.title;
    content = req.body.content;
    News.update({_id: id}, {title: title, content: content}, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/manage/news');
    });
  }
};

exports.news.del = function (req, res, next) {
  var id, method;
  method = req.method.toLowerCase();
  if (method === 'get') {
    id = req.params.id;

    render = function (single_news) {
      res.render('manage/news/del', {
        layout: 'manage_layout',
        title: 'Simple Company',
        pageName: 'news',
        single_news: single_news
      });
    };
    news_ctrl.get_news_by_id(id, function (err, news) {
      if (err) {
        return next(err);
      }
      render(news);
    });
  }
  if (method === 'post') {
    id = req.params.id;

    news_ctrl.get_news_by_id(id, function (err, news) {
      if (err) {
        return next(err);
      }
      news.remove(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/manage/news');
      });
    });
  }
};

exports.carrer = {};

exports.carrer.index = function (req, res, next) {
  var page = Number(req.query.p) || 1;
  var limit = config.list_news_count;

  var render = function (list_carrer) {
    for (var i in list_carrer) {
      list_carrer[i].friendly_create_at = Util.format_date(list_carrer[i].create_at, true);
    }
    res.render('manage/carrer/index', {
      layout: 'manage_layout',
      title: 'Simple Company',
      pageName: 'carrer',
      list_carrer: list_carrer
    });
  };

  var query = {};
  var opt = {skip: (page - 1) * limit, limit: limit, sort: [['_id', 'desc']]};
  carrer_ctrl.get_carrer_by_query(query, opt, function (err, list_carrer) {
    if (err) {
        return next(err);
    }
    render(list_carrer);
  });
};

exports.carrer.add = function (req, res, next) {
  var method;
  method = req.method.toLowerCase();
  if (method === 'get') {
    res.render('manage/carrer/add', {
      layout: 'manage_layout',
      title: 'Simple Company',
      pageName: 'carrer/add'
    });
  }
  if (method === 'post') {
    var department = req.body.department;
    var job = req.body.job;
    var place = req.body.place;
    var amount = req.body.amount;
    var description = req.body.description;
    var theCarrer = new Carrer({
      department: department,
      job: job,
      place: place,
      amount: amount,
      description: description
    });
    theCarrer.save(function (err, carrer) {
      if (err) {
        return next(err);
      }
      res.redirect('/manage/carrer');
    });
  }
};

exports.carrer.edit = function (req, res, next) {
  var method, id, render, department, job, place, amount, description;
  method = req.method.toLowerCase();
  if (method === 'get') {
    id = req.params.id;

    render = function (single_carrer) {
      res.render('manage/carrer/edit', {
        layout: 'manage_layout',
        title: 'Simple Company',
        pageName: 'carrer',
        single_carrer: single_carrer
      });
    };
    carrer_ctrl.get_carrer_by_id(id, function (err, carrer) {
      if (err) {
        return next(err);
      }
      render(carrer);
    });
  }
  if (method === 'post') {
    id = req.params.id;
    department = req.body.department;
    job = req.body.job;
    place = req.body.place;
    amount = req.body.amount;
    description = req.body.description;
    Carrer.update({_id: id}, {
        department: department,
        job: job,
        place: place,
        amount: amount,
        description: description
      }, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/manage/carrer');
    });
  }
};

exports.carrer.del = function (req, res, next) {
  var id, method;
  method = req.method.toLowerCase();
  if (method === 'get') {
    id = req.params.id;
    render = function (single_carrer) {
      res.render('manage/carrer/del', {
        layout: 'manage_layout',
        title: 'Simple Company',
        pageName: 'carrer',
        single_carrer: single_carrer
      });
    };
    carrer_ctrl.get_carrer_by_id(id, function (err, carrer) {
      if (err) {
        return next(err);
      }
      render(carrer);
    });
  }
  if (method === 'post') {
    id = req.params.id;
    carrer_ctrl.get_carrer_by_id(id, function (err, carrer) {
      if (err) {
        return next(err);
      }
      carrer.remove(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/manage/carrer');
      });
    });
  }
};

exports.message = {};

exports.message.index = function (req, res, next) {
  var page = Number(req.query.p) || 1;
  var limit = config.list_news_count;

  var render = function (list_message) {
    for (var i in list_message) {
      list_message[i].friendly_create_at = Util.format_date(list_message[i].create_at, true);
    }
    res.render('manage/message/index', {
      layout: 'manage_layout',
      title: 'Simple Company',
      pageName: 'message',
      list_message: list_message
    });
  };

  var query = {};
  var opt = {skip: (page - 1) * limit, limit: limit, sort: [['_id', 'desc']]};
  message_ctrl.get_message_by_query(query, opt, function (err, list_message) {
    if (err) {
        return next(err);
    }
    render(list_message);
  });
};

exports.message.single = function (req, res, next) {
  var id = req.params.id;
  var render = function (single_message) {
    single_message.friendly_create_at = Util.format_date(single_message.create_at, true);
    res.render('manage/message/single', {
      layout: 'manage_layout',
      title: 'Simple Company',
      pageName: 'message',
      single_message: single_message
    });
  };
  message_ctrl.get_message_by_id(id, function (err, message) {
    if (err) {
        return next(err);
    }
    render(message);
  });
};

exports.checkPermission = function (req, res, next) {
  if (!checkPermission(req)) {
    res.redirect('/manage/login');
    return;
  }
  next();
};

function checkPermission (req) {
  if (!req.session.manager) {
    return false;
  }
  return true;
}

function gen_session(user, res) {
  var auth_token = encrypt(user._id + '\t'+user.name + '\t' + user.pass, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {path: '/',maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
}
function encrypt(str,secret) {
   var cipher = crypto.createCipher('aes192', secret);
   var enc = cipher.update(str,'utf8','hex');
   enc += cipher.final('hex');
   return enc;
}
function decrypt(str,secret) {
   var decipher = crypto.createDecipher('aes192', secret);
   var dec = decipher.update(str,'hex','utf8');
   dec += decipher.final('utf8');
   return dec;
}
function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

exports.md5 = md5;
