/**
 * Created by Ellis.Xie on 5/11/2015
 *
 * Example: 
 *		<link rel="stylesheet" href="styles/modal.css">
 *		<link rel="stylesheet" href="styles/user-editor.css">
 *		<link rel="stylesheet" href="styles/message-editor.css">
 *		<message-editor show="exp..." touserid="exp..." tousername="exp..." fromuserid="exp..."></message-editor>
 */
GLHApp.directive('messageEditor', ['$timeout','$UserService', 'ApiService', function($timeout, $UserService, ApiService){
	return {
		scope: {
			show: '=',
			touserid: '=',
			tousername: '=',
			fromuserid: '='
		},
		restrict: 'E',
		replace: true,
		transclude: true,
		templateUrl: 'templates/message-editor.html',
		link: function(scope, element, attrs) {
			scope.disableBtn = false;

			//发送私信
			scope.sendMessage = function(){
				if (!scope.disableBtn) {
					var message = element.find('div.messageText')[0].innerHTML;
					if (message == "") {
						scope.errorMsg = "请输入私信内容";
					} else {
						var data = {
							sendTo: Number(scope.touserid),
							sendFrom: scope.fromuserid,
							content: element.find('div.messageText')[0].innerHTML
						};
						ApiService.post(ApiService.getApiUrl().sendMessage, {}, data,
							function(response){
								if(response.statusCode == 200){
			                    	scope.post = {showPostAlert:' success open',postStatus:'big_ok',postMsg:'发表成功'};
			                    	scope.disableBtn = true;
			                    	var timer = $timeout(function(){
										scope.closeMsgDialog();
										scope.disableBtn = false;
										scope.post = {showPostAlert:'',postStatus:'',postMsg:''};
										element.find('div.messageText')[0].innerHTML = "";
										$timeout.cancel(timer);
									},1000);
			                    } else if (response.statusCode == 403) {
			                    	$UserService.timeOutTip(element.find('.btn.btn-info.send-btn'), scope);
			                    } else{
			                    	scope.post = {showPostAlert:' error open',postStatus:'error',postMsg:'发表失败'}
			                    }
							}
						);
					}
				};
			}

			//关闭编辑框
			scope.closeMsgDialog = function(){
				scope.show = false;
			}
		}
	};
}]);