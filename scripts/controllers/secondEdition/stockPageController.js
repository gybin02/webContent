GLHApp.controller('stockPageController', ['$scope', '$rootScope', '$http', '$location','$UserService','$routeParams','ApiService','$interval','$anchorScroll',
    function ($scope, $rootScope, $http, $location, $UserService, $routeParams,ApiService,$interval,$anchorScroll) {
		//tabs 切换
		$("#tab-nav li").on("click", function() {
			$this = $(this);
			var tabName = $this.find("a").data("name");
			$this.addClass("active").siblings("li").removeClass("active");
			$("#"+tabName).addClass("active").siblings("div").removeClass("active");
		})
		
}]);