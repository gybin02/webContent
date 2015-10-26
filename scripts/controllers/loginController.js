GLHApp.controller('LoginController', ['$scope', '$rootScope', '$cookieStore', '$location', '$document','$window', 'ApiService', '$UserService', 'DialogService',
    function ($scope, $rootScope, $cookieStore, $location, $document,$window, ApiService, $UserService, DialogService) {
        $scope.isLoginShow = false;
        // $scope.$apply(function () {
        //alert(11);
//            angular.element("input[name='userName']").focus();
        //});
        
        //打开登录界面
        $scope.showLogin = function () {
            console.info(" ^._.^ ");
            $scope.loginShowStyle = {'display': 'block'};
            $scope.loginShowMaskClass = 'in';
            $scope.isLoginShow = true;
        }
        
        //登录完成后是否需要切换Url
        $scope.needChangeUrl = false;
        //取消是否需要返回首页
        $scope.needReturnHome = false;

        //按关闭或者Esc退出登录页
        $scope.closeLogin = function () {
            $scope.hideLogin();            
            if ($scope.needReturnHome) {            	
                $location.path("/");
            }
        }

        //隐藏登录页面
        $scope.hideLogin = function () {
            $scope.loginShowStyle = {'display': 'none'};
            $scope.loginShowMaskClass = '';
            $scope.loginErr = {'display': 'none'};
            $scope.isLoginShow = false;            
        };

        //Enter键登录  Esc键关闭
        $document.bind("keyup", function (event) {
            //登录窗体打开时
            if ($scope.isLoginShow) {
                if (event.keyCode == 13) {
                    $scope.$apply(function () {
                        $scope.loginSubmit();
                    })

                }
                if (event.keyCode == 27) {
                    $scope.$apply(function () {
                        $scope.closeLogin();
                    })

                }
            }
        });

        //打开注册页面
        $scope.register = function () {
            if ($scope.loginShowMaskClass == 'in') {
                $scope.hideLogin();
            }
            $location.path('/register');
        };

        //打开登录界面 
        $scope.$on("openLoginModal", function (event, options) {
            console.info("--openLogin");
            $scope.showLogin();
            $scope.needChangeUrl = options.needChangeUrl;
            $scope.needReturnHome = options.needReturnHome;
        });

        //退出
        $scope.$on("executeExit", function (event, options) {
            console.info("----------logout-");
            $UserService.logOut();
            $location.path('/');
        });

        //打开忘记密码页面
        $scope.linkUpdatePwd = function () {
            if ($scope.loginShowMaskClass == 'in') {
                $scope.hideLogin();
            }
            $location.path("/updatePwd");
        }

        $scope.rememberPW = true;

        $scope.checkCookieValue = function () {
            var loginUserName = $scope.userName;
            if (loginUserName && typeof loginUserName != 'undefined') {
                var cookieKey = loginUserName + "Value";
                var cookieUserName = $cookieStore.get(cookieKey);
                if (cookieUserName && typeof cookieUserName != 'undefined') {
                    $scope.pwd = cookieUserName;
                }
            }
        };


        $scope.loginSubmit = function () {
            var loginUserName = $scope.userName;
            var loginPassword = $scope.pwd;

            if (typeof loginUserName == 'undefined' || typeof loginPassword == 'undefined' || !loginUserName || !loginPassword) {
                $scope.loginErr = {'display': 'block'};
                $scope.errorMsg = null;
                return;
            }

            var rememberPwd = $scope.rememberPW;

            if (rememberPwd) {
                var cookieKey = loginUserName + "Value";
                $cookieStore.put(cookieKey, loginPassword);
            }

            //登录成功回调
            var successCallBack = function (data) {
                $UserService.setUser(data.result);
                var params={};
                if(!$scope.needChangeUrl&&$scope.needReturnHome){
                    //params={needChangeUrl: false, needReturnHome: true}
                    var a=$location.path();
                    var b=$location.absUrl();
                    var c=$location.url();
                    //$window.location.reload();
                }
                $scope.$emit("loginSuccess", params);

                if ($scope.needChangeUrl) {
                    $location.path('/userHome');
                }
                $scope.hideLogin();
            };

            var data = {userName: loginUserName, password: loginPassword};

            ApiService.post(ApiService.getApiUrl().login, {}, data, successCallBack,
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        DialogService.launch("error", response.message);
                    }
                }
            );
        };
        $scope.hideLogin();
    }
]);

