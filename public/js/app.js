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
    $locationProvider.html5Mode(true);
  }]);

  wiki.controller('wikiCtrl', ['$scope', function($scope){
    $scope.hey = 'bro';
  }]);

  nav.controller('navCtrl', ['$scope', 'files', function($scope, files){

    $scope.openItem = function(itemName){
      files.openLink(itemName, function(data){
        console.log(data);
      });
    };

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
      restrict: "E",
      template: "{{ item.display }}",
      scope: {
        item: '=',
        open: '&open'
      },
      link: function(scope, element, attrs){

        if (scope.item.type == 'dir'){
          scope.item.display = scope.item.name + '/';
        } else {
          scope.item.display = scope.item.name;
        }
        element.on('click', function(e){
          scope.open({itemName: scope.item.name});
          e.preventDefault();
        });
      }
    }
  });

})();
