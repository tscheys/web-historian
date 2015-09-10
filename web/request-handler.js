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
  console.log('handlePOST');
  buildData(req, function(data) {
  
    var url = data.split('=')[1];
    // archive.isUrlArchived(url, function(bool) {
    //   console.log("archived: " + bool);
    // });

    archive.addUrlToList(url, function() {
      console.log('file written');
    });


    res.writeHead(302, 'Moved Temporarily', helpers.headers);
    res.end('end of post response brahh');

  });
};

var handleGet = function(req, res) {
  //do something
  var url = url.parse(req.url).pathname;
  //write head
  res.writeHead(200, helpers.headers);
  //end response
  res.end(archive.paths.archivedSites + '/' + url);
}

var actions = {
  'POST': handlePost,
  'GET': handleGet
};

exports.handleRequest = function (req, res) {
  console.log('handleRequest');
  var method = req.method;

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

