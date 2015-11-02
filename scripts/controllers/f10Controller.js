/**
 * Create by liaozhida
 */
GLHApp.controller('UserInfoController', ['$scope', '$routeParams', '$location', '$UserService', 'ApiService', function ($scope, $routeParams, $location, $UserService, ApiService) {
		//初始化数据
		$scope.destUserId = $routeParams.userId;
		$scope.currentTab = 'post';
		$scope.postList = null;
		$scope.favPostList = null;
		$scope.followings = null;
		$scope.followers = null;
		$scope.showMsgDialog = false;
		$scope.showAtDialog = false;
		$scope.loginTimeOut = false;

        $scope.postPageConf = {
        	currentPageNum: 1,
            itemsPerPage: 10,
            pagesLength: 9,
            numberOfPages: 0,
            totalItems: 0,
            onChange: function () {
            	$scope.getPostList(this.currentPageNum);
            }
        }

        $scope.favPostPageConf = {
        	currentPageNum: 1,
            itemsPerPage: 10,
            pagesLength: 9,
            numberOfPages: 0,
            totalItems: 0,
            onChange: function () {
            	$scope.getFavPostList($scope.favPostPageConf.currentPageNum);
            }
        }

        $scope.followingsPageConf = {
        	currentPageNum: 1,
            itemsPerPage: 10,
            pagesLength: 9,
            numberOfPages: 0,
            totalItems: 0,
            onChange: function () {
            	$scope.getFollowings($scope.followingsPageConf.currentPageNum);
            }
        }

        $scope.followersPageConf = {
        	currentPageNum: 1,
            itemsPerPage: 10,
            pagesLength: 9,
            numberOfPages: 0,
            totalItems: 0,
            onChange: function () {
            	$scope.getFollowers($scope.followersPageConf.currentPageNum);
            }
        }

		// 使用ID获取用户信息
		$scope.getUserById = function() {
			var params = {userId: $scope.destUserId};
			ApiService.get(ApiService.getApiUrl().getUserInfoById, params,
				function(response){
					if (response.result != null) {
						$scope.userInfo = response.result.user;
						$scope.followed = response.result.isFollow;
					} else {
						$location.path("/error/userNotFound");
					};
				}
			);
		}

		//关注用户
		$scope.followUser = function(uid){
			var data = {destUserId: uid};
			ApiService.post(ApiService.getApiUrl().followUser, {}, data,
				function(response){
					if (uid == $scope.destUserId) {
						$scope.followed = true;
					} else {
						if ($scope.currentTab == 'followings') {
							$scope.getFollowings($scope.followingsPageConf.currentPageNum);
						} else {
							$scope.getFollowers($scope.followersPageConf.currentPageNum);
						};
					};
				},
				function(response){
					if (response.statusCode == 403) {
						$scope.reLogin();
					};
				}
			);
		}

		//取消关注用户
		$scope.unfollowUser = function(uid){
			var data = {destUserId: uid};
			ApiService.post(ApiService.getApiUrl().unfollowUser, {}, data,
				function(response){
					if (uid == $scope.destUserId) {
						$scope.followed = false;
					} else {
						if ($scope.currentTab == 'followings') {
							$scope.getFollowings($scope.followingsPageConf.currentPageNum);
						} else {
							$scope.getFollowers($scope.followersPageConf.currentPageNum);
						};
					};
				},
				function(response){
					if (response.statusCode == 403) {
						$scope.reLogin();
					};
				}
			);
		}

		//取消帖子收藏
		$scope.removeFavor = function(pid){
			var params = {postId: pid};
			ApiService.remove(ApiService.getApiUrl().removeFavor, params, {},
				function(response){
					$scope.getFavPostList($scope.favPostPageConf.currentPageNum);
				}
			);
		}

		//获取帖子列表
		$scope.getPostList = function(currentPage) {
			$scope.postPageConf.currentPageNum = currentPage || $scope.postPageConf.currentPageNum;
			var params = {page: $scope.postPageConf.currentPageNum, userId: $scope.destUserId};
			ApiService.get(ApiService.getApiUrl().getPostList, params,
				function(response){
					$scope.postList = response.result;
					$scope.postPageConf.totalItems = response.totalCount;
					$scope.postPageConf.currentCounts = response.result.length;
				}
			);
		}

		

		//获取收藏列表
		$scope.getFavPostList = function(currentPage) {
			$scope.favPostPageConf.currentPageNum = currentPage || $scope.favPostPageConf.currentPageNum;
			var params = {page: $scope.favPostPageConf.currentPageNum, userId: $scope.destUserId};
			ApiService.get(ApiService.getApiUrl().getFavPostList, params,
				function(response){
					$scope.favPostList = response.result;
					$scope.favPostPageConf.totalItems = response.totalCount;
					$scope.favPostPageConf.currentCounts = response.result.length;
				},
				function(response){
					if (response.statusCode == 403) {
						$scope.loginTimeOut = true;
					};
				}
			);
		}

		//获取关注列表
		$scope.getFollowings = function(currentPage) {
			$scope.followingsPageConf.currentPageNum = currentPage || $scope.followingsPageConf.currentPageNum;
			var params = {page: $scope.followingsPageConf.currentPageNum, userId: $scope.destUserId};
			ApiService.get(ApiService.getApiUrl().getFollowings, params,
				function(response){
					$scope.followings = response.result;
					$scope.followingsPageConf.totalItems = response.totalCount;
					$scope.followingsPageConf.currentCounts = response.result.length;
				},
				function(response){
					if (response.statusCode == 403) {
						$scope.loginTimeOut = true;
					};
				}
			);
		}

		//获取粉丝列表
		$scope.getFollowers = function(currentPage) {
			$scope.followersPageConf.currentPageNum = currentPage || $scope.followersPageConf.currentPageNum;
			var params = {page: $scope.followersPageConf.currentPageNum, userId: $scope.destUserId};
			ApiService.get(ApiService.getApiUrl().getFollowers, params,
				function(response){
					$scope.followers = response.result;
					$scope.followersPageConf.totalItems = response.totalCount;
					$scope.followersPageConf.currentCounts = response.result.length;
				},
				function(response){
					if (response.statusCode == 403) {
						$scope.loginTimeOut = true;
					};
				}
			);
		}

		//tab页之间切换
		$scope.showTab = function(tabname){
			$scope.currentTab = tabname;
		}

		//打开私信编辑框
		$scope.openMsgDialog = function(){
			$scope.showMsgDialog = !$scope.showMsgDialog;
		}

		//打开@信息编辑框
		$scope.openAtDialog = function(){
			$scope.showAtDialog = !$scope.showAtDialog;
		}

		//登录过期重新登录
		$scope.reLogin = function(){
			$UserService.authPage($scope);
		}

		//跳转到帖子详情
		$scope.postDetail = function(pid){
			window.location.href="/p/" + pid+".html";
		}

		//跳转到用户详情
		$scope.userDetail = function(uid){
			$location.path("/userInfo/" + uid);
		}

		$scope.$on("followAction", function(event, userInfo){
			if (userInfo.userInfo.user.userId === Number($scope.destUserId)) {
				$scope.followed = true;
			};
			if ($scope.currentTab == 'followings') {
				$scope.getFollowings($scope.followingsPageConf.currentPageNum);
			} else {
				$scope.getFollowers($scope.followersPageConf.currentPageNum);
			};
		});

		$scope.$on("unfollowAction", function(event, userInfo){
			if (userInfo.userInfo.user.userId === Number($scope.destUserId)) {
				$scope.followed = false;
			};
			if ($scope.currentTab == 'followings') {
				$scope.getFollowings($scope.followingsPageConf.currentPageNum);
			} else {
				$scope.getFollowers($scope.followersPageConf.currentPageNum);
			};
		});

		$scope.getUserById();
    }]);