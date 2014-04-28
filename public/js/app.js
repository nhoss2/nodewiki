(function(){
  //var wiki = angular.module('nodeWiki', ['sideNav']);

  var nav = angular.module('sideNav', []);

  nav.controller('navCtrl', ['$scope', 'files', function($scope, files){

    $scope.openItem = function(itemName){
      console.log(itemName);
    }


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

  nav.directive('fileItem', function(){
    return {
      restrict: "E",
      template: "{{ item.name }}",
      scope: {
        item: '=',
        open: '&open'
      },
      link: function(scope, element, attrs){
        element.on('click', function(e){
          scope.open({itemName: scope.item.name});
          e.preventDefault();
          console.log('clicked');
        });
      }
    }
  });

})();
