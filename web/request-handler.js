var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mime = require('mime');
var fetcher = require('../workers/htmlfetcher')

//////////////////////////////////////
// Handler Helper Functions
//////////////////////////////////////

var buildData = function(req, callback) {

  var body = '';

  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
     var url = body.split('=')[1]
     callback(url);
  });

};

var checkArchiveStatus = function(url, res) {
  var message = '';
  var filePath;
  archive.isUrlArchived(url, function(bool) {
    if(bool) {
      filePath = archive.paths.archivedSites + '/' + url;
      message = 'Serve archived page.';
    } else {
      filePath = archive.paths.siteAssets + '/loading.html';
      message = 'Unarchived page is being fetched.';
    }
    helpers.serveAssets(res, filePath, function () {
      console.log(message);
    });
  });
};

var addUrl = function(url, res) {
  archive.addUrlToList(url, function(message) {
    message = message || 'Url added to sites.txt'
    console.log(message);
    // leave this call here if cron job isn't configurated
    // fetcher.fetcher();
  });

  helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function () {
    console.log('Serve loading page.');
  });
};

//////////////////////////////////////
// All Requests Handler
//////////////////////////////////////

exports.handleRequest = function (req, res) {
  console.log(req.type);
  var method = req.method;
  if(actions[method]) {
    actions[method](req, res);
  } else {
    res.writeHead(404, helpers.headers);
    res.end('off limits braaah');
  }
};
//////////////////////////////////////
// POST Handler Logic
//////////////////////////////////////

var handlePost = function (req, res) {
  buildData(req, function handleData(url) {
    archive.isUrlInList(url, function inList(bool) {
      if(!bool) {
        addUrl(url, res);
      } else {
        checkArchiveStatus(url, res);
      }
    });
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

exports.serveFile = function (req, res) {
  var route = url.parse(req.url);
  var filename = route.pathname === '/' ? '/index.html' : route.pathname;
  var mimeType = mime.lookup(route.pathname);
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

