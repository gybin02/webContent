/**
 * 港A100走势 Created by Vincent on 2015/5/8
 */

GLHApp.controller('GlhExpController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'ApiService',
    function ($scope, $rootScope, $http, $location, $routeParams, ApiService) {
        //获取格隆汇港A100指数详情
        ApiService.get(ApiService.getApiUrl().marketDetail, {marketCode: $routeParams.code}, function (response) {
            if (response.result != null && response.result.length > 0) {
                $scope.kMapUrl = response.result[0].kMapUrl;
            }
            $scope.isLoaded = true;
        }, function (response) {
            $scope.isLoaded = true;
        })
    }]);