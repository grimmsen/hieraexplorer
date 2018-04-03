heApp.controller('index',function($scope,$rootScope,$timeout,$http,$routeParams,$route,$rootScope,$interval,$location) {
  $rootScope.changeHost=function() { 
    $location.path("/hiera/"+$rootScope.hostname);
  };

  $scope.vimCMD = "";
  
  $rootScope.callEditor=function(filename) {
    $rootScope.filename = filename;
    $location.path("/editor");
  };

  $scope.lines = [];
  $scope.hostname = '';

  $scope.filter=function(line) {
    if(!line['file']) return true;
    return _filter($scope.search,line,['file','line']);
  };

  $scope.update = function() {
    if($routeParams.hostname!==undefined) {
      var hostname = $routeParams.hostname;
    } else {
      var hostname = "xxx-xxx-1-xxx-x";
    }
    $rootScope.loading=true;
    $http.post('/api/hiera/renderJSON/'+hostname,{}).then(function(data) {
      $scope.lines=data.data;
      UIkit.notification({message: '<span uk-icon=\'icon: check\'></span>&nbsp;Fetched '+$scope.lines.length+" lines of hieradata",timeout: 2000})
      $rootScope.loading=false;
    })
    .catch(function (e) {
      $rootScope.loading=false;
      UIkit.notification({message: '<span uk-icon=\'icon: bolt\'></span>&nbsp;Fetch hieradata failed!',status:'danger',timeout: 2000})
     });
  };
  $scope.update();
});
