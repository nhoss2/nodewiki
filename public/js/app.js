(function(){
  var nav = angular.module('sideNav', []);
  var wiki = angular.module('nodeWiki', ['ui.router', 'sideNav']);

  wiki.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('index', {
        url: '/',
        views: {
          wiki: {
            template: 'this is index'
          },
          sidebar: {
            template: 'ey'
          }
        }
      })
      .state('wikiPage', {
        url: '/w/*page',
        views: {
          // each view here should be able to function by themselves (without
          // relying other views)
          wiki: {
            /*
             * This view is used to load a file based on the current URL. It then
             * parses the file and returns the html
             */
            templateProvider: ['$http', '$q', 'files', 'url', function($http, $q, files, url){
              var deferred = $q.defer();

              var requestedFile = url.getFile();
              var currentDir = url.getPath();

              if (requestedFile === null){
                return '';
              }

              files.listFiles(currentDir, function(files){
                var checkedFile = files.filter(function(file){
                  return file.name == requestedFile;
                });

                if (checkedFile.length > 0 && checkedFile[0].type == 'file'){
                  $http.get('/api/raw/' + currentDir + checkedFile[0].name)
                  .success(function(data){
                    deferred.resolve(marked(data));
                  });
                } else {
                  return deferred.resolve('Error');
                }
              });

              return deferred.promise;
            }]
          },
          sidebar: {
            /*
             * This view is used to show the items in the current directory.
             * The current directory is determined by the what the URL path is.
             */
            controller: 'navCtrl',
            template: '<a href="#/w{{ currentPath }}{{item.name}}" ng-repeat="item in files | orderBy: \'name\'">{{ item.name }}</a>'
          }
        }
      });
      $urlRouterProvider.otherwise('/');
  }]);

  wiki.config(['$locationProvider', function($locationProvider){
    //$locationProvider.html5Mode(true);
  }]);

  nav.factory('url', ['$location', function($location){
    /*
     * This factory should provide:
     *   - The current file (or null if current path is a directory)
     *   - The path to the directory
     *   - An array of the directories traversed
     */

    return {
      getPath: function(){
        var path = $location.path();
        return path.substring(2, path.lastIndexOf('/') + 1);
      },

      getFile: function(){
        var path = $location.path();
        if (path.lastIndexOf('/') + 1 == path.length) return null;
        return path.substr(path.lastIndexOf('/') + 1);
      },

    }
  }]);

  nav.controller('navCtrl', ['$scope', 'files', 'url', function($scope, files, url){

    var currentPath = url.getPath();
    $scope.currentPath = currentPath;

    files.listFiles(currentPath, function(files){
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

      $http.post('/api/dir', {dir: path})
        .success(function(data){
          dirContents = data;
          currentPath = path;
          return cb(dirContents);
        });
    };

    return {
      listFiles: function(path, cb){
        var deferred = $q.defer();

        getDirContents(path, function(contents){
          deferred.resolve(cb(contents));
        });

        return deferred.promise;
      }
    }
  }]);

})();
