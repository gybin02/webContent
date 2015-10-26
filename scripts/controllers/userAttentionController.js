/**
 * Created by Vincent on 2015/4/21.
 */

GLHApp.controller('UserAttentionController', ['$scope', '$rootScope', '$http', '$location', '$UserService', 'ApiService', 'CommService',
    function ($scope, $rootScope, $http, $location, $UserService, ApiService, CommService) {
        $scope.attentions = [];
        $scope.errMsg = "";

        $scope.attentionNums = 0;

        //分页初始化
        $scope.attentionPaginationConf = {
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
                $scope.getAttentionDatas();
            }
        }

        $scope.getAttentionDatas = function (page) {
            $scope.isDataLoaded = false;
            $scope.attentions = [];
            var userId=$UserService.getUser()==null?"":$UserService.getUser().user.userId;
            var params = {userId: userId, count: 10, page: $scope.attentionPaginationConf.currentPageNum};
            ApiService.get(ApiService.getApiUrl().getFollowings, params, function (response) {
                    var results = response.result;
                    $scope.attentionPaginationConf.totalItems = response.totalCount;
                    $scope.attentionPaginationConf.currentCounts = results.length;
                    $scope.attentionNums = response.totalCount;
                    for (var i in results) {
                        $scope.attentions.push(results[i]);
                    }
                    $scope.isDataLoaded = true;
                    if ($scope.attentions.length == 0) {
                        $scope.errMsg = "您还没有关注的人.";
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
            	if($scope.attentions.length<=1 && $scope.attentionPaginationConf.currentPageNum>1){
    				$scope.attentionPaginationConf.currentPageNum -= 1;
    			}else{
    				$scope.getAttentionDatas();
    			}
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
        
        //弹出框取消用户关注
        $scope.$on("unfollowAction", function (event, options) {
        	var attens = $scope.attentions;
        	for(var i in attens){
        		if(attens[i].userId == options.userInfo.user.userId){
        			$scope.attentions.splice(i, 1);
        			$scope.attentionNums = $scope.attentionNums - 1;
        			break;
        		}
        	}
        });


    }]);