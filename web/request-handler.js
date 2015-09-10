var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mime = require('mime');
var fetcher = require('../workers/htmlfetcher')
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
  buildData(req, function handleData(data) {


    var url = data.split('=')[1];

    archive.isUrlInList(url, function inList(bool) {
      if(!bool) {
        // addUrlToList
        archive.addUrlToList(url, function() {
          console.log('url added');
          // fetcher.fetcher();

        });
        // serve up loading.html
        helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function () {
          console.log('servin\' it up.');

        });
      } else {

        archive.isUrlArchived(url, function(bool) {

          console.log("bool for stats.isFile: " + bool);

          if(bool) {

            helpers.serveAssets(res, archive.paths.archivedSites + '/' + url, function() {
              console.log('serve up archived page');
            });

          } else {

            // fetcher.fetcher();
            helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function () {
              console.log('Unarchived page is being fetched.');
            });

          }
        });
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

exports.handleRequest = function (req, res) {
  console.log(req.type);
  var method = req.method;

  if(actions[method]) {

    actions[method](req, res);

    // res.writeHead(200, helpers.headers);
    // res.end('end of post response brahh');

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

