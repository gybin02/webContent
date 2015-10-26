/**
 * Created by Vincent on 2015/4/21.
 */

GLHApp.controller('UserMessageController', ['$scope', '$rootScope', '$location', '$routeParams', '$UserService', 'CommService', 'ApiService', 'DialogService',
    function ($scope, $rootScope, $location, $routeParams, $UserService, CommService, ApiService, DialogService) {
        $scope.messages = [];
        $scope.sendMessages = [];
        $scope.errMessage = "";
        $scope.errSendMessage = "";
        $scope.active=0;

        //分页初始化
        $scope.recieMsgPaginationConf = {
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
                $scope.getReciveDatas();
            }
        }

        //分页初始化
        $scope.sendMsgPaginationConf = {
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
                $scope.getSendDatas();
            }
        }

        $scope.setContentTab = function (n) {
            $scope.active=n;
        }


        $scope.getReciveDatas = function () {
            $scope.isMessagedLoaded = false;
            $scope.messages = [];
            var user = $UserService.getUser();
            var params = {sendTo: user.user.userId, count: 10, page: $scope.recieMsgPaginationConf.currentPageNum, sendFrom: ''};
            ApiService.get(ApiService.getApiUrl().getMessagesList, params, function (response) {
                    $scope.errShow = false;
                    var results = response.result;
                    $scope.recieMsgPaginationConf.totalItems = response.totalCount;
                    $scope.recieMsgPaginationConf.currentCounts = results.length;
                    for (var i in results) {
                        CommService.formatPubTime(results[i], results[i].sendTime);
                        $scope.messages.push(results[i]);
                    }
                    $scope.isMessagedLoaded = true;
                    if ($scope.messages.length == 0) {
                        $scope.errMessage = "还没有收到私信.";
                    }
                },
                function (response) {
                    $scope.isMessagedLoaded = true;
                    if (response.statusCode == 403) {
                        $UserService.authPage($scope);
                    } else {
                        $scope.errMessage = response.message;
                    }
                });
        }

        $scope.getSendDatas = function () {
            $scope.isSendMessagedLoaded = true;
            $scope.sendMessages = [];
            var user = $UserService.getUser();
            var params = {sendFrom: user.user.userId, count: 10, page: $scope.sendMsgPaginationConf.currentPageNum, sendTo: ''};
            ApiService.get(ApiService.getApiUrl().getMessagesList, params, function (response) {
                    $scope.errShow = false;
                    var results = response.result;
                    $scope.sendMsgPaginationConf.totalItems = response.totalCount;
                    $scope.sendMsgPaginationConf.currentCounts = results.length;
                    for (var i in results) {
                        CommService.formatPubTime(results[i], results[i].sendTime);
                        $scope.sendMessages.push(results[i]);
                    }
                    $scope.isSendMessagedLoaded = true;
                    if ($scope.sendMessages.length == 0) {
                        $scope.errSendMessage = "还没有发送过私信.";
                    }
                },
                function (response) {
                    $scope.isSendMessagedLoaded = true;
                    if (response.statusCode == 403) {
                        $UserService.authPage($scope);
                    } else {
                        $scope.errSendMessage = response.message;
                    }
                });
        }

        $scope.reply = function($event,postId,userId){
	         var _user_editor = angular.element($event.target).parent().parent().next();
	         var _scopId = _user_editor.attr('data-scope-id');
	         CommService.prepForBroadcast('replyComment-scope-'+_scopId,{ "postId":postId,"userId":userId,"_broadcastId":_scopId,"commentId":null});
	         if(_user_editor.hasClass('hide')){
	        	 _user_editor.removeClass('hide');
	         }else{
	        	 _user_editor.addClass('hide');
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
        
        //打开私信编辑框
		$scope.openMsgDialog = function(message){
			$scope.showMsgDialog = !$scope.showMsgDialog;
			$scope.userInfo = {};
			$scope.userInfo.toUserId = message.sendFrom;
			$scope.userInfo.fromUserId = message.sendTo;
			$scope.userInfo.toNickName = message.nick;
		}

    }]);