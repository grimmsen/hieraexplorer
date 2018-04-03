/**
 * Created by andreasgrimm on 12.10.16.
 */
const Q = require('q');
const yaml = require('yamljs');
const fs = require('fs');
const DeepMerge = require('deep-merge');
const merge = DeepMerge(function mergeStrategy(target,source,key) {
  return source;
});

var config = function(path) {
    this.name = "config";

    this.reload = function(req) {
      var deferred = Q.defer();
      config = yaml.load(path);
      if(req.query.token!==config.server.token.toString()) {
        deferred.reject('not authorized');
      } else {
        deferred.resolve();
      }
      process.kill(process.pid,'SIGUSR1');
      return deferred.promise;
    }

    this.config = function(req) {
        var deferred = Q.defer();
        var method = req.method;
        var param = req.params.param;

        var config = {};
        if(fs.existsSync(path)) {
          config = yaml.load(path);
        } else {
          deferred.reject('config not found');
          return deferred.promise;
        }
        if(req.query.token!==config.server.token) {
          deferred.reject('not authorized');
          return deferred.promise;
        }
        switch (method.toLowerCase()) {
          // get a value
          case "get":
            var ret = config;
            if(param) {
              var keys = param.split(".");
              for(k in keys) {
                ret = ret[keys[k]];
              }
            }
            if(typeof(ret)!=='object') {
              ret = { value : ret }; 
            }
            deferred.resolve(ret);
            break;
          // change a value
          case "put":
            var ret = ""
            if(param) {
              var keys = param.split(".").reverse();
              console.log(req.body.value);
              for(k in keys) {
                last=(k==0)?req.body.value:ret;
                ret = '{"'+keys[k]+'":'+last+'}';
              }
            }
            config = merge(config,JSON.parse(ret));
            fs.writeFileSync(path,yaml.stringify(config,10));
            console.log(yaml.stringify(config,10));
            deferred.resolve({result:'ok'});
            break;
          default:
            deferred.reject({'error':'no handler'});
        }
        return deferred.promise;
    };
};

module.exports=config;
