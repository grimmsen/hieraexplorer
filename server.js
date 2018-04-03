const express = require('express');
const bodyParser = require('body-parser');
const yaml = require('yamljs');
const request = require('sync-request');
const rest = require("./lib/rest/rest.js");

const instance = function() {
  app = express();
  this.close = function() { this.server.close(); };
  app.use('/',express.static('app'));
  app.use('/bower_components',express.static('bower_components'));
  app.use(bodyParser.urlencoded({extended:true}));

  conf = yaml.load("conf/hieraexplorer.yaml")['server'];
  if(JSON.parse(conf.ssl)) {
    console.log('SSL enabled');
  }

  const REST = new rest(app,conf.api.path);
  REST.buildAPI(conf.api.register).applyCallMaps(); 

  const port = JSON.parse(conf.port);
  console.log('Listening on port '+port);
  this.server=app.listen(port);
}

process.on('SIGUSR1',function() {
  module.exports.close();
  module.exports = new instance();
});

process.on('SIGTERM',function() {
  module.exports.close();
  console.log('Shutting down instance...');
  process.exit(0);
});

module.exports = new instance();
