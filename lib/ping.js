/**
 * Created by andreasgrimm on 12.10.16.
 */
var Q=require('q');
//var Db = require("../lib/db.js");

var ping = function() {
    this.name = "ping";

    this.ping = function(req) {
        var deferred = Q.defer();
        deferred.resolve({"Ping":"Pong with Method "});
        return deferred.promise;
    };
};

module.exports=ping;
