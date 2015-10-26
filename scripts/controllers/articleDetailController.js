/**
 * Created by Administrator on 2015/3/24.
 */

GLHApp.controller('ArticleDetailController', ['$scope', '$rootScope', '$sce', '$location', '$routeParams', 'ApiService', 'CommService', 'DialogService', '$UserService',
    function ($scope, $rootScope, $sce, $location, $routeParams, ApiService, CommService, DialogService, $UserService) {

        //分页初始化
        $scope.articleDetailPaginationConf = {
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
                $scope.getArticleDatas(this.currentPageNum);
            }
        }

        $scope.$on("initAfterLogin", function (event, options) {
            $scope.init();
        });

        $scope.$on('loadFeeds', function () {
            $scope.getArticleDatas(1);
        });

        //微信浏览器判断
        var userAg = navigator.userAgent.toLowerCase();
        if(userAg.indexOf('micromessenger')>-1){
            $scope.weixinBrowser = true;
        }else if(userAg=="" || userAg==undefined){
            $scope.weixinBrowser = true;
        }else{
            $scope.weixinBrowser = false;
        }

        //点赞初始化图片
        $scope.likeImg = "images/like.png";
        //收藏图片初始化
        $scope.favImg = "images/favorite.png";
        //$scope.likeImg = "images/like.png";

        $scope.readCountImg = "images/look.png"
        
        //初始化帖子详情数据
        $scope.init = function () {
        	$scope.postContent = [];
            //var articleId = $routeParams.articleId;

            var postId = $routeParams.postId;
            var params = {postId: postId};
            ApiService.get(ApiService.getApiUrl().getPost, params, function (response) {
                    var post = response.result;
                    if ($UserService.isLoggedIn() && post.commentCount > 0) {
                        $scope.speechImg = "images/speech-bubble-blue.png";
                    } else {
                        $scope.speechImg = "images/speech-bubble.png";
                    }
                    CommService.formatPubTime(post, post.createDate);

                    $scope.post = post;

                    //设置页面的title
                    if ($scope.post.title) {
                        $rootScope.title = $scope.post.nickname + ":" + $scope.post.title + "--格隆汇";
                    } else {
                        if ($scope.post.content.length > 30) {
                            $rootScope.title = $scope.post.nickname + ":" + $scope.post.content.substring(0, 30) + "...--格隆汇";
                        } else {
                            $rootScope.title = $scope.post.nickname + ":" + $scope.post.content + "--格隆汇";
                        }
                    }

                    if (!$scope.post.likcCount) {
                        $scope.post.likcCount = 0;
                    }

                    if (!$scope.post.postCount )
                    {
                        $scope.post.postCount = {readCount:0};
                    }

                    if ($UserService.isLoggedIn() && post.isLike == true) {
                        $scope.likeImg = "images/like_blue.png";
                    } else {
                        $scope.likeImg = "images/like.png";
                    }

                    if (!$scope.post.favCount) {
                        $scope.post.favCount = 0;
                    }

                    if ($UserService.isLoggedIn() && post.isFav == true) {
                        $scope.favImg = "images/favorite_blue.png";
                    } else {
                        $scope.favImg = "images/favorite.png";
                    }

                    if (!$scope.post.commentCount) {
                        //全局的评论总数  Vincent 2015/06/05
                        $scope.commentCounts = 0;
                    }

                    $scope.isLike = $scope.post.isLike;
                    $scope.isFav = $scope.post.isFav;
                    if ($scope.post.file) {
                        $scope.post.fileName = $scope.post.file.substr($scope.post.file.lastIndexOf('\\') + 1);
                        $scope.post.fileName = $scope.post.fileName.substr($scope.post.fileName.lastIndexOf('/') + 1);
                    }
                    $scope.postContent.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + $scope.post.content);
                    if ($UserService.getUser() && $UserService.getUser().user) {
                    	if($UserService.getUser().user.userId == $scope.post.userId){
                    		$scope.canDeletePost = true;
                    	}
                    }
                },
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        $location.path("/error/postNotFound");
                    }
                });

        }

        $scope.init();

        //获取帖子评论数据
        $scope.getArticleDatas = function (page) {
            $scope.articleDetailPaginationConf.currentPageNum = page || $scope.articleDetailPaginationConf.currentPageNum;
            var postId = $routeParams.postId;
            var params = {postId: postId, count: 10, page: $scope.articleDetailPaginationConf.currentPageNum};
            $scope.commentList = [];
            ApiService.get(ApiService.getApiUrl().getPostComment, params, function (response) {
                    var results = response.result;
                    $scope.articleDetailPaginationConf.totalItems = response.totalCount;
                    $scope.articleDetailPaginationConf.currentCounts = results.length;
                    $scope.commentCounts = response.totalCount;
                    //全局的评论总数  Vincent 2015/06/05
                    //if (response.totalCount) {
                    //    $scope.post.commentCount = response.totalCount;
                   // }
                    for (var i in results) {
                        CommService.formatPubTime(results[i], results[i].createDate);
                        if ($UserService.getUser() && $UserService.getUser().user) {
                        	if(results[i].userId == $UserService.getUser().user.userId){
                        		results[i].canDelete = true;
                        	}
                        }
                        $scope.commentList.push(results[i]);
                    }
                },
                function (response) {
                    if (response.statusCode == 406 || response.statusCode == 417) {
                        DialogService.launch("error", response.message);
                    }
                });
        };

        //帖子点赞处理
        $scope.likePost = function (isLike) {
            if ($UserService.isLoggedIn()) {
                $scope.likeDisable = true;
                var postId = $routeParams.postId;
                var params = {postId: postId};
                if (isLike) {
                    ApiService.remove(ApiService.getApiUrl().cancelLikePost, params, {},
                        function (response) {
                            var results = response.result;
                            $scope.likeImg = "images/like.png";
                            $scope.post.likcCount = $scope.post.likcCount - 1;
                            $scope.isLike = false;
                            $scope.likeDisable = false;
                        },
                        function (response) {
                            $scope.likeDisable = false;
                            if (response.statusCode == 403) {
                                $UserService.timeOutTip($("#btnDetailLike"), $scope);
                            }
                            if (response.statusCode == 417) {
                                DialogService.launch("error", response.message);
                            }
                        });
                } else {
                    ApiService.put(ApiService.getApiUrl().likePost, params, {},
                        function (response) {
                            var results = response.result;
                            $scope.likeImg = "images/like_blue.png";
                            $scope.post.likcCount += 1;
                            $scope.isLike = true;
                            $scope.likeDisable = false;
                        },
                        function (response) {
                            $scope.likeDisable = false;
                            if (response.statusCode == 403) {
                                $UserService.timeOutTip($("#btnDetailLike"), $scope);
                            }
                            if (response.statusCode == 417) {
                                DialogService.launch("error", response.message);
                            }
                        });
                }
            } else {
                $UserService.timeOutTip($("#btnDetailLike"), $scope);
            }
        };

        //帖子收藏处理
        $scope.favPost = function (isFav) {
            if ($UserService.isLoggedIn()) {
                $scope.favDisable = true;
                var postId = $routeParams.postId;
                var params = {postId: postId};
                if (isFav) {
                    ApiService.remove(ApiService.getApiUrl().delFavPost, params, {},
                        function (response) {
                            var results = response.result;
                            $scope.favImg = "images/start.png";
                            $scope.post.favCount = $scope.post.favCount - 1;
                            $scope.isFav = false;
                            $scope.favDisable = false;
                        },
                        function (response) {
                            $scope.favDisable = false;
                            if (response.statusCode == 403) {
                                $UserService.timeOutTip($("#btnDetailFave"), $scope);
                            }
                            if (response.statusCode == 417) {
                                DialogService.launch("error", response.message);
                            }
                        });
                } else {
                    ApiService.put(ApiService.getApiUrl().addFavPost, params, {},
                        function (response) {
                            var results = response.result;
                            $scope.favImg = "images/start-blue.png";
                            $scope.post.favCount += 1;
                            $scope.isFav = true;
                            $scope.favDisable = false;
                        },
                        function (response) {
                            $scope.favDisable = false;
                            if (response.statusCode == 403) {
                                $UserService.timeOutTip($("#btnDetailFave"), $scope);
                            }
                            if (response.statusCode == 417) {
                                DialogService.launch("error", response.message);
                            }
                        });
                }
            } else {
                $UserService.timeOutTip($("#btnDetailFave"), $scope);
            }
        };

        $scope.initReply = function ($event, postId, userId) {
            var _user_editor = angular.element($event.target).parent().parent();
            var _scopId = _user_editor.attr('data-scope-id');
            CommService.prepForBroadcast('replyComment-scope-' + _scopId, { "postId": postId, "userId": userId, "_broadcastId": _scopId, "commentId": null});
        }

        $scope.replyComment = function (obj, $event) {
            // obj.commentShow = !obj.commentShow;
            // $scope.reply($event, obj.item.postId, obj.item.userId, obj.item.commentId);
            var _user_editor = angular.element($event.target).parent().next().children('div');
            var _scopId = _user_editor.attr('data-scope-id');
            CommService.prepForBroadcast('replyComment-scope-' + _scopId,
                { "postId": obj.item.postId, "userId": obj.item.userId, "_broadcastId": _scopId, "commentId": obj.item.commentId});
            if (_user_editor.hasClass('hide')) {
                _user_editor.removeClass('hide');
            } else {
                _user_editor.addClass('hide');
            }
        }

        //删除自己的评论
        $scope.deleteComment = function (comment) {
        	var deleteOrNo = DialogService.launch("confirm", "确定删除吗？");
        	DialogService.confirmYes = function () {
        		var params = {commentId: comment.commentId};
        		ApiService.remove(ApiService.getApiUrl().deleteComment, params, {},
        				function (response) {
        			if($scope.commentList.length<=1 && $scope.articleDetailPaginationConf.currentPageNum>1){
        				$scope.articleDetailPaginationConf.currentPageNum -= 1;
        			}else{
        				$scope.getArticleDatas();
        			}
        		},
        		function (response) {
        			if (response.statusCode == 403) {
        				$UserService.timeOutTip($("#btnDeleteCom"), $scope);
        			}
        			if (response.statusCode == 417) {
        				DialogService.launch("error", response.message);
        			}
        		});
        	}
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
        
        $scope.deletePost = function(id){
        	var deleteOrNo = DialogService.launch("confirm", "确定删除吗？");
        	DialogService.confirmYes = function () {
        		var params = {postId: id};
        		ApiService.remove(ApiService.getApiUrl().deletePost, params, {},
        				function (response) {
        			$location.path('/userHome');
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

        $scope.shareLink = function () {
            if ($scope.post.title) {
                jiathis_config.title = "@" + $scope.post.nickname + ":" + $scope.post.title;
            } else {
                if ($scope.post.content) {
                    jiathis_config.title = "@" + $scope.post.nickname + ":" + $scope.post.content.substr(0, 20);
                }
            }
        }

    }]);