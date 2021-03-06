GLHApp.controller('SearchGicsCompanyController', ['$rootScope','$scope','$routeParams','ApiService','$location',
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
                $scope.initGicsCompanySearch();
            }
        };



        //页面跳转
        $scope.jump = function(path,param){
            $location.path(path+"/"+param);
        }


        //请求搜索结果
        $scope.initGicsCompanySearch = function(pager){
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchGicsCompany,{ gicsII: $scope.key ,page:$scope.paginationConf.currentPageNum}, getSearchSucc);
            }
        };

        //搜索一级行业下的二级行业列表 或者 二级行业下面的所有公司
        $scope.gicsDetails = function(path,param){
            $location.path(path+"/"+param);
        }

        //回调函数
        var getSearchSucc = function(data){
            $scope.stockGicsList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                     var gicsStockList = value;
                     $scope.paginationConf.currentCounts = gicsStockList .length;
                     $scope.gicsStockList  = gicsStockList ;
                }
                if (key == 'totalCount') {
                    $scope.paginationConf.totalItems = value;
                    console.log("the totalCount is :"+value);
                }
            });
            //console.log("search result is ->" + $scope.searchUserList);
        }

    }]);

