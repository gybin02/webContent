GLHApp.controller('UpdatePwdController', ['$scope', '$http', '$location', 'ApiService', function($scope, $http, $location, ApiService){
	 //初始默认显示邮箱注册方式
    $scope.mailActive=true;
    
    $scope.sendVal = '发送验证码';
    
    $scope.formActive=true;
    $scope.pwdTtitle = true;
    $scope.pwdTitleShow = false;
    $scope.pwdTitleBind = "请选择密码找回方式, 新密码将发送到您的注册手机或邮箱  ";
    
	$scope.setPWDTab = function( mailActive){
		 $scope.mailActive=mailActive;
	};
	 
	$scope.sendCode = function(){
		var phoneVal =  $scope.phone;
		if(typeof phoneVal == 'undefined' || !phoneVal){
			$scope.phoneBind = "*手机号码必须填写";
			$scope.phoneErr = {'display':'block'};
			return ;
		}else{
			$scope.phoneErr = {'display':'none'};
		}
		
		//修改密码时发送手机验证码
        var successCallBack = function (data) {
        	$scope.phoneErr = {'display':'none'};
			document.getElementById("sendCode").disabled = true;
			start_send_button();
        };
        
        var params = {};
        ApiService.get("/api/sms/forgot/" + phoneVal, params, successCallBack,
            function (response, status) {
	        	$scope.phoneBind= "*"+response.message;
				$scope.phoneErr = {'display':'block'};
            }
        );
	};
	
	$scope.sendPWDEmail = function(){
		var emailVal = $scope.email;
		if(typeof emailVal == 'undefined' || !emailVal){
			$scope.pwdEmailBind = "*邮箱地址必须填写";
			$scope.pwdEmailErr = {'display':'block'};
			return ;
		}
		
		var emailFormat = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/; 
		if(!emailFormat.test(emailVal)){
			$scope.pwdEmailBind = "*邮箱地址格式不正确";
			$scope.pwdEmailErr = {'display':'block'};
			return ;
		}
		var successCallBack = function (data) {
			$location.path("/success/sendPwdMail");
	    };
	    
	    var params = {email:emailVal};
	    ApiService.get(ApiService.getApiUrl().findEmail, params, successCallBack,
	        function (response) {
		    	$scope.pwdEmailBind = "*"+response.message;
				$scope.pwdEmailErr = {'display':'block'};
	    	}
	    );
	};
	
	$scope.sendPWDPhone = function() {
		$scope.phoneErr = {'display':'none'};
		$scope.firstErrp = {'display':'none'};
		$scope.confirmErrp = {'display':'none'};
		$scope.veryErr = {'display':'none'};
		
		var phone = $scope.phone;
		if (typeof phone == 'undefined' || !phone){
			$scope.phoneBind = "*手机号码必须填写";
			$scope.phoneErr = {'display':'block'};
			return ;
		}
		
		var firstPWp =  $scope.firstPWp;
		if(typeof firstPWp == 'undefined' || !firstPWp){
			$scope.firstErrBind = "*密码必须填写";
			$scope.firstErrp = {'display':'block'};
			return ;
		}
		
		var confirmPWp =  $scope.confirmPWp;
		if(typeof confirmPWp == 'undefined' || !confirmPWp || confirmPWp != firstPWp){
			$scope.confirmErrBind = "*两次输入的密码必须一致";
			$scope.confirmErrp = {'display':'block'};
			return ;
		}
		
		var veryCode = $scope.veryCode;
		if(typeof firstPWp == 'undefined' || !firstPWp){
			$scope.veryErrBind = "*验证码不正确";
			$scope.veryErr = {'display':'block'};
			return ;
		}
		
		//手机修改密码成功回调
        var successCallBack = function (data) {
        	$location.path("/success/updatePwd");
        };
        var parmaters = {password:firstPWp, phone:phone, phonecode:veryCode};

        ApiService.post(ApiService.getApiUrl().findByPhone, parmaters, {}, successCallBack,
            function (response, status) {
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

