/**
 * Created by Vincent on 2015/4/21.
 */

GLHApp.controller('UserFavoriteController', ['$scope', '$rootScope', '$location', '$routeParams', '$UserService', 'CommService', 'ApiService', 'DialogService',
    function ($scope, $rootScope, $location, $routeParams, $UserService, CommService, ApiService, DialogService) {

        $scope.favLists = [];
        $scope.errMsg = "";
        //初始默认显示我的帖子
        $scope.active = 0;

        $scope.setContentTab = function (n) {
            $scope.active = n;
        }

        $scope.removeFav = function (item) {
            var params = {postId: item.postId};
            ApiService.remove(ApiService.getApiUrl().removeFavor, params, {}, function (response) {
            	if($scope.favLists.length<=1 && $scope.userFavPaginationConf.currentPageNum>1){
    				$scope.userFavPaginationConf.currentPageNum -= 1;
    			}else{
    				$scope.getUserFavDatas();
    			}
            },
            function (response) {
                if (response.statusCode == 406 || response.statusCode == 417) {
                    DialogService.launch("error", response.message);
                }
            });
        }

        //分页初始化
        $scope.userFavPaginationConf = {
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
                $scope.getUserFavDatas();
            }
        }

        $scope.getUserFavDatas = function () {
            $scope.isfavLoaded = false;
            var params = {userId: "", count: 10, page: $scope.userFavPaginationConf.currentPageNum};
            $scope.favLists = [];
            ApiService.get(ApiService.getApiUrl().getFavPostList, params, function (response) {
                    var results = response.result;
                    $scope.userFavPaginationConf.totalItems = response.totalCount;
                    $scope.userFavPaginationConf.currentCounts = results.length;
                    for (var i in results) {
                        CommService.formatPubTime(results[i], results[i].createDate);
                        $scope.favLists.push(results[i]);
                    }
                    $scope.isfavLoaded = true;
                    if ($scope.favLists.length == 0) {
                        $scope.errMsg = "您还没有添加任何收藏.";
                    }
                },
                function (response) {
                    $scope.isfavLoaded = true;
                    if (response.statusCode == 403) {
                        $UserService.authPage($scope);
                    } else {
                        $scope.errMsg = response.message;
                    }
                });

        }

        //打开用户详情
        $scope.openUser = function (userId) {
            $location.path("/userInfo/" + userId);
        }

        //跳转到帖子详情
        $scope.postDetail = function (postId) {
            $location.path("/articleDetail/" + postId);
        }
        
        //@面板显示
        $scope.$on("atUser", function (event, options) {
        	$scope.atUserNickname = options.nickName;
        	$scope.showAtDialog = !$scope.showAtDialog;
        });
    }]);