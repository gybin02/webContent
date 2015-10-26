/**
 * Created by kevin.zhao on 2015/4/9.
 */
GLHApp.factory('$MainService', ['$q', 'ApiService', '$filter', '$q',
    function ($q, ApiService, $filter, $q) {
        var service = {};

        service.getColumns = function () {
            // 声明延后执行，表示要去监控后面的执行
            var defer = $q.defer();

            //call api
            ApiService.get(ApiService.getApiUrl().getColumnList, {}, function (response) {
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

        service.footerLinks = [
            /*{
                url: "javascript:void(0);",
                linkText: "常见问题"
            },*/
            {
                url: "#/contactUs",
                linkText: "联系方式"
            },
            /*{
                url: "javascript:void(0);",
                linkText: "加入我们"
            },*/
            {
                url: "#/introduction",
                linkText: "关于格隆汇"
            },
            {
                url: "#/relief",
                linkText: "免责声明"
            }
        ];

        return service;
    }]);