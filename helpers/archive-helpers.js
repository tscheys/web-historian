var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {

  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if(!err) {
      console.log(data);
      data = data.split('\n');
      cb(data);
    }
  })
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
      exports.readListOfUrls(function(urls) {
        
        urls.push(url); 
        urls = urls.join('\n');

        fs.writeFile(exports.paths.list, urls, function(err) {

        });

      });
      cb();
    }
  });
};

exports.isUrlArchived = function(url, cb) {
  console.log('isUrlArchived was called')
  exports.isUrlInList(url, function (bool) {
    if(bool) {
      var pathName = exports.paths.archivedSites + '/' + url;
      console.log('path: ' + pathName);
      fs.stat(pathName, function(err, stats) {
        console.dir('stats object: ' + stats);
        cb(stats.isFile());
      });
    }
    else {console.log('in the else statement')}
  });
};

exports.downloadUrls = function(urls) {
  //should use htmlfetcher.js to scrape the url for html content
};
