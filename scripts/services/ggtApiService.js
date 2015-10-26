ggtApp.factory('ggtApiService', ["$resource", "$location", "$window", '$http', function ($resource, $location, $window, $http) {

    var service = {};

    //定义Api请求地址对象
    var restApiUrl = {

        flowList:{url:"/api/flow/list?type={type}",needCommonAlert:false},
        flowDetail:{url:"/api/flow/detail",needCommonAlert:false}

    };

    //调用Get方法
    service.get = function (apiKey, apiParams, success, error) {
        $http.get(makeApiUrl(apiKey.url, apiParams)).success(function (response, status) {
            //成功直接回调成功函数
            if (response.statusCode == 200) {
                if (success instanceof  Function) {
                    success(response);
                }
            } else {
                if (apiKey.needCommonAlert) {
                    //统一错误处理
                    if (response.statusCode == 500 || response.statusCode == 404) {
                        DialogService.launch("error", response.message);
                    }
                }

                if (error instanceof  Function) {
                    error(response);
                }
            }
        }).error(function (response, status) {
            //调用API时出错,统一到错误页面
            $location.path('/error');
        });
    };


    
    var consistentHandle = function(apiKey, apiParams, data, success, error){
        $http.post(makeApiUrl(apiKey.url, apiParams), data).success(function (response, status) {
            //成功直接回调成功函数
            if (response.statusCode == 200) {
                if (success instanceof  Function) {
                    success(response);
                }
            } else {
                if (apiKey.needCommonAlert) {
                    //统一错误处理
                    if (response.statusCode == 500 || response.statusCode == 404) {
                        DialogService.launch("error", response.message);
                    }
                }
                if (error instanceof  Function) {
                    error(response);
                }
            }
        }).error(function (response, status) {
            //调用API时出错,统一到错误页面
            $location.path('/error');
        });
    
    }

    //处理ApiUrl
    var makeApiUrl = function (apiUrl, apiParams) {
        var url = apiUrl;
        //替换ApiUrl中的参数
        for (var i in apiParams) {
            url = url.replace("{" + i + "}", apiParams[i]);
        }

        return url;
    };

    //获取ApiUrl
    service.getApiUrl = function () {
        return restApiUrl;
    };

    return service;
}]);
