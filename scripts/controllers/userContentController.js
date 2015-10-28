/**
 * Created by Vincent on 2015/4/21.
 */

GLHApp.controller('UserContentController', ['$scope', '$rootScope', '$location', '$routeParams', '$UserService', 'CommService', '$q', 'ApiService', 'DialogService', 
    function ($scope, $rootScope, $location, $routeParams, $UserService, CommService, $q, ApiService, DialogService) {
        //默认显示我的帖子
        $scope.active = 0;
        $scope.postLists = [];
        $scope.commentLists = [];
        $scope.errPost="";
        $scope.errComment="";

        //分页初始化
        $scope.myPostPaginationConf = {
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
                $scope.getMyPostDatas();
            }
        }

        //分页初始化
        $scope.myCommentPaginationConf = {
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
                $scope.getMyCommentDatas();
            }
        }

        //设置当前tab
        $scope.setContentTab = function (n) {
            $scope.active = n;
        }
        
        //获取我的帖子数据
        $scope.getMyPostDatas = function () {
            $scope.isPostLoaded=false;
           // var user = $UserService.getUser();
            var params = {userId: "",
                count: 10,
                page: $scope.myPostPaginationConf.currentPageNum};

            $scope.postLists = [];
            ApiService.get(ApiService.getApiUrl().getPostList, params, function (response) {

                    var results = response.result;
                    $scope.myPostPaginationConf.totalItems = response.totalCount;
                    $scope.myPostPaginationConf.currentCounts = results.length;
                    for (var i in results) {
                        CommService.formatPubTime(results[i], results[i].createDate);
                        if (results[i].file) {
                            results[i].fileName = results[i].file.substr(results[i].file.lastIndexOf('\\') + 1);
                            results[i].fileName = results[i].fileName.substr(results[i].fileName.lastIndexOf('/') + 1);
                        }
                        $scope.postLists.push(results[i]);
                    }
                    if($scope.postLists.length==0){
                        $scope.errPost="您还没有发表过任何帖子.";
                    }
                    $scope.isPostLoaded=true;
                },
                function (response) {
                    $scope.isPostLoaded=true;
                    if(response.statusCode==403){
                        $UserService.authPage($scope);
                    }else{
                        $scope.errPost=response.message;
                    }
                });

        }
        
        //获取我的评论数据
        $scope.getMyCommentDatas = function () {
            $scope.isCommentLoaded=false;
            //var user = $UserService.getUser();
            var params = {userId: "",
                count: 10,
                page: $scope.myCommentPaginationConf.currentPageNum};

            $scope.commentLists = [];
            ApiService.get(ApiService.getApiUrl().getMyCommentList, params, function (response) {
                    var results = response.result;
                    $scope.myCommentPaginationConf.totalItems = response.totalCount;
                    $scope.myCommentPaginationConf.currentCounts = results.length;
                    for (var i in results) {
                        CommService.formatPubTime(results[i], results[i].createDate);
                        results[i].post = {};
                        results[i].post.content = results[i].postSummary;
                        CommService.formatPubTime(results[i].post, results[i].postCreateDate);
                        $scope.commentLists.push(results[i]);
                    }
                    if($scope.commentLists.length==0){
                        $scope.errComment="您还没有发表过任何评论.";
                    }
                    $scope.isCommentLoaded=true;
                },
                function (response) {
                    $scope.isCommentLoaded=true;
                    if(response.statusCode==403){
                        $UserService.authPage($scope);
                    }else{
                        $scope.errComment=response.message;
                    }
                });
        }
        
        //删除我的帖子
        $scope.deleteMyPost = function(post){
        	var deleteOrNo = DialogService.launch("confirm", "确定删除吗？");
        	DialogService.confirmYes = function () {
        		var params = {postId: post.postId};
        		ApiService.remove(ApiService.getApiUrl().deletePost, params, {},
        		function (response) {
        			if($scope.postLists.length<=1 && $scope.myPostPaginationConf.currentPageNum>1){
        				$scope.myPostPaginationConf.currentPageNum -= 1;
        			}else{
        				$scope.getMyPostDatas();
        			}
        		},
        		function (response) {
        			if (response.statusCode == 403) {
        				$UserService.authPage($scope);
        			}
        			if (response.statusCode == 417) {
        				DialogService.launch("error", response.message);
        			}
        		});
        	}
        }
        
        //删除我的评论
        $scope.deleteMyCommen = function(comment){
        	var deleteOrNo = DialogService.launch("confirm", "确定删除吗？");
        	DialogService.confirmYes = function () {
        		var params = {commentId: comment.commentId};
	        	ApiService.remove(ApiService.getApiUrl().deleteComment, params, {},
		            function (response) {
	        			if($scope.commentLists.length<=1 && $scope.myCommentPaginationConf.currentPageNum>1){
	        				$scope.myCommentPaginationConf.currentPageNum -= 1;
	        			}else{
	        				$scope.getMyCommentDatas();
	        			}
		            },
		            function (response) {
		                if (response.statusCode == 403) {
		                	$UserService.authPage($scope);
		                }
		                if (response.statusCode == 417) {
		                    DialogService.launch("error", response.message);
		                }
		        });
        	}
        }
        
        $scope.hellTitle = function(){
        	
        }

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