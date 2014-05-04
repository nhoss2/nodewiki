(function(){
  var nav = angular.module('sideNav', []);
  var wiki = angular.module('nodeWiki', ['ngRoute', 'sideNav']);

  wiki.config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/w/:path', {
        controller: 'wikiCtrl',
        template: 'ehy'
      })
      .when('/w',{
        controller: 'wikiCtrl',
        template: 'jey'
      })
      .otherwise({
        redirectTo: '/w/',
      });

  }]);

  wiki.config(['$locationProvider', function($locationProvider){
    //TODO: get this working with express
    //$locationProvider.html5Mode(true);
  }]);

  wiki.controller('wikiCtrl', ['$scope', '$routeParams', 'files', function($scope, $routeParams, files){
    $scope.hey = 'bro';
    files.openLink($routeParams.path, function(data){
      console.log(data);
    });
  }]);

  nav.controller('navCtrl', ['$scope', 'files', function($scope, files){

    files.ls(function(files){
      $scope.files = files;
    });

  }]);

  nav.factory('files', ['$http', function($http){
    return {
      ls: function(cb){
        $http.get('/api/dir').success(function(data){
          cb(data);
        });
      },

      openLink: function(itemName, cb){
        $http.post('/api/navlink', {item: itemName})
        .success(function(data){
          console.log(data);
        });
      }
    }
  }]);

  nav.directive('fileItem', function(){
    return {
      restrict: 'A',
      template: '{{ item.display }}',
      scope: {
        item: '='
      },
      link: function(scope, element, attrs){

        if (scope.item.type == 'dir'){
          scope.item.display = scope.item.name + '/';
        } else {
          scope.item.display = scope.item.name;
        }
      }
    }
  });

})();
