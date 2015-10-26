/**
 * Created by Administrator on 2015/3/24.
 */

GLHApp.controller('HotStockController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$MainService', '$UserService', 'CommService','ApiService','$interval','StockService','$anchorScroll',
    function ($scope, $rootScope, $http, $location, $routeParams, $MainService, $UserService, CommService,ApiService,$interval,StockService,$anchorScroll) {

        //添加自选股
        $scope.addUserStock = function (code,type) {

            StockService.addUserStock(code, type, $scope, $("#stock_hot_span_click"));
        };


}]);



