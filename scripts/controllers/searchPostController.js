GLHApp.controller('SearchPostController', ['$rootScope','$scope','$routeParams','ApiService','$location',
    function ($rootScope,$scope,$routeParams,ApiService,$location) {

        $scope.key = $routeParams.key;

        //分页初始化
        var pageLimit = 7;
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
                $scope.initPostSearch();
            }
        };

      

        //页面跳转
        $scope.jump = function(path,param){
            $location.path(path+"/"+param);
        }

        //请求搜索结果
        $scope.initPostSearch = function(pager){
            var encodeKey = $scope.key;
            encodeKey = encodeURI(encodeKey);
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchPost, { keyword: encodeKey ,page:$scope.paginationConf.currentPageNum}, getSearchPostSucc);
            }
        };


        //回调函数
        var getSearchPostSucc = function(data){
            $scope.searchPostList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                    var searchPostList = value.postList;
                    $scope.searchPostList = searchPostList;
                    $scope.paginationConf.totalItems = value.totalCount;
                    $scope.paginationConf.currentCounts = searchPostList.length;

                }
            });
            console.log("post search result is ->" + $scope.searchPostList);
        }

}]);

