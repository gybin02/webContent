/**
 * Created by Vincent on 2015/4/21.
 */

GLHApp.controller('UserFansController', ['$scope', '$rootScope', '$location', '$routeParams', '$UserService', 'CommService', 'ApiService', 'DialogService',
    function ($scope, $rootScope, $location, $routeParams, $UserService, CommService, ApiService, DialogService) {

        $scope.fans = [];
        $scope.errMsg = "";

        $scope.fansNum = 0;

        //分页初始化
        $scope.userFansPaginationConf = {
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
            onChange: function () {
                $scope.getUserFansDatas(this.currentPageNum);
            }
        }

        $scope.getUserFansDatas = function (page) {
            $scope.isDataLoaded = false;
            $scope.fans = [];
            var userId=$UserService.getUser()==null?"":$UserService.getUser().user.userId;
            var params = {userId: userId, count: 10, page: $scope.userFansPaginationConf.currentPageNum};
            ApiService.get(ApiService.getApiUrl().getFollowers, params, function (response) {

                    var results = response.result;
                    $scope.userFansPaginationConf.totalItems = response.totalCount;
                    $scope.userFansPaginationConf.currentCounts = results.length;
                    $scope.fansNum = response.totalCount;
                    for (var i in results) {
                        $scope.fans.push(results[i]);
                    }
                    $scope.isDataLoaded = true;
                    if ($scope.fans.length == 0) {
                        $scope.errMsg = "您目前还没有粉丝.";
                    }
                },
                function (response) {
                    $scope.isDataLoaded = true;
                    if (response.statusCode == 403) {
                        $UserService.authPage($scope);
                    } else {
                        $scope.errMsg = response.message;
                    }
                });

        }

        $scope.unfollow = function (item) {
            var params = {};
            var datas = {destUserId: item.userId};
            ApiService.put(ApiService.getApiUrl().unfollow, params, datas, function (response) {
                    item.isFollow = !item.isFollow;
                },
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        DialogService.launch("error", response.message);
                    }
                });
        }

        $scope.addAttention = function (item) {
            var params = {};
            var datas = {destUserId: item.userId};
            ApiService.put(ApiService.getApiUrl().addAttention, params, datas, function (response) {
                    item.isFollow = !item.isFollow;
                },
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        DialogService.launch("error", response.message);
                    }
                });
        }

        //打开用户详情
        $scope.openUser = function (userId) {
            $location.path("/userInfo/" + userId);
        }
        
        //@面板显示
        $scope.$on("atUser", function (event, options) {
        	$scope.atUserNickname = options.nickName;
        	$scope.showAtDialog = !$scope.showAtDialog;
        });

    }]);