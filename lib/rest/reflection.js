/**
 * created by andreas on 2014-11-12.
 * simple object reflection
 */

var reflection = function(obj) {
    this.getProperties = function() {
        var properties = [];
        for (var prop in obj) {
            if (typeof obj[prop] != 'function') {
                properties.push(prop);
            }
        }
        return properties;
    };

    this.getAllMethods = function() {
        var methods = [];
        for (var method in obj) {
            if (typeof obj[method] == 'function') {
                methods.push(method);
            }
        }
        return methods;
    };
};

module.exports = reflection;
