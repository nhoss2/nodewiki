(function(){
  var nav = angular.module('sideNav', []);
  var auth = angular.module('nodeAuth', []);
  var wiki = angular.module('nodeWiki', ['ui.router', 'sideNav', 'nodeAuth']);

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
             * parses the file and displays the html
             */
            templateProvider: ['$q', 'currentPage', function($q, currentPage){
              var deferred = $q.defer();

              currentPage.getRaw(function(err, raw){
                if (err === null){
                  deferred.resolve(marked(raw));
                } else {
                  deferred.resolve('Error, ' + err);
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
            template: '<a class="entity" href="#/w{{ currentPath }}{{item.name}}" ng-repeat="item in files | orderBy: \'name\'">{{ item.name }}</a>'
          },
          pathbar:{
            controller: 'pathBarCtrl',
            template: '<ol><li><a class="path" href="#/w/"><i class="icon-home"></i></a><i class="icon-right-open-big"></i></li><li ng-repeat="path in paths"><a class="path" href="#/w{{ path.link }}">{{ path.name }}</a><i class="icon-right-open-big"></i></li></ol>'
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
     *   - The path to the directory
     *   - The current file (or null if current path is a directory)
     *   - An array of the directories traversed
     */

    return {
      getPath: function(){
        var path = $location.path();
        return path.substring(2, path.lastIndexOf('/') + 1);
      },

      getFile: function(){
        var path = $location.path();
        if (path[path.length - 1] === '/') return null;
        return path.substr(path.lastIndexOf('/') + 1);
      },

      listDirectories: function(){
        var path = $location.path().split('/');

        // the start of slice is 2 as the first element in the array is "" and
        // the second is "w".
        return path.slice(2, path.length - 1);
      }

    }
  }]);

  nav.controller('pathBarCtrl', ['$scope', 'url', function($scope, url){

    var dirList = url.listDirectories();
    var paths = [];

    dirList.forEach(function(dir, i){
      paths.push({
        name: dir,
        link: '/' + dirList.slice(0, i+1).join('/') + '/'
      });
    });

    $scope.paths = paths;
  }]);

  nav.controller('navCtrl', ['$scope', 'files', 'url', function($scope, files, url){

    var currentPath = url.getPath();
    $scope.currentPath = currentPath;

    files.listFiles(currentPath, function(files){
      $scope.files = files;
    });

  }]);

  auth.controller('headerAuthCtrl', ['$scope', function($scope){

    $scope.showDialog = false;
    $scope.showRegister = false;

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

  nav.factory('currentPage', ['$http', '$q', 'files', 'url', function($http, $q, files, url){

    var raw;
    var rawPath;

    return {
      /*
       * param: function(error, rawFile)
       */
      getRaw: function(cb){

        var requestedFile = url.getFile();
        var currentDir = url.getPath();

        if (rawPath === currentDir + requestedFile){
          console.log('sending raw', raw);
          return cb(null, raw);
        }

        // at root of directory so render nothing
        if (requestedFile === null){
          return cb(null, '');
        }

        files.listFiles(currentDir, function(files){

          // check if requested file is in current directory
          var checkedFile = files.filter(function(file){
            return file.name == requestedFile;
          });

          if (checkedFile.length > 0 && checkedFile[0].type == 'file'){
            $http.get('/api/raw/' + currentDir + checkedFile[0].name)
            .success(function(data){
              raw = data;
              rawPath = currentDir + requestedFile;
              return cb(null, data);
            });
          } else {
            return cb('File not found');
          }
        });
      }
    }

  }]);

})();
