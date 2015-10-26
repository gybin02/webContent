/**
 * Created by liaozhida on 3/26/2015.
 */
GLHApp.directive('userTrends',['$rootScope','ApiService','CommService','$compile','$UserService',function($rootScope,ApiService,CommService,$compile,$UserService){
    return {    	
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: "templates/user-trends.html",
        controller:function($scope){        	
        	$scope.arrays = []; //feeds列表数据
        	$scope.page = 0; //页数
        	$scope.count = 5; //
        	$scope.isShowMore = true;
        	
        	$scope.feedsCount = $rootScope.result.newFeeds = 0;
        	$scope.$on('newFeeds',function(event,data){
        		$scope.feedsCount = data;
        	});
        	
        	//更多加载
        	$scope.$on('loadFeeds', function() {
            	$scope.loadFeeds(1,$scope.count);
            });
        	//拉取评论列表
            $scope.loadFeeds = function(page,count){
            	$scope.page = page;
            	ApiService.get(ApiService.getApiUrl().getFeedList,{page:page,count:count},function(data){
            		if(data.result && data.result.length>0){
            			$scope.arrays = data.result; 
                		$scope.asyncLoadUser($scope.arrays);
            		}else{
    					$scope.isShowMore = false;
    				}
            	});            	
            }
            //更新用户信息
            $scope.postExtendUser = function(users){
            	var index = ($scope.page-1) * ($scope.count);
            	for(var i = index; i < $scope.arrays.length; i++){
            		angular.forEach(users,function(u){            			
        				if($scope.arrays[i].userId == u.userId){        					
    						$scope.arrays[i].nickname = u.nickname;
    						$scope.arrays[i].avatar = u.avatar;
    						$scope.arrays[i].userType = u.userType;
            			}
    				})
            	}
            }
            //异步加载用户信息
            $scope.asyncLoadUser = function(feeds){            	
        		//异步用户信息
        		var userIdCollections = [];
    			angular.forEach(feeds,function(v,k){
    				if(userIdCollections.indexOf(v.userId)==-1){
    					userIdCollections.push(v.userId);
    				}
    			});
    			var params = userIdCollections.join(',');
    			ApiService.get(ApiService.getApiUrl().getUserList,{ userIds:params },function(users){    				
					if(users.result.length > 0){
    					$scope.postExtendUser(users.result);
    				}
    				if(feeds.length < $scope.count || feeds==null){
    					$scope.isShowMore = false;
            		}else{
            			$scope.page++;
            		}				
    			});
            }
        },
        link:function(scope,element,attrs){
        	scope.isShowWaiting = false;
            scope.loadMoreFeeds = function(count){
            	scope.isShowWaiting = true;
            	ApiService.get(ApiService.getApiUrl().getFeedList,{page:scope.page,count:count},function(response){
            		if(response.statusCode == 200){
                        scope.isShowWaiting = false;
	            		if(response.result && response.result.length>0){
	                		Array.prototype.push.apply(scope.arrays, response.result);
	                		scope.asyncLoadUser(response.result);

	            		}else{
                            scope.isShowMore = false;
                        }
            		}
            	},function(response){
                    scope.isShowMore = true;
                    scope.isShowWaiting = false;
            		if(response.statusCode == 403){

            			$UserService.authPage(scope);
                	}
            	});
            }
            scope.reply = function($event,postId,userId){
            	var _user_editor = angular.element($event.target).parent().parent().next();
            	var _scopId = _user_editor.attr('data-scope-id');
            	CommService.prepForBroadcast('replyComment-scope-'+_scopId,{ "postId":postId,"userId":userId,"_broadcastId":_scopId,"commentId":null});
            	if(_user_editor.hasClass('hide')){
            		_user_editor.removeClass('hide');
            	}else{
            		_user_editor.addClass('hide');
            	}
            }
            scope.loadFeeds(1,5);
        }
    }
}]);