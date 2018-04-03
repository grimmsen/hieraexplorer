function _filter(subject,object,fields) {
    if(subject===undefined || subject==="") {
        return true;
    }
    var result=false;
    var _queries = subject.split(" ");
    for(var j=0; j<_queries.length;j++) {
        for (var i = 0; i < fields.length; i++) {
            if (object[fields[i]] !== undefined) {
                if (object[fields[i]].toLowerCase().indexOf(_queries[j].toLowerCase()) >= 0) {
                    result |= true;
                }
            }
        }
    }
    return result;
}

var heApp = angular.module('heApp',['ngRoute','angular.filter','ui.codemirror']);

heApp.directive('appMenu',function() {
  return {
    templateUrl: 'partials/view.header.html'
  }
});

heApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/view.index.html',
        controller: 'index'
      })
      .when('/hiera/:hostname', {
        templateUrl: 'partials/view.index.html',
        controller: 'index'
      })
    .when('/editor', {
        templateUrl: 'partials/view.editor.html',
        controller: 'editor'
      })
      ;
  }
]);

heApp.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
  }
]);

heApp.config(['$httpProvider', function ($httpProvider) {
    // Intercept POST requests, convert to standard form encoding
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
        var key, result = [];
        if (typeof data === "string")
            return data;

        for (key in data) {
            if (data.hasOwnProperty(key))
                result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
        return result.join("&");
    });
}]);
