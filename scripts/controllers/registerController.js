GLHApp.controller('RegisterController', ['$scope', '$http', '$location', '$q', 'ApiService', 'PhoneAreaService', 'DialogService',
    function ($scope, $http, $location, $q, ApiService, PhoneAreaService, DialogService) {
	
		$scope.isInvitRegEnable = true; //开启邀请码注册

        ApiService.get(ApiService.getApiUrl().isInvitRegEnable, {},
            function (response) {
                $scope.isInvitRegEnable = response.result;
            },
            function (response) {
                console.log('get InvitRegEnable failed.')
            }
        );

        //初始默认显示邮箱注册方式
        $scope.mailActive = true;

        $scope.sendVal = '发送验证码';

        //电话号码区号
        $scope.areaNums = PhoneAreaService.areaNums;

        //表单验证是默认错误信息不显示
        $scope.econfirmPW = false;
        $scope.emailInvitErr = false;
        $scope.invitErrp = false;
        $scope.confirmErrp = false;
        $scope.econfirmPW = false;
        $scope.phoneErr = false;
        $scope.nickSensitive = false;
        $scope.nickIllegal= false;

        $scope.areaNumModel = $scope.areaNums[0];

        $scope.setTab = function (mailActive) {
            $scope.mailActive = mailActive;
        };



        $scope.sendRegistCode = function () {
            if( $scope.isInvitRegEnable && !$scope.invitCodep){
                $scope.invitBind = "*邀请码必须填写";
                $scope.invitErrp = true;
                return;
            }

            $scope.checkInvitCodeDataFromDB().then(function (data) {
                var areaVal = $scope.areaNumModel.value;
                $scope.sendHide = false;
                var phoneVal = $scope.phone;
                if (typeof phoneVal == 'undefined' || !phoneVal) {
                    $scope.phoneErr = true;
                    return;
                } else {
                    $scope.phoneErr = false;
                }


                //注册时发送手机验证码
                var successCallBack = function (data) {
                    document.getElementById("sendCodeId").disabled = true;
                    start_regist_button();
                };

                phoneVal = areaVal + phoneVal;
                var params = {phone: phoneVal};
                ApiService.get(ApiService.getApiUrl().sendRegistCode, params, successCallBack,
                    function (response) {
                        if (response.statusCode == 406 || response.statusCode == 417) {
                            DialogService.launch("error", response.message);
                        }
                    }
                );
            }, function (err) {
                $scope.invitBind = err;
                $scope.invitErrp = true;
            });

        };

        $scope.checkInvitCodeDataFromDB = function(){
            var deferred = $q.defer();

            var successCallBack = function (response) {
                $scope.invitErrp = false;
                deferred.resolve();
            };

            var invitCode = $scope.invitCodep;
            var params = {code:invitCode};
            ApiService.get(ApiService.getApiUrl().checkInvitCode, params, successCallBack,
                function (response) {
                    var errMsg = "*"+response.message;
                    deferred.reject(errMsg);
                }
            );

            return deferred.promise;
        };

        $scope.checkInvitCode = function(n){
            if(n == 0 && !$scope.invitCode){
                $scope.emailInvitBind = "*邀请码必须填写";
                $scope.emailInvitErr = true;
                return;
            }else if(n == 1 && !$scope.invitCodep){
                $scope.invitBind = "*邀请码必须填写";
                $scope.invitErrp = true;
                return;
            }

            var successCallBack = function (response) {
                n == 0 ? $scope.emailInvitErr = false : $scope.invitErrp = false;
                deferred.resolve();
            };

            var invitCode = n == 0 ? $scope.invitCode : $scope.invitCodep;
            var params = {code: invitCode};
            ApiService.get(ApiService.getApiUrl().checkInvitCode, params, successCallBack,
                function (response) {
                    if(n==0){
                        $scope.emailInvitBind = "*" + response.message;
                        $scope.emailInvitErr = true;
                    }else{
                        $scope.invitBind = "*" + response.message;
                        $scope.invitErrp = true;
                    }
                }
            );
        }

        $scope.sensitiveWord = function(chars){
            if(chars != undefined){
                var param= {word:chars};
                ApiService.get(ApiService.getApiUrl().checkNickname, param,sensitiveSuccessCallBack,
                    function (response) {
                        console.log("response status is :"+response.statusCode);
                        if(response.statusCode!=200){
                            $scope.nickSensitive = true;
                        }
                        //console.log(response.message+"--sensitv-2--"+response.statusCode);
                    }
                );
            }
        }

        var sensitiveSuccessCallBack = function (response) {
            console.log("nick is legal");
            $scope.nickSensitive = false;
        };

        //验证是否包含特殊字符
        $scope.checkChar = function(chars){
            if(chars != undefined){

                if (chars.indexOf("\n") >= 0) {
                    console.log('-input stream is wrong!-');
                    $scope.nickIllegal = true;
                    return false;
                }else{
                    $scope.nickIllegal = false;
                }

                var re= new RegExp("select|update|delete|exec|union|drop|insert|count|’|\"|=|;|>|<|%/i");
                if(re.test(chars)){
                    console.log('input stream is wrong!');
                    $scope.nickIllegal = true;
                    return false;
                }else{
                    $scope.nickIllegal = false;
                }
            }
            return true;
        }

        $scope.regSubmit = function (isValid) {
            if ( $scope.isInvitRegEnable ) {
                if(!$scope.invitCode){
                    $scope.emailInvitBind = "*邀请码必须填写";
                    $scope.emailInvitErr = true;
                    if (!isValid) {
                        $scope.registForm.submitted = true;
                    }
                    return;
                }else{
                    if($scope.emailInvitErr){
                        if (!isValid) {
                            $scope.registForm.submitted = true;
                        }
                        return;
                    }
                }
            }


            if($scope.nickSensitive){
                $scope.registForm.submitted = true;
                return;
            }

            if($scope.nickIllegal){
                $scope.registForm.submitted = true;
                return;
            }

            if (!isValid) {
                $scope.registForm.submitted = true;
                return;
            }

            if ($scope.firstPW != $scope.confirmPW) {
                $scope.econfirmPW = true;
                return;
            } else {
                $scope.econfirmPW = false;
            }

            //注册成功回调
            var successCallBack = function (data) {
                $location.path("/success/registerMail");
            };

            var data = {
                code: $scope.invitCode,
                user: {
                    email: $scope.email,
                    password: $scope.firstPW,
                    nick: $scope.callName,
                    sex:'M'
                }
            };

            ApiService.post(ApiService.getApiUrl().register, {}, data, successCallBack,
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        DialogService.launch("error", response.message);
                    }
                }
            );
        };

        $scope.regSubmitp = function (isValid) {
            $scope.phoneErr = false;
            $scope.sendHide = true;

            if ( $scope.isInvitRegEnable ) {
                if (!$scope.invitCodep) {
                    $scope.invitBind = "*邀请码必须填写";
                    $scope.invitErrp = true;
                    if (!isValid) {
                        $scope.pRegForm.submitted = true;
                    }
                    return;
                } else {
                    if ($scope.invitErrp) {
                        if (!isValid) {
                            $scope.pRegForm.submitted = true;
                        }
                        return;
                    }
                }
            }

            if($scope.nickSensitive){
                $scope.registForm.submitted = true;
                return;
            }

            if($scope.nickIllegal){
                $scope.registForm.submitted = true;
                return;
            }


            if (!isValid) {
                $scope.pRegForm.submitted = true;
                return;
            }

            if ($scope.firstPWp != $scope.confirmPWp) {
                $scope.confirmErrp = true;
                return;
            } else {
                $scope.confirmErrp = false;
            }

            //注册成功回调
            var successCallBack = function (data) {
                var userId = data.result.user.userId;
                //跳转到填写个人资料页面
                //$location.path('/userUpdate/phone/' + userId);
                //跳转到注册成功页面
                $location.path('/success/register/');
            };

            var data = {
                code: $scope.invitCodep,
                phonecode: $scope.veryCode,
                area: $scope.areaNumModel.value,
                user: {
                    phone: $scope.phone,
                    password: $scope.firstPWp,
                    nick: $scope.callNamep,
                    sex:'M'
                }
            };

            ApiService.post(ApiService.getApiUrl().register, {}, data, successCallBack,
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        DialogService.launch("error", response.message);
                    }
                }
            );
        }
    }]);

function start_regist_button() {
    var count = 1;
    var sum = 60;
    var timeCount = setInterval(function () {
        if (count >= 60) {
            document.getElementById("sendCodeId").value = '重新发送';
            document.getElementById("sendCodeId").disabled = false;
            clearInterval(timeCount);
        } else {
            if(document.getElementById("sendCodeId")){
                document.getElementById("sendCodeId").value = '剩余' + parseInt(sum - count) + '秒';
            }else{
                clearInterval(timeCount);
            }
        }
        count++;
    }, 1000);
}
