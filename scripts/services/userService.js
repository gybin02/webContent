/**
 * 用户登录验证
 * Created by vincent.chang on 4/21/2015.
 */
GLHApp.factory('$UserService', ["$resource", "$location", "$window", '$q', 'ApiService', function ($resource, $location, $window, $q, ApiService) {
    var service = {};

    //获取登录用户信息
    service.getUser = function () {
        if ($window.localStorage.user) {
            var userInfo = angular.fromJson($window.localStorage.user);
            if (!userInfo.user.avatar) {
                userInfo.user.avatar = "images/avatar.png";
            }
            return userInfo;
        }

        return null;
    }

    //设置登录用户信息
    service.setUser = function (user) {
        $window.localStorage.user = angular.toJson(user);
    }

    //是否登录
    service.isLoggedIn = function () {
    	//这里单纯判断本地数据有些问题
        if ($window.localStorage.user ) {
            return true;
        }
        return false;
    }


    //退出登录
    service.logOut = function () {
        if ($window.localStorage.user) {
            $window.localStorage.removeItem("user");
        }

        ApiService.get(ApiService.getApiUrl().logout, {});
    }

    //清除客户端用户信息、客户端退出
    service.clearClientUser = function () {
        if ($window.localStorage.user) {
            $window.localStorage.removeItem("user");
        }
    }

    service.loginTimeOut = function () {
        // 声明延后执行，表示要去监控后面的执行
        var defer = $q.defer();

        //call api
        ApiService.get(ApiService.getApiUrl().loginTimeOut, {}, function (response) {
                // 声明执行成功，即http请求数据成功，可以返回数据了
                defer.resolve(response);
            },
            function (error) {
                // 声明执行失败，即服务器返回错误
                defer.resolve(error);
            }
        );

        // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        return defer.promise;
    };

    //是否登录
//    service.isLoggedOutOrTimeOut = function (scope) {
//        if (!$window.localStorage.user) {
//            scope.isNotLogin = true;
//        }
//        // 同步调用，获得承诺接口
//        var promise = service.loginTimeOut();
//        promise.then(function (data) {
//            if (data.statusCode == 200) {
//                scope.isNotLogin = false;
//            }
//            scope.isNotLogin = true;
//        }, function (data) {
//            // 处理错误 .reject
//            scope.isNotLogin = true;
//        });
//    }

    //需登录验证的画面
//    service.authPage = function (scope) {
//        if (!$window.localStorage.user) {
//            //通知打开登录框
//            scope.$emit("needLogin", {needChangeUrl: false, needReturnHome: true});
//        }
//        // 同步调用，获得承诺接口
//        var promise = service.loginTimeOut();
//        promise.then(function (data) {
//            if (data.statusCode != 200) {
//                //清除客户端登录信息
//                service.clearClientUser();
//                //通知打开登录框
//                scope.$emit("needLogin", {needChangeUrl: false, needReturnHome: true});
//            }
//
//        }, function (data) {
//            //清除客户端登录信息
//            service.clearClientUser();
//            // 处理错误 .reject
//            scope.$emit("needLogin", {needChangeUrl: false, needReturnHome: true});
//        });
//    }

    //需登录验证的画面
    service.authPage = function (scope) {
        if ($window.localStorage.user) {
            //清除客户端登录信息
            service.clearClientUser();
        }
        //通知打开登录框
        //console.info("通知打开登录框");
        scope.$emit("needLogin", {needChangeUrl: false, needReturnHome: true});
    }

    service.timeOutTip = function (element, scope) {
//        var options = {
//            content: '<div class="popover-tips">用户未登录或登录已超时,请登录.</div>',
//            placement: "top",
//            trigger: "click",//"manual",
//            html: true,
//            animation: false
//        };
//        element.popover(options);
//        element.popover('show');
        //清除客户端登录信息
        service.clearClientUser();
        //通知打开登录框
        scope.$emit("needLogin", {needChangeUrl: false, needReturnHome: false});
//        setInterval(function () {
//            element.popover('destroy');
//        }, 2000);

    }

    //通知打开登陆窗体
    service.authOpretion = function (scope) {
        //清除客户端登录信息
        service.clearClientUser();
        //通知打开登录框
        scope.$emit("needLogin", {needChangeUrl: false, needReturnHome: false});
    }

    return service;
}]);
