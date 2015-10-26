/**
 * directive sample
 */
GLHApp.directive('loginForm', function(){
    return {
        scope: {

        },
        templateUrl: 'tempplates/loginForm.html',
        link: function(scope, ele, attrs){
        }
    }
});

GLHApp.controller('LoginController', function($scope){
    $scope.login = function(){
    }
});