(function(){
  //var wiki = angular.module('nodeWiki', ['sideNav']);

  var nav = angular.module('sideNav', []);

  nav.controller('navCtrl', ['$scope', 'files', function($scope, files){
    $scope.eh = 'et';
    files.get(function(files){
      $scope.files = files;
    });
  }]);

  nav.factory('files', ['$http', function($http){
    return {
      get: function(cb){
        $http.get('/api/dir').success(function(data){
          cb(data);
        });
      }
    }
  }]);

})()
