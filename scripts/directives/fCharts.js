/**
 * Created by liaozhida on 2015-7-8
 */
GLHApp.directive('fCharts', ['$location','ApiService','$timeout',function($location,ApiService,$timeout){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
        },
        templateUrl: "templates/f10charts.html", 
        controller:function(){
        }, 

        link: function(scope, element, attrs){

        }
        
        
        
    }
}]);
