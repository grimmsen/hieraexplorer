/**
 * Created by andreasgrimm on 12.10.16.
 */
const reflection = require("./reflection");
const fs = require('fs');
const extend = require("extend");

var rest = function(server,path) {
    this.server = server;
    this.path = path;
    this.callmaps = [];
};

rest.prototype.buildAPI = function(objs) {
  ret = [];
  for ( k in objs ) {
    try {
      ref = require("../../lib/"+objs[k].name+".js");
      obj = new ref(objs[k].param);
      this.registerObject(obj);
    } catch (e) {
      console.log('rest.js: error while loading '+objs[k].name+', omitting');
      console.log(e);
    }
  }
  return this;
}

// put every function not beginning with a $ in obj into callmaps array
rest.prototype.registerObject = function (obj) {
    r = new reflection(obj);
    m = r.getAllMethods();
    for(var i=0; i<m.length;i++) {
        if(m[i].charAt(0)!=="$")
            console.log("rest.js: "+obj.name+"."+m[i]+" registered");
        this.callmaps[obj.name+"."+m[i]]=obj[m[i]];
    };
};

// serve http POST request for any registered function
rest.prototype.applyCallMaps = function () {
    var self=this;

    var handle_request = function (req,res) {
        var key = req.params.objName+"."+req.params.method;
        if (self.callmaps[key] === undefined) {
            res.status(501).json({'error': 'not implemented'});
        } else {
            try {
                // call the function with name method in object objName
                // stored in the callmaps array
                self.callmaps[req.params.objName + "." + req.params.method](req)
                    .then(function (result) {
                        res.status(200).json(result);
                    })
                    .catch(function (err) {
                        res.status(500).json({'error':err});
                    })
                    .done();
            } catch (e) {
                // the function is not using a promise
                console.log(e);
                res.status(500).json({"error": "function seems not promised"});
            }
        }
    };
    this.server.all(this.path+"/:objName/:method", handle_request);
    this.server.all(this.path+"/:objName/:method/:param", handle_request);
};

module.exports = rest;
