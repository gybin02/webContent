GLHApp.controller('SearchUserController', ['$rootScope','$scope','$routeParams','ApiService','$location','DialogService','$UserService',
    function ($rootScope,$scope,$routeParams,ApiService,$location,DialogService,$UserService) {

        $scope.key = $routeParams.key;
        var userIdArray = new Array();


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
                $scope.initUserSearch();
            }
        };

        console.info("请求搜索结果---1");



        //页面跳转
        $scope.jump = function(path,param){
            $location.path(path+"/"+param);
        }

        //请求搜索结果
        $scope.initUserSearch = function(pager){
            console.debug("请求搜索结果");
            var encodeKey = $scope.key;
            encodeKey = encodeURI(encodeKey);
            if($scope.key!=""){
                ApiService.get(ApiService.getApiUrl().getSearchUser,{ keyword: encodeKey ,page:$scope.paginationConf.currentPageNum}, getSearchUserSucc);
            }
        };
        //回调函数
        var getSearchUserSucc = function(data){
            console.debug("回调函数成功");
            $scope.searchUserList =  new Object();
            angular.forEach(data, function (value, key) {
                if (key == 'result') {
                    var searchUserList = value.userList;
                    $scope.paginationConf.totalItems = value.totalCount;
                    $scope.paginationConf.currentCounts = searchUserList.length;
                    $scope.searchUserList = searchUserList;

                    angular.forEach(searchUserList, function (value, key) {
                        userIdArray.push(value.userId);
                    });

                    for(var i = 0;i<userIdArray.length;i++){
                        console.debug("-->"+userIdArray[i]);
                    }
                    followStatus(userIdArray);
                }
            });
            //console.log("search result is ->" + $scope.searchUserList);
        }


        //查看是否已关注用户
        var followStatus = function (data) {
            ApiService.get(ApiService.getApiUrl().getFollowStatus,{ userIds: data }, getIsFollowSucc);
        }
        var getIsFollowSucc = function(data){
            angular.forEach(data, function (value, key) {
                if(key == 'statusCode'){
                    if(value!='200'){
                        return;
                    }
                }
                if (key == 'result') {
                    $scope.followStatus =  new Object();
                    $scope.followStatus = value;
                }
            });
        }


        //取消关注
        $scope.unfollow = function(item){
            var params = {};
            var datas = {destUserId:item};
            ApiService.put(ApiService.getApiUrl().unfollow, params, datas,
                function (response) {
                    $scope.followStatus[item] = false;
                },
                function (response) {
                    if(response.statusCode==403){
                        $UserService.authOpretion($scope);
                    }
                    if(response.statusCode==406 || response.statusCode==417){
                        DialogService.launch("error",response.message);
                    }
                });
        }
        //添加关注
        $scope.addAttention = function(item){
            var params = {};
            var datas = {destUserId:item};
            ApiService.put(ApiService.getApiUrl().addAttention, params, datas,
                function (response) {
                    $scope.followStatus[item] = true;
                },
                function (response) {
                    console.info("add follow response:"+response.statusCode);
                    if(response.statusCode==403){
                        $UserService.authOpretion($scope);
                    }
                    if(response.statusCode==406 || response.statusCode==417){
                        DialogService.launch("error",response.message);
                    }
                });
        }



}]);

