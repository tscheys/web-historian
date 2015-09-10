// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');


exports.fetcher = function () {
  // do stuff
  // get the urls 
  archive.readListOfUrls(function(urls) {
    archive.downloadUrls(urls);
  });

  // with the callback do stuff on that array 
    // 
    // call download urls  = > extra package http-get 


};