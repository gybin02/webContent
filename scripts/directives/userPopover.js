/**
 * 用户提示框
 * Created by vincent.chang on 4/28/2015.
 */
GLHApp.directive('userPopover', ['ApiService', 'CommService', '$compile','$location', '$UserService', function (ApiService, CommService, $compile,$location, $UserService) {
    var itemsTemplate = '<div class="popover-container" style="height:161px;"><div ng-if="!isExist" class="not-exist">用户不存在.</div><div ng-if="isExist">'
        + '<div class="base-info">'
        + '<div class="pull-left left-avatar"><img ng-src="{{userInfo.user.avatar}}" class="header avatar"></div>'
        + '<div class="pull-left right-info">'
        + ' <div class="row-data"><a class="nick" ng-click="openUser()" ng-bind="userInfo.user.nickname"></a></div>'
        + ' <div class="row-data"><img ng-src="{{userInfo.user.sexIcon}}"  style="height:14px;width:14px;float:left"><span style="margin-left: 8px" ng-bind="userInfo.user.sexName"></span><span style="margin-left: 30px" ng-bind="userInfo.address"></span></div>'
        + ' <div class="row-data total">'
        + '  <span>关注</span><a ng-bind="userInfo.followNum"></a>'
        + '  <span>讨论</span><a ng-bind="userInfo.postNum"></a>'
        + ' <span>粉丝</span><a ng-bind="userInfo.fanNum"></a></div>'
        + '</div>'
        + ' <div class="clearfix"></div></div>'
        + '  <div class="brief" ng-bind="userInfo.user.userBrief"></div>'
        + '    <div class="action-bar"><div class="pull-right" ng-show="showAttention">'
        + '<a ng-if="userInfo.isFollow!=1" ng-click="followUser(userInfo.user.userId)">＋&nbsp加关注</a>'
        + '<a ng-if="userInfo.isFollow==1" ng-click="unfollowUser(userInfo.user.userId)">Ⅹ&nbsp取消关注</a>'
        + '<a href="" ng-click="openAtDialog(this)">@他</a></div><div class="clearfix"></div></div>'
        + '  </div></div>';
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            userNick: "@",
            userInfo: "@",
            isExist: "@"
        },
        template: "<a ng-transclude='' class='nick' ng-click='openUser()'></a>",
       // template: "<a ng-transclude='' class='nick'></a>",
        link: function (scope, element, attrs) {
            scope.isExist = true;
            scope.userNick = attrs.userNick;
            var popOverContent = $compile(itemsTemplate)(scope);
            var options = {
                content: popOverContent,
                placement: "top",
                trigger: "click",//"manual",
                html: true,
                animation: false
            };

            $(element).popover(options).on("mouseenter", function () {
                var _this = this;
                //获取用户信息
                ApiService.get(ApiService.getApiUrl().getUserBaseInfo, {userId: "", nick: encodeURIComponent(scope.userNick)}, function (response) {
                    if(response.result==null){
                        scope.isExist = false;
                        return;
                    }
                    scope.userInfo = response.result;
                    //设置默认头像
                    if (!scope.userInfo.user.avatar) {
                        scope.userInfo.user.avatar = "images/avatar.png";
                    }
                    scope.userInfo.user.sexName = scope.userInfo.user.sex == "F" ? "女" : "男" ;
                    scope.userInfo.user.sexIcon = scope.userInfo.user.sex == "F" ? "images/female.png" : "images/man.png";
                    var localSession = $UserService.getUser();
                    if(localSession && localSession.user){
                		if(scope.userInfo.user.userId == localSession.user.userId){
                			scope.showAttention = false;
                		}else{
                			scope.showAttention = true;
                		}
                    }
                }, function (response) {
                    scope.isExist = false;
                });
                var _thisOffsetTop = $(this).offset().top;                
                $(this).popover("show");
                if(_thisOffsetTop < 165){
                	if($(".popover").hasClass('top')){
                		$(".popover").removeClass('top').addClass('bottom').css({"top":_thisOffsetTop+21});
                	}
                }
                $(".popover").on("mouseleave", function () {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function () {
                var _this = this;
                setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide");
                    }
                }, 100);
            });

            //关注用户
            scope.followUser = function (userId) {
                var data = {destUserId: userId};
                ApiService.put(ApiService.getApiUrl().followUser, {}, data,
                    function (response) {
                        scope.userInfo.isFollow = 1;
                        scope.$emit('followAction',{userInfo:scope.userInfo});
                    }
                );

            }
            
            //@他
            scope.openAtDialog = function(_this){
    			scope.$emit('atUser', {nickName: scope.userInfo.user.nickname});
    			if ($(".popover:hover").length) {
    				$(".popover:hover").popover("hide");
                }
    		}
            //取消关注用户
            scope.unfollowUser = function (userId) {
                var data = {destUserId: userId};
                ApiService.put(ApiService.getApiUrl().unfollowUser, {}, data,
                    function (response) {
                        scope.userInfo.isFollow = 0;
                        scope.$emit('unfollowAction',{userInfo:scope.userInfo});
                    }
                );
            }

            //打开用户详情页
            scope.openUser = function () {
//                ApiService.get(ApiService.getApiUrl().getUserBaseInfo, {userId: "", nick: scope.userNick}, function (response) {
//                }, function (response) {
//                    scope.isExist = false;
//                });
                if(scope.isExist){
                    $location.path("/userInfo/"+scope.userInfo.user.userId);
                }else{
                    $location.path("/searchUser/"+scope.userNick);
                }
            }
        }
    }
}]);