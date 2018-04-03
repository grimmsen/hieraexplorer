heApp.controller('editor',function($scope,$rootScope,$timeout,$http,$routeParams,$route,$rootScope,$interval,$location) {
  $rootScope.changeHost=function() { 
    $location.path("/hiera/"+$rootScope.hostname);
  };

  $interval(function() {
    console.log(jQuery("#CodeMirror-dialog > span").text());
  },1000);

  $scope.content = '';

  $scope.filter=function(line) {
    if(!line['file']) return true;
    return _filter($rootScope._filter,line,['file']);
  };

  $scope.vimCMD = "";

  $rootScope.callEditor=function(filename) {
    $rootScope.filename = filename;
    $location.path("/editor");
  };

  $rootScope.codemirrorLoaded = function(_editor) {
    // Events
    _editor.on('vim-keypress', function(key) {
      $scope.vimCMD=$scope.vimCMD+key;
    });
    _editor.on('vim-command-done', function(e) {
      $scope.vimCMD="";
    });
  };
  
  CodeMirror.commands.save = function(){ $scope.save(); };
  
  $scope.update = function() {
    $rootScope.loading=true;
    $http.post('/api/hiera/rawFile',{filename:$rootScope.filename}).then(function(data) {
      $scope.content=data.data;
      $rootScope.loading=false;
  	$rootScope.editorOptions = {
        lineNumbers: true,
        keyMap: "vim",
        theme: 'vibrant-ink',
        matchBrackets: true,
	};

    })
    .catch(function (e) {
      $rootScope.loading=false;
      UIkit.notification({message: '<span uk-icon=\'icon: bolt\'></span>&nbsp;Fetch hieradata failed!',status:'danger',timeout: 2000})
     });
  };

  $scope.save = function() {
    $rootScope.loading=true;
    $http.post('/api/hiera/rawFile',{filename:$rootScope.filename,content:$scope.content}).then(function(data) {
      $rootScope.loading=false;
      UIkit.notification({message: 'Saved '+$rootScope.filename,status:'success',timeout: 2000});
    })
    .catch(function (e) {
      UIkit.notification({message: '<span uk-icon=\'icon: bolt\'></span>&nbsp;Fetch hieradata failed!',status:'danger',timeout: 2000});
    });
  };
  $scope.update();
});
