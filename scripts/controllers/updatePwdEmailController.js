GLHApp.controller('UpdatePwdEmailController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'ApiService', 'DialogService', 
                                               function($scope, $rootScope, $http, $location, $routeParams, ApiService, DialogService){
    $scope.pwdTitleBind = "继续操作, 完成您的密码重置 ";
    
    $scope.confirmErrp = false;
    
    $scope.init = function(){
	    var params = {email: $routeParams.email,activeCode: $routeParams.activeCode};
	
	    ApiService.get(ApiService.getApiUrl().checkActiveCode, params, function (response) {
	    	var result = response.result;
	    	if(!result){
	    		$location.path("/error/invalidActiveCode");
	    	}else{
	    		$scope.validActiveCode = true;
	    	}
    	},
        function (response) {
    		if(response.statusCode==406 || response.statusCode==417){
    			DialogService.launch("error",response.message);
    		}
    	});
    }
    
    $scope.init();
    
    $scope.submitPWDEmail = function(isValid) {
    	if(!isValid){
			$scope.updatePWDEForm.submitted = true;
			return;
		}
    	
		if($scope.firstPWp != $scope.confirmPWp){
			$scope.confirmErrp = true;
			return ;
		}else{
			$scope.confirmErrp = false;
		}
		
		
		//修改密码成功回调
        var successCallBack = function (data) {
        	$location.path('/success/updatePwdMail');
        };

        var datas = {
        		user:{
        			activeCode:$routeParams.activeCode, 
        			email:$routeParams.email, 
        			password:$scope.firstPWp
        		}
        };
        ApiService.post(ApiService.getApiUrl().updateByEmail, {}, datas, successCallBack,
    		function (response) {
	        	if(response.statusCode==406 || response.statusCode==417){
	    			DialogService.launch("error",response.message);
	    		}
	    	}
        );
	};
}]);