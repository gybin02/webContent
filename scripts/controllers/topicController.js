/**
 * Created by vincent on 4/2/2015.
 */
GLHApp.controller('TopicController', ['$scope', '$rootScope', '$location', '$routeParams', 'ApiService', 'CommService', 'DialogService',
    function ($scope, $rootScope, $location, $routeParams, ApiService, CommService, DialogService) {
		//分页初始化
	    $scope.topicPaginationConf = {
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
	            $scope.getArticleDatas(this.currentPageNum);
	        }
	    }

        $scope.getArticleDatas = function (page) {
	    	$scope.topicPaginationConf.currentPageNum = page || $scope.topicPaginationConf.currentPageNum;
        	var articleCode = $routeParams.topicCode;
            var params = {columnCode: articleCode, limit: 10, page: page};
            ApiService.get(ApiService.getApiUrl().getArticleList, params, function (response) {
                    $scope.topicList = [];
                    $scope.columnName = response.result.columnName;
                    var results = response.result.articleList;
                    for (var i in results) {
                        var article = results[i];
                        CommService.formatPubTime(article, article.publishTime);
                        $scope.topicList.push({
                            id: article.articleId,
                            postId: article.postId,
                            imgSrc: article.picturePath,
                            title: article.articleTitle,
                            content: article.articleSummary,
                            author: article.author,
                            latestTime: article.publishTimeLoc,
                            discussCount: article.commentCount,
                            praiseCount: article.likeCount,
                            userId:article.userId,
                            readCount:article.readCount
                        });
                    }
                    $scope.topicPaginationConf.totalItems = response.totalCount;
                    $scope.topicPaginationConf.currentCounts = results.length;
                    $scope.isLoaded = true;
                },
                function (response) {
                    $scope.isLoaded = true;
		    if(response.statusCode==406 || response.statusCode==417){
    			DialogService.launch("error",response.message);
    			}
                }
            );
        }
	    
	    //分页初始化
	    $scope.mediaTopicPaginationConf = {
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
	            $scope.getMediaArticleDatas(this.currentPageNum);
	        }
	    }
	    
	    
	    $scope.getMediaArticleDatas = function (page) {
	    	$scope.mediaTopicPaginationConf.currentPageNum = page || $scope.mediaTopicPaginationConf.currentPageNum;
	    	var params = {count: 10, page: page};
            ApiService.get(ApiService.getApiUrl().getMediaArticleList, params, function (response) {
                    $scope.mediaTopicList = [];
                    $scope.columnName = "众说";
                    var results = response.result;
                    for (var i in results) {
                        var article = results[i];
                        CommService.formatPubTime(article, article.timestamp);
                        $scope.mediaTopicList.push({
                            title: article.articleTitle,
                            content: article.content,
                            mediaName: article.mediaName,
                            latestTime: article.publishTimeLoc,
                            articleUrl:article.articleUrl
                        });
                    }
                    $scope.mediaTopicPaginationConf.totalItems = response.totalCount;
                    $scope.mediaTopicPaginationConf.currentCounts = results.length;
                    $scope.isLoaded = true;
                },
                function (response) {
                    $scope.isLoaded = true;
				    if(response.statusCode==406 || response.statusCode==417){
		    			DialogService.launch("error",response.message);
		    		}
                }
            );
        }

        $scope.getArticleDetail = function (postId) {
            $location.path("/articleDetail/" + postId);
        }

        //打开用户详情
        $scope.openUser=function(userId){
            $location.path("/userInfo/"+userId);
        }

    }]);
