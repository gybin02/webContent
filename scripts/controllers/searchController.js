GLHApp.controller('SearchController', ['$rootScope','$scope','$routeParams','ApiService',
    function ($rootScope,$scope,$routeParams,ApiService) {

        $scope.key = $routeParams.key;
        $scope.totalCount = 0;
        $scope.currentPage = 1;
        $scope.pageNum = 1;
        $scope.pageShow = 7;
        $scope.jumpPageNum = "";
        //for(var i = 0;i<4;i++){
        //    $scope.pageNum.push(1);
        //}


        //请求搜索结果
        $scope.initPostSearch = function(pager){
            var encodeKey = $scope.key;
            encodeKey = encodeURI(encodeKey);
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchPost, { keyword: encodeKey ,page:pager}, getSearchPostSucc);
            }
        };
        $scope.initStockSearch = function(pager){
            var encodeKey = $scope.key;
            encodeKey = encodeURI(encodeKey);
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchStock, { keyword: encodeKey ,page:pager}, getSearchStockSucc);
            }
        };
        $scope.initUserSearch = function(pager){
            var encodeKey = $scope.key;
            encodeKey = encodeURI(encodeKey);
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchUser,{ keyword: encodeKey ,page:pager}, getSearchUserSucc);
            }
        };

        //回调函数
        var getSearchPostSucc = function(data){
            $scope.searchPostList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                    var searchPostList = value.postList;
                    $scope.totalCount = value.totalCount;
                    $scope.searchPostList = searchPostList;
                    caculatePage();
                }
            });
            //console.log("post search result is ->" + $scope.searchPostList);
        }
        var getSearchStockSucc = function(data){
            $scope.searchStockList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                    var searchStockList = value.stockList;
                    $scope.totalCount = value.totalCount;
                    $scope.searchStockList = searchStockList;
                    caculatePage();
                }
            });
            //console.log("stock search result is ->" + $scope.searchStockList);
        }
        var getSearchUserSucc = function(data){
            $scope.searchUserList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                    var searchUserList = value.userList;
                    $scope.totalCount = value.totalCount;
                    $scope.searchUserList = searchUserList;
                    caculatePage();
                }
            });
            //console.log("search result is ->" + $scope.searchUserList);
        }

        //计算页数
        var caculatePage = function () {
            if($scope.totalCount%$scope.pageShow != 0 ){
                if($scope.totalCount<$scope.pageShow){
                    $scope.pageNum = Math.round($scope.totalCount/$scope.pageShow);
                }else{
                    $scope.pageNum = Math.round($scope.totalCount/$scope.pageShow)+1;
                }
            }else{
                $scope.pageNum =  Math.round($scope.totalCount/$scope.pageShow) ;
            }
        }



        $scope.next = function(value){
            if(($scope.currentPage+1)<=$scope.pageNum){
                $scope.currentPage+=1;
                selectSearchType(value);
            }

        };

        $scope.preview = function(value){
            if( ($scope.currentPage-1)>0 ){
                $scope.currentPage-=1;
                selectSearchType(value);
            }
        };

        $scope.jump = function(event,value){
            if (event.keyCode == 13){
                if($scope.jumpPageNum<=0 || $scope.jumpPageNum>$scope.pageNum){
                }else{
                    $scope.currentPage =  $scope.jumpPageNum;
                    selectSearchType(value);
                }
            }
        }
        
        var selectSearchType = function (typeName) {
            if(typeName=='user'){
                $scope.initUserSearch($scope.currentPage);
            }else if(typeName=='stock'){
                $scope.initStockSearch($scope.currentPage);
            }else if(typeName=='post'){
                $scope.initPostSearch($scope.currentPage);
            }

        }
}]);

