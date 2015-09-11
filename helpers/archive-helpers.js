var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../web/archives/sites'),
  list: path.join(__dirname, '../web/archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(cb) {
  //returns array of urls
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if(!err) {
      data = data.split('\n');
      data = data.slice(0, data.length - 1);
      cb(data);
    }
  });
};

exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls(function (urls) {
    var exists = _.contains(urls, url);
    cb(exists);
  });
};

exports.addUrlToList = function(url, cb) {
  exports.isUrlInList(url, function (bool) {
    if(!bool) {
      fs.appendFile(exports.paths.list, url + '\n', function (err) {
        cb(err);
      });
    }
  });
};

exports.isUrlArchived = function(url, cb) {
  exports.isUrlInList(url, function (bool) {
    if(bool) {
      var pathName = exports.paths.archivedSites + '/' + url;

      fs.stat(pathName, function(err, stats) {
        !stats ? cb(false) : cb(stats.isFile());
      });
    }
  });
};

exports.downloadUrls = function(urls) {
  //iterate over urls, run http-get on every url
  _.each(urls, function(url) {
    // var filePath = fs.writeFile
    var filePath = exports.paths.archivedSites + '/' + url;
    console.log('filepath: ' + filePath);
    httpRequest.get(url, filePath, function(err, res) {
      if(err) {
        console.log(err);
      }
      console.log("downloading urls");
    });
  });


};
