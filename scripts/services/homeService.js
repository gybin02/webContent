/**
 * Created by kevin.zhao on 2015/4/9.
 */
GLHApp.factory('$HomeService', ['$q', 'ApiService', '$filter', '$q',
    function ($q, ApiService, $filter, $q) {
        var service = {};
        //查询热点话题信息和港股信息
        service.hotGGArticleInfo = function(data){
        	// 声明延后执行，表示要去监控后面的执行
            var defer = $q.defer();
            
            var params = {columnCode:data};
            
            //call api
            ApiService.get(ApiService.getApiUrl().getArticleColumn, params, function (response) {
                    // 声明执行成功，即http请求数据成功，可以返回数据了
                    defer.resolve(response);
                },
                function (error) {
                    // 声明执行失败，即服务器返回错误
                    defer.reject(error);
                }
            );

            // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            return defer.promise;
        };

        return service;
    }]);