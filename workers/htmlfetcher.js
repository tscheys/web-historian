// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');


exports.fetcher = function () {
  console.log('fetcher called!')
  archive.readListOfUrls(function(urls) {
    archive.downloadUrls(urls);
  });
};

exports.fetcher();