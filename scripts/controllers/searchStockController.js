GLHApp.controller('SearchStockController', ['$rootScope','$scope','$routeParams','ApiService','$location',
    function ($rootScope,$scope,$routeParams,ApiService,$location) {

        $scope.key = $routeParams.key;

        //分页初始化
        var pageLimit = 10;
        $scope.paginationConf = {
            //当前页码
            currentPageNum: 1,
            //每页显示数
            itemsPerPage: 10,
            //页码显示个数
            pagesLength: 9,
            //总页数
            numberOfPages: 0,
            //总记录数
            totalItems: 0,
            onChange: function(){
                $scope.initStockSearch();
            }
        };


        //页面跳转
        $scope.jump = function(path,param){
            $location.path(path+"/"+param);
        }

        //请求搜索结果
        $scope.initStockSearch = function(pager){
            var encodeKey = $scope.key;
            encodeKey = encodeURI(encodeKey);
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchStock, { keyword: encodeKey ,page:$scope.paginationConf.currentPageNum}, getSearchStockSucc);
            }
        };

        //回调函数
        var getSearchStockSucc = function(data){
            $scope.searchStockList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                    var searchStockList = value.stockList;
                   // $scope.totalCount = value.totalCount;
                    $scope.paginationConf.totalItems = value.totalCount;
                    $scope.paginationConf.currentCounts = searchStockList.length;
                    $scope.searchStockList = searchStockList;
                }
            });
            //console.log("stock search result is ->" + $scope.searchStockList);
        }

}]);

