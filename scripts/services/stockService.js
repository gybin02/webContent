/**
 * 用户登录验证
 * Created by vincent.chang on 5/15/2015.
 */
GLHApp.factory('StockService', ['ApiService', '$UserService', 'DialogService', function (ApiService, $UserService, DialogService) {
    var service = {};

    //添加自选股
    service.addUserStock = function (stockCode, stockType, scope, element) {
        ApiService.put(ApiService.getApiUrl().addUserStock, {}, {stockCode: stockCode, stockType: stockType}, function (response) {
            console.info("-------StockService.addUserStock --"+response.message);
        	scope.isUserStock =true;
        	scope.stockChanged = Math.random();
            DialogService.toolTip(element, scope, response.message);
        }, function (response) {
            //未登录或已超时
            if (response.statusCode == 403) {
                $UserService.authOpretion(scope);
            } else {
                DialogService.toolTip(element, scope, response.message);
            }
        });
    }

    //删除自选股
    service.delUserStock = function (stockCode, stockType, scope, element) {
        //DialogService.confirmYes = function () {
        ApiService.remove(ApiService.getApiUrl().delUserStock, {stockCodes: stockType + stockCode}, {}, function (response) {
            scope.isUserStock = false;
            scope.stockChanged = Math.random();
        }, function (response) {
            //未登录或已超时
            if (response.statusCode == 403) {
                $UserService.authOpretion(scope);
            } else {
                DialogService.toolTip(element, scope, response.message);
            }
        });
        //}
        //DialogService.launch("confirm", "您确定要取消该自选股吗？");

    }

    return service;
}]);
