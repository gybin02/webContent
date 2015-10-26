GLHApp.controller('SearchMoreController', ['$rootScope','$scope','$routeParams','ApiService','$location',
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
                $scope.initMoreSearch();
            }
        };

        //页面跳转
        $scope.jump = function(param,level){
            var path="";
            console.debug("lvel:"+level);
            if(level==1){
                path = "searchGicsII";
            }else if(level==2){
                path="searchGicsCompany";
            }
            console.debug("the path is :"+path+"----"+param);
            $location.path(path+"/"+param);
        }


        //请求搜索结果
        $scope.initMoreSearch = function(pager){
            var encodeKey = $scope.key;
            encodeKey = encodeURI(encodeKey);
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchGics,{ keyword: encodeKey ,page:$scope.paginationConf.currentPageNum}, getSearchSucc);
            }
        };



        //回调函数
        var getSearchSucc = function(data){
            $scope.stockGicsList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                     var stockGicsList = value;
                     $scope.paginationConf.currentCounts = stockGicsList.length;
                     $scope.stockGicsList = stockGicsList;
                }
                if (key == 'totalCount') {
                    $scope.paginationConf.totalItems = value;
                    console.log("the totalCount is :"+value);
                }
            });
            //console.log("search result is ->" + $scope.searchUserList);
        }

    }]);

