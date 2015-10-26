/**
 * Created by Ellis.Xie on 5/12/2015
 *
 * Example: 
 *		<link rel="stylesheet" href="styles/modal.css">
 *		<link rel="stylesheet" href="styles/sec-brokers.css">
 *		<link rel="stylesheet" href="styles/stocks-list.css">
 *		<stocks-list item-width="180px" show-handle-col="true"></stocks-list>
 */
GLHApp.directive('stocksList', ['$timeout', '$interval', '$UserService','$filter','$UserService', 'StockService', 'ApiService', function($timeout, $interval, $UserService, $filter,$UserService,StockService, ApiService){
	return {
		scope: true,
		restrict: 'E',
		templateUrl: 'templates/stocks-list.html',
		replace: true,
		transclude: true,
		scope:{
			userId:"=",
			hideTabs:"@",
			hideCollapse:"@"
		},
		controller:function($scope){
			$scope.hideCollapse = true;
			$scope.myTab = 1;
			$scope.setSelect = function(value){
				$scope.myTab = value;
            }
			$scope.isSelect = function(value){
                return $scope.myTab == value;
            }
		},
		link: function($scope, element, attrs, controller) {
			var $dropdownMenu = element.find('.stock-search.has-feedback');
			$scope.stocksTab = "";
			$scope.stockList = null;
			$scope.currentStocks = null;
			$scope.noStocks = true;
			$scope.keyWord = "";
			$scope.loginTimeOut = false;
			$scope.showSecBrokers = false;
			$scope.stockCode = "";
			$scope.searchStockSize = 0;
			$scope.stockSearchList = {};
			$scope.currentStocks = [];
			
			$scope.defaultSize = 5;
			
			$scope.listItemStyle = {"width": attrs.itemWidth};
			$scope.showSearch = (attrs.showSearch != "false");
			$scope.showHandleCol = attrs.showHandleCol === "true";
			$scope.staticWarning = attrs.staticWarning === "true";
			
			$scope.stock = {
				types : [],
				typeName : { "hk":'港股',"us":'美股',"zh":"沪深"},
				params:[],
				listSize:0,
				showCollapse:function(){
					if(this.listSize > 0 && this.listSize <= 6){
						$scope.defaultSize = 5;
						$scope.hideCollapse = true;
					}else{
						$scope.hideCollapse = false;
					}
				},
				plus:function(){
					if($scope.defaultSize <= 5){
						$scope.defaultSize = this.listSize;
					}else{
						$scope.defaultSize = 5;
					}
					this.showCollapse();
				},
				indexOfItems:function(items,stock){
					for(var i=0;i<items.length;i++){
						var item = items[i];
						if(item.code == stock.stockCode){
							return item;
						}
					}
					return { "name":stock.stockName,"code":stock.stockCode,"type":stock.stockType };
				},
				auth:function(response){
					if(response.statusCode == 403){
						$scope.staticWarning ? $scope.loginTimeOut = true : $UserService.authPage($scope);
					}
				},
				stocksWitch:function(tabname){
					var _this = this;
					var stocks = [];
					$scope.stocksTab = tabname;
					angular.forEach($scope.stockList, function(stock){
						stocks.push(stock.stockType+stock.stockCode);
					});
					var _stocks = stocks.join(',');
					if (stocks.length>0 && _stocks != this.params) {
						_this.params = stocks.join(',');
						$scope.showWaiting = true;
						$scope.stock.async();
					}
				},
				forEachStock:function(items){
					var _this = this;
					var currentStocks = [];
					angular.forEach($scope.stockList,function(stock,i){
						var _stock = _this.indexOfItems(items,stock);
						currentStocks.push(_stock);
					});
					return currentStocks;
				},
				// 异步更新股票信息
				async:function(){
					var _this = this;
					ApiService.get(ApiService.getApiUrl().getStocksDetail,{"stocks":_this.params},function(response){
						$scope.currentStocks = _this.forEachStock(response.result || []);
						$scope.showWaiting = false;
					},function(response){
						$scope.showWaiting = false;
						$scope.currentStocks = _this.forEachStock(response.result || []);
					});
				}
			};
			//获取选股列表
			$scope.getStocks = function() {
				var params = {userId: null}
				if ($scope.userId != null) {
					params.userId = $scope.userId;
				};
				ApiService.get(($scope.userId != null) ? ApiService.getApiUrl().userStock : ApiService.getApiUrl().selfStock, params,function(response){
					$scope.stock.listSize = response.totalCount;						
					$scope.stockList = response.result;
					var types = [];
					angular.forEach($scope.stockList, function(stock){
						if(['sz','sh'].indexOf(stock.stockType) > -1 && types.indexOf('zh') == -1){
							types.push('zh');
						}
						if(types.indexOf(stock.stockType) == -1 && ['sz','sh'].indexOf(stock.stockType) == -1  ){
							types.push(stock.stockType);
						}
					});
					$scope.stock.showCollapse();
					$scope.stock.types = types;
					$scope.stock.stocksWitch();
					element.find('input[name="keyword"]').val('');
				},function(response){
					$scope.stock.auth(response);
				});
			}

			//添加自选股
			$scope.addUserStock = function(stockCode, stockType){
				$scope.hideSearchBoxItems();
				$scope.selectStock = stockType+stockCode;
				StockService.addUserStock(stockCode, stockType, $scope, element.find('input[name="keyword"]'));
			}

			//删除自选股
			$scope.delUserStock = function(stockCode, stockType){
				$scope.selectStock = stockType+stockCode;
				StockService.delUserStock(stockCode, stockType, $scope);
			}
			
			function showSearchBoxItems(){
				$dropdownMenu.addClass('open');
			}
			
			$scope.hideSearchBoxItems = function(){
				if($dropdownMenu.hasClass('open')){
					$dropdownMenu.removeClass('open');
				}				
			}

			//搜索股票
			$scope.stockSearch = function($event, keyWord){
				$scope.keyWord = keyWord.replace(/[#$%^&*!/\\\]\[]/g, '');
				if ($scope.keyWord.length > 0) {
					var params = {keyword: $scope.keyWord, page: 1};
					ApiService.get(ApiService.getApiUrl().getSearchStock, params,
						function(response){
							$scope.searchStockSize = response.result.size;
							$scope.stockSearchList = response.result.stockList;
							if(response.result.size>0){
								showSearchBoxItems();
							}
						}
					);
				} else {
					$scope.searchStockSize = 0;
					$scope.hideSearchBoxItems();
				};
			}
			
			$scope.trade = function(code){
				$scope.stockCode = code;
				$scope.showSecBrokers = !$scope.showSecBrokers;
			}

			$scope.reLogin = function(){
				$UserService.authPage($scope);
			}
			
			//监听自选股是否添加成功
			$scope.$watch("stockChanged", function(){
				$scope.getStocks();
				if ($scope.isUserStock) {
					$scope.defaultSize = 5;
					$scope.searchStockSize = 0;
					$scope.stockSearchList = {};
					$scope.addSuccessMsg = true;
					var timer = $timeout(function(){
						$scope.addSuccessMsg = false;
						$scope.isUserStock = false;						
						$timeout.cancel(timer);
						$scope.hideSearchBoxItems();
					},1000);
				}
			});
			//每分钟获取一次自选股列表信息
			getStockTimer = $interval(function(){
				$scope.stock.async();
			}, 60000);

			//dom元素被移除前销毁$interval
			element.on("$destroy", function( event ) {
                $interval.cancel(getStockTimer);
            });
		}
	};
}]);

GLHApp.filter('stockFilter',function (){
	return function(items, selected) {
		var list = [];
		angular.forEach(items,function(item){
			if(selected == 'zh'){
				if(['sz','sh'].indexOf(item.type)>-1){
					list.push(item);
				}
			}else if(selected == item.type){
				list.push(item);
			}else if(selected == '' || selected == undefined){
				list.push(item);
			}
		});		
	    return list;
	  };
});