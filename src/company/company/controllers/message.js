var models = require('../models');
var Message = models.Message;
var Util = require('../libs/util');
var config = require('../config').config;

exports.add = function (req, res, next) {
  var method;
  method = req.method.toLowerCase();
  if (method === 'get') {
    res.render('message/add', {
      title: res.site.company_name,
      category: 'message'
    });
  }
  if (method === 'post') {
    var title = req.body.title;
    var name = req.body.name;
    var email = req.body.email;
    var content = req.body.content;
    var theMessage = new Message({
      title: title,
      name: name,
      email: email,
      content: content
    });
    theMessage.save(function (err, message) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
};

function get_message_by_id(id, cb) {
  Message.findById(id, cb);
}
function get_message_by_query(query, opt, cb) {
  Message.find(query, null, opt, cb);
}

exports.get_message_by_id = get_message_by_id;
exports.get_message_by_query = get_message_by_query;