(function(){
  var nav = angular.module('sideNav', []);
  var wiki = angular.module('nodeWiki', ['ui.router', 'sideNav']);

  wiki.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('index', {
        url: '/',
        template: 'this is index'
      })
      .state('wikiPage', {
        url: '/w/*page',
        templateProvider: function($http, $q, files, $stateParams){
          var deferred = $q.defer();

          var requestedFile = $stateParams.page.substr($stateParams.page.lastIndexOf('/') + 1);

          files.listFiles('/', function(files){
            var checkedFile = files.filter(function(file){
              return file.name == requestedFile
            });

            if (checkedFile.length > 0 && checkedFile[0].type == 'file'){
              $http.get('/api/raw/' + checkedFile[0].name)
              .success(function(data){
                deferred.resolve(marked(data));
              });
            }
          });

          return deferred.promise;
        }
      });
      $urlRouterProvider.otherwise('/');
  }]);

  wiki.config(['$locationProvider', function($locationProvider){
    //$locationProvider.html5Mode(true);
  }]);

  wiki.controller('wikiCtrl', ['$scope', '$routeParams', 'files', function($scope, $routeParams, files){
    //files.getRaw($routeParams.path, function(file){
    //  console.log(file);
    //});
    //files.openLink($routeParams.path, function(data){
    //  console.log(data);
    //});
  }]);

  // this is a hacky way to convert markdown to html.
  wiki.directive('marked', function(){
    return {
      restrict: 'A',
      link: function(scope, element){
        element[0].innerHTML = marked(element[0].innerHTML);
      }
    }
  });

  nav.controller('navCtrl', ['$scope', 'files', function($scope, files){

    files.listFiles('/', function(files){
      $scope.files = files;
    });

  }]);

  nav.factory('files', ['$http', '$q', function($http, $q){

    var currentPath;
    var dirContents;

    var getDirContents = function(path, cb){
      if (currentPath == path && dirContents){
        return cb(dirContents);
      } 

      $http.get('/api/dir').success(function(data){
        dirContents = data;
        currentPath = path;
        return cb(dirContents);
      });
    };

    return {
      listFiles: function(path, cb){
        var deferred = $q.defer();

        getDirContents('/', function(contents){
          deferred.resolve(cb(contents));
        });

        return deferred.promise;
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
