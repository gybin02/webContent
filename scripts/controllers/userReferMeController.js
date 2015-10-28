/**
 * Created by Vincent on 2015/4/21.
 */

GLHApp.controller('UserReferMeController', ['$scope', '$rootScope', '$location', '$routeParams', '$UserService', 'CommService', '$q', 'ApiService', 'DialogService',
    function ($scope, $rootScope, $location, $routeParams, $UserService, CommService, $q, ApiService, DialogService) {

        $scope.isNotLogin = false;

        $scope.referMeList = [];
        $scope.errMsg = "";

        //分页初始化
        $scope.userReferPaginationConf = {
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
                $scope.getReferDatas();
            }
        }

        $scope.getReferDatas = function () {
            $scope.isDataLoaded = false;
            $scope.referMeList = [];
            var params = {count: 10, page: $scope.userReferPaginationConf.currentPageNum};
            ApiService.get(ApiService.getApiUrl().getReferList, params, function (response) {
                    var results = response.result;
                    $scope.userReferPaginationConf.totalItems = response.totalCount;
                    $scope.userReferPaginationConf.currentCounts = results.length;
                    for (var i in results) {
                        CommService.formatPubTime(results[i], results[i].createDate);
                        results[i].post = {};
                        results[i].post.content = results[i].summary;
                        CommService.formatPubTime(results[i].post, results[i].postCreateDate);
                        $scope.referMeList.push(results[i]);
                    }

                    if ($scope.referMeList.length == 0) {
                        $scope.errMsg = "暂时还没有提到您的内容.";
                    }
                    $scope.isDataLoaded = true;
                },
                function (response) {
                    $scope.isDataLoaded = true;
                    if (response.statusCode != 403) {
                        $scope.errMsg = response.message;
                    }else{
                        $UserService.authPage($scope);
                    }
                });
        }

        /*$scope.reply = function($event, postId, userId, commentId){
         var _user_editor = angular.element($event.target).parent().parent().next();
         var _scopId = _user_editor.attr('data-scope-id');
         CommService.prepForBroadcast('replyComment-scope-'+_scopId,{ "postId":postId,"userId":userId,"_broadcastId":_scopId,"commentId":commentId});
         if(_user_editor.hasClass('hide')){
         _user_editor.removeClass('hide');
         }else{
         _user_editor.addClass('hide');
         }
         }*/

        //打开用户详情
        $scope.openUser = function (userId) {
            $location.path("/userInfo/" + userId);
        }

        //跳转到帖子详情
        $scope.postDetail = function (postId) {
            window.location.href="/p/" + postId+".html";
        }
        
        //@面板显示
        $scope.$on("atUser", function (event, options) {
        	$scope.atUserNickname = options.nickName;
        	$scope.showAtDialog = !$scope.showAtDialog;
        });

    }]);