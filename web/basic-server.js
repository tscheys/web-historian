var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var helpers = require('./http-helpers');
var fs = require('fs');
var path = require('path');
var url = require('url');
// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize("./archives");

var port = 8080;
var ip = "127.0.0.1";
var router = {
  '/': handler.serveFile,
  '/styles.css': handler.serveFile,
  '/form-submit': handler.handleRequest
};
var server = http.createServer(function (req, res) {
  var route = url.parse(req.url).pathname;
  if(router[route]) {
    router[route](req, res);
  } else {
    res.writeHead(404, helpers.headers);
    res.end('not found');
  }
});

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
}



