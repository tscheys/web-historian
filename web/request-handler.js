var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mime = require('mime');
// require more modules/folders here!


var buildData = function(req, callback) {

  var body = '';

  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    callback(body);
  });
};

var handlePost = function (req, res) {
  var url;
  buildData(req, function(data) {
    url = data;
  });
};

var actions = {
  'POST': handlePost
};

exports.handleRequest = function (req, res) {
  console.log('handleRequest');
  // var route = url.parse(req.url);
  var method = req.method;
  console.log(method);
  if(actions[method]) {

    actions[method](req, res);

    res.writeHead(200, helpers.headers);
    res.end('end of post response brahh');
  } else {
    res.writeHead(404, helpers.headers);
    res.end('off limits braaah');
  }
};



exports.serveFile = function (req, res) {
  
  var route = url.parse(req.url);
  var filename = route.pathname === '/' ? '/index.html' : route.pathname;

  var mimeType = mime.lookup(route.pathname);
  //this probably changes the object in memory, maybe refactor
  var headers = helpers.headers['Content-Type'] = mimeType;
  res.writeHead(200, headers);
  fs.readFile(__dirname + '/public' + filename, function(err, data) {
    if(err) {
      console.log("Your shit broke, yo.");
    } else {
      res.end(data);
    }
  });

};

