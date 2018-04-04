const fs = require('fs');
const crypto = require('crypto');
const sign = crypto.createSign('RSA-SHA256');


const authServer = function(privKey, authFunction) {
  this.privKey = privKey;
  this.authFunction = authFunction;
  this.createToken = function(u,p) {
    const data = this.authFunction(u,p);
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(data));
    return new Buffer(JSON.stringify(data)).toString("base64") + "." + sign.sign(privKey, 'base64');
  }
  return this;
}

module.exports = authServer;
