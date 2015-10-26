GLHApp.controller('recommendUserController', ['$scope', '$rootScope', '$http', '$location','$UserService','$routeParams','ApiService','$interval','$anchorScroll',
    function ($scope, $rootScope, $http, $location, $UserService, $routeParams,ApiService,$interval,$anchorScroll) {
		
		//个人认证
		$scope.certificationUser;
		//活跃用户
		$scope.activeUser;
		var cUserArray = [], aUserArray = [];
		
		//初始化数据
		$scope.showMsgDialog = false;

		
        //获取推荐用户
        ApiService.get(ApiService.getApiUrl().recommendUserList, {page: 1, count: 100}, function (response) {
        	$scope.certificationUser = response.result;
        	angular.forEach(response.result, function(data){
        		cUserArray.push(data.userId);
        	})
        	//获取推荐用户关注状态
        	followStatus(cUserArray);
        	console.log(cUserArray)
        });
        
        //获取活跃用户
        ApiService.get(ApiService.getApiUrl().recommendUserList, {page: 2, count: 12}, function (response) {
        	$scope.activeUser = response.result;
        	angular.forEach(response.result, function(data){
        		aUserArray.push(data.userId);
        	})
        	//获取活跃用户关注状态
        	followStatus(aUserArray);
        });
        
        
        //打开私信编辑框
		$scope.openMsgDialog = function(){ 
			/*需要登陆*/
        	if(!$UserService.isLoggedIn()){
        		$UserService.authPage($scope);
        	}else{
            	$scope.showMsgDialog = !$scope.showMsgDialog;
            }
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
            if(!$UserService.isLoggedIn()){
        		$UserService.authPage($scope);
        	}else{
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
            
        }
		
}]);