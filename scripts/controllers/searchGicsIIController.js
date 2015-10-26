GLHApp.controller('SearchGicsIIController', ['$rootScope','$scope','$routeParams','ApiService','$location',
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
                $scope.initGicsIISearch();
            }
        };



        //页面跳转
        $scope.jump = function(path,param){
            $location.path(path+"/"+param);
        }


        //请求搜索结果
        $scope.initGicsIISearch = function(pager){
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchGicsII,{ gicsI: $scope.key ,page:$scope.paginationConf.currentPageNum}, getSearchSucc);
            }
        };

        //搜索 二级行业下面的所有公司
        $scope.jump = function(param){
            console.debug("搜索 二级行业下面的所有公司:"+param);
            $location.path("searchGicsCompany/"+param);
        }

        //回调函数
        var getSearchSucc = function(data){
            $scope.stockGicsList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                     var GicsList = value;
                     $scope.paginationConf.currentCounts = GicsList .length;
                     $scope.GicsList  = GicsList ;
                }
                if (key == 'totalCount') {
                    $scope.paginationConf.totalItems = value;
                    console.log("the totalCount is :"+value);
                }
            });
            //console.log("search result is ->" + $scope.searchUserList);
        }

    }]);

