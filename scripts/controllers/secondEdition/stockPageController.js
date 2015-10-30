GLHApp.controller('stockPageController', ['$scope', '$location', '$routeParams', 'ApiService', 'CommService', 'DialogService', '$UserService', 'StockService',
    function ($scope, $location, $routeParams, ApiService, CommService, DialogService, $UserService, StockService) {
		//tabs 切换
		$("#tab-nav li").on("click", function() {
			$this = $(this);
			var tabName = $this.find("a").data("name");
			$this.addClass("active").siblings("li").removeClass("active");
			$("#"+tabName).addClass("active").siblings("div").removeClass("active");
		})
		
		//个股编号（行业编号+个股编号：hk00243）
        $scope.stockCode = $routeParams.stockCode;
        $scope.type = $scope.stockCode.slice(0,2)
        $scope.code = $scope.stockCode.slice(2,$scope.stockCode.length);

        $scope.stockInfo = {};

        $scope.isUserStock = false;
        //精华帖子列表
//      $scope.creamList = [];

        //帖子列表
//      $scope.postList = [];

        //监视登录框，登录的情况下重新刷新是否添加自选
        $scope.$on("initAfterLogin", function (event, options) {
            $scope.init();
        });

        $scope.init = function () {
            ApiService.get(ApiService.getApiUrl().isUserStock, {stockCodes: $scope.stockCode}, function (response) {
                $scope.isUserStock = response.result[$scope.stockCode];

            }, function (response) {
                $scope.isUserStock = false;
            });
        }

        $scope.init();
        
        $scope.defaultStockCode = [];
        //获取个股行情
        ApiService.get(ApiService.getApiUrl().stockDetail, {stocks: $scope.stockCode, detail:true}, function (response) {
            $scope.isBaseInfoLoaded = true;
            if (response.result != null && response.result.length > 0) {
                $scope.stockInfo = angular.copy(response.result[0]);
                $scope.defaultStockCode.push("$"+response.result[0].name+"("+$routeParams.stockCode+")$ ");
                if($scope.stockInfo.extInfo){
                	$scope.stockInfo.tradeInfo = [];
                	var tmpInfoList = [];
                	var tmpInfo = {};
                	for(var i=0; i<$scope.stockInfo.extInfo.length; i++){
                		if((i+1)%2 == 0){
                			tmpInfo.value = $scope.stockInfo.extInfo[i];
                			tmpInfoList.push(tmpInfo);
                			tmpInfo = {};
                		}else{
                			tmpInfo.name = $scope.stockInfo.extInfo[i];
                		}
                	}
                	
                	var detail = [];
                	for(var i=0; i<tmpInfoList.length; i++){
                		detail.push(tmpInfoList[i]);
                		if((i+1)%4 == 0){
                			$scope.stockInfo.tradeInfo.push(detail);
                			detail = [];
                		}
                	}
                	
                	if(detail.length > 0){
                		$scope.stockInfo.tradeInfo.push(detail);
                	}
                }
                
                if($scope.stockInfo.name == null){
                	$scope.stockInfo.name = "--";
                }
                
                if($scope.stockInfo.code){
                	$scope.stockInfo.stockCodeExtShow = $scope.stockInfo.type.toUpperCase()+":"+$scope.stockInfo.code;
                }
                
                if($scope.stockInfo.price == null){
                	$scope.stockInfo.price = "--";
                }else{
                	if ($scope.stockInfo.type == "sh" || $scope.stockInfo.type == "sz") {
                		$scope.stockInfo.price = "￥" + $scope.stockInfo.price;
                	} else {
                		$scope.stockInfo.price = "$" + $scope.stockInfo.price;
                	}
                }
                if ($scope.stockInfo.change > 0) {
                    $scope.stockInfo.fontColor = "font_red";
                    $scope.stockInfo.changeRate = "+" + $scope.stockInfo.change + " (+" + $scope.stockInfo.netChange + "%)";
                } else if ($scope.stockInfo.change < 0) {
                    $scope.stockInfo.fontColor = "font_green";
                    $scope.stockInfo.changeRate = $scope.stockInfo.change + " (" + $scope.stockInfo.netChange + "%)";
                } else {
                	$scope.stockInfo.fontColor = "font_normal";
                	if($scope.stockInfo.change == null){
                		if($scope.stockInfo.netChange == null){
                			$scope.stockInfo.changeRate = "-- (--)";
                		}else{
                			$scope.stockInfo.changeRate = "-- (" + $scope.stockInfo.netChange + ".00%)";
                		}
                	}else{
                		if($scope.stockInfo.netChange == null){
                			$scope.stockInfo.changeRate = $scope.stockInfo.change + ".00 (--)";
                		}else{
                			$scope.stockInfo.changeRate = $scope.stockInfo.change + ".00 (" + $scope.stockInfo.netChange + ".00%)";
                		}
                	}
                }
            } else {
                $location.path("/error/stockNotFound/" + $scope.stockCode);
            }


        }, function (response) {
        	//
        });
}]);