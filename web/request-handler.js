var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mime = require('mime');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  res.end(archive.paths.list);
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

