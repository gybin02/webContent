GLHApp.controller('UpdatePwdController', ['$scope', '$http', '$location', 'ApiService','PhoneAreaService', 'DialogService',
                                          function($scope, $http, $location, ApiService,PhoneAreaService, DialogService){
	 //初始默认显示邮箱注册方式
    $scope.mailActive=true;
    
    $scope.sendVal = '发送验证码';
    
    $scope.pwdTtitle = true;
    $scope.pwdTitleShow = false;
    
    //表单错误信息默认不显示
    $scope.pwdEmailErr = false;
    $scope.confirmErrp = false;
    $scope.phoneErr = false;

    //电话号码区号
    $scope.areaNums = PhoneAreaService.areaNums;

    $scope.areaNumModel = $scope.areaNums[0];
    
	$scope.setPWDTab = function( mailActive){
		 $scope.mailActive=mailActive;
	};
	 
	$scope.sendCode = function(){

		var phoneVal =  $scope.phone;
		if(typeof phoneVal == 'undefined' || !phoneVal){
			$scope.phoneErr = true;
			$scope.phoneBind = "*手机号码必须填写";	
			return ;
		}else{
			$scope.phoneErr = false;
		}
		
		//修改密码时发送手机验证码
        var successCallBack = function (data) {
        	$scope.phoneErr = false;
			document.getElementById("sendCode").disabled = true;
			start_send_button();
        };

        phoneVal = $scope.areaNumModel.value+ phoneVal;
        
        ApiService.get(ApiService.getApiUrl().sendForgetCode, {phone:phoneVal}, successCallBack,
            function (response, status) {
	        	if(response.statusCode==406 || response.statusCode==417){
	        		$scope.phoneErr = true;
	        		$scope.phoneBind = "*"+response.message;
	        	}
        	}
        );
	};
	
	$scope.sendPWDEmail = function(isValid){
		if(!isValid){
			$scope.updatePWDEForm.submitted = true;
			return;
		}

		var successCallBack = function (data) {
			$location.path("/success/sendPwdMail");
	    };
	    
	    var params = {email:$scope.email};
	    ApiService.get(ApiService.getApiUrl().findEmail, params, successCallBack,
	        function (response) {
	    		if(response.statusCode==406 || response.statusCode==417){
	    			DialogService.launch("error",response.message);
	    		}
	    	}
	    );
	};
	
	$scope.sendPWDPhone = function(isValid) {
		if(!isValid){
			$scope.updatePWDPForm.submitted = true;
			return;
		}
		
		var confirmPWp =  $scope.confirmPWp;
		if($scope.firstPWp != $scope.confirmPWp){
			$scope.confirmErrp = true;
			return ;
		}else{
			$scope.confirmErrp = false;
		}

		//手机修改密码成功回调
        var successCallBack = function (data) {
        	$location.path("/success/updatePwd");
        };
        
        var datas = {
        		phonecode:$scope.veryCode, 
        		user:{
        			password:$scope.firstPWp, 
        			phone:$scope.phone
        		},
        		area:$scope.areaNumModel.value
        };
        ApiService.post(ApiService.getApiUrl().findPhone, {}, datas, successCallBack,
            function (response) {
	        	if(response.statusCode==406 || response.statusCode==417){
	    			DialogService.launch("error",response.message);
	    		}
        	}
        );
	};
}]);

function start_send_button(){
    var count = 1 ;
    var sum = 60;
    var timeCount = setInterval(function(){
      if(count >= 60){
    	document.getElementById("sendCode").value = '重新发送';
    	document.getElementById("sendCode").disabled = false;
        clearInterval(timeCount);
      }else{
    	 document.getElementById("sendCode").value = '剩余'+parseInt(sum - count)+'秒';
      }
      count++;
    },1000);
  }

