const Q = require('q');
const fs = require('fs');
const yaml = require('yamljs');
const DeepMerge = require('deep-merge');
const merge = DeepMerge(function mergeStrategy(target,source,key) {
    return [].concat(target,source);
});

var hiera = function() {
  this.name = "hiera";

  var walkYAML = function(yaml,attach) {
    for(var k in yaml) {
      if(typeof(yaml[k])==='object') {
        walkYAML(yaml[k],attach)
      } else {
        if(typeof(yaml[k]==="string")) {
          yaml[k]=yaml[k]+" <- "+attach;
        }
      }
    }
  };

  var getValues = function(hostname) {
    const resolve = yaml.load('conf/hieraexplorer.yaml').hieradata.resolve;
    const keyregex = /%\{[:.a-z]+\}/mig;
    var ret = [];
    const match = resolve.match(keyregex);
    var extractregex=resolve;
    for(var k in match) {
      extractregex=extractregex.replace(match[k],"(.*)");
    }
    var values = hostname.match(new RegExp(extractregex));
    var ret = {};
    for(var k=1; k<values.length; k++) {
      ret[match[k-1]]=values[k];
    }
    return ret;
  };

  this.renderJSON = function(req) {
    var deferred = Q.defer();
    const vals = getValues(req.params.param);
    var hierarchy = yaml.load('conf/hieraexplorer.yaml').hieradata.hierarchy.reverse();
    var path = yaml.load('conf/hieraexplorer.yaml').hieradata.path;
    for(var k in hierarchy) {
      for(var j in vals) {
        hierarchy[k]=hierarchy[k].replace(j,vals[j]);
      }
      hierarchy[k]=path+"/"+hierarchy[k]+".yaml";
    }
    var res = {};
    var globfile = [];
    for(var k in hierarchy) {
      if(fs.existsSync(hierarchy[k])) {
        var tmp = yaml.load(hierarchy[k]);
        walkYAML(tmp,hierarchy[k]);
        res = merge(res,tmp);
        globfile.push(hierarchy[k]);
      }
    }
    
    yamlarr = yaml.stringify(res,10).split("\n");
    ret=[];
    globfile = globfile.reverse();
    for(var k in yamlarr) {
      var line=yamlarr[k];
      var file=null;
      for(var t in globfile) {
        if(line.indexOf(globfile[t])>=0) {
          file = globfile[t];
          continue;
        }
      }
      ret.push({"file":file,"line":line.replace(" <- "+file,"")});
    }   
    deferred.resolve(ret);
    return deferred.promise;
  };
  
  this.rawFile = function(req) {
    var deferred = Q.defer();
    switch (req.method.toLowerCase()) {
      case 'post':
        if(req.body.content===undefined) {
          deferred.resolve(fs.readFileSync(req.body.filename).toString());
        } else {
          fs.writeFileSync(req.body.filename,req.body.content);
          deferred.resolve({'ok':'ok'});
        }
        break;
      default:
        deferred.reject({});
    }
    return deferred.promise;
  }

};

module.exports=hiera;
