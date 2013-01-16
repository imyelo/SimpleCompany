var site = require('./controllers/site');
var news = require('./controllers/news');
var manage = require('./controllers/manage');
var carrer = require('./controllers/carrer');
var message = require('./controllers/message');

module.exports = function (app) {
  app.get('/', site.index);

  /* news */
  app.get('/news', news.index);
  app.get('/news/:id', news.single);
  
  /* carrer */
  app.get('/carrer', carrer.index);
  app.get('/carrer/:id', carrer.single);

  /* message */
  app.get('/message', message.add);
  app.post('/message/add', message.add);
  
  /* manage */
  app.get('/manage', manage.checkPermission, manage.global);
  app.get('/manage/global', manage.checkPermission, manage.global);
  app.post('/manage/global', manage.checkPermission, manage.global);

  app.get('/manage/login', manage.login);
  app.post('/manage/login', manage.login);
  app.get('/manage/logout', manage.checkPermission, manage.logout);

  app.get('/manage/chgpsw', manage.checkPermission, manage.chgpsw);
  app.post('/manage/chgpsw', manage.checkPermission, manage.chgpsw);

  app.get('/manage/news/add', manage.checkPermission, manage.news.add);
  app.get('/manage/news', manage.checkPermission, manage.news.index);
  app.get('/manage/news/edit/:id', manage.checkPermission, manage.news.edit);
  app.get('/manage/news/del/:id', manage.checkPermission, manage.news.del);
  app.post('/manage/news/add', manage.checkPermission, manage.news.add);
  app.post('/manage/news/edit/:id', manage.checkPermission, manage.news.edit);
  app.post('/manage/news/del/:id', manage.checkPermission, manage.news.del);

  app.get('/manage/carrer/add', manage.checkPermission, manage.carrer.add);
  app.get('/manage/carrer', manage.checkPermission, manage.carrer.index);
  app.get('/manage/carrer/edit/:id', manage.checkPermission, manage.carrer.edit);
  app.get('/manage/carrer/del/:id', manage.checkPermission, manage.carrer.del);
  app.post('/manage/carrer/add', manage.checkPermission, manage.carrer.add);
  app.post('/manage/carrer/edit/:id', manage.checkPermission, manage.carrer.edit);
  app.post('/manage/carrer/del/:id', manage.checkPermission, manage.carrer.del);

  app.get('/manage/message', manage.checkPermission, manage.message.index);
  app.get('/manage/message/:id', manage.checkPermission, manage.message.single);

  /* install */
  app.get('/install', site.install);
  app.post('/install', site.install);
  app.post('/uninstall', site.uninstall);

};
