/**
 * Created by liaozhida
 *2015-7-8
 */
GLHApp.directive('indexRelease',  function () {
	  return {
		    restrict: 'AE',
		    
		    controller: function ($scope, $element, $attrs) {
		      console.log(2);
		    },
		    templateUrl: "release.html",
		    link: function (scope, element, attrs) {

		    }
	  }  
});