	
var funcWrap = {};
funcWrap.getUserInfo = function() {
	var userId;
	$(".reader-comment").hover(function() {
		userId = $(this).data("uid");
		console.log(userId);
	})
};

funcWrap.publishInfo = function() {
	var userInfoTemplate = '<div class="popover-container">'
	+ '<div class="user-info">'
	+ '<span><img src="http://img2.gelonghui.com/images/cms20150914102137277.jpg"/></span>'
	+ '<div class="info-box">'
	+ '<p class="name">格隆</p>'
	+ '<img src="man.png" alt="" /><span class="gender">男</span><span class="address">广东深圳</span>'
	+ '<p>关注<span class="followNum">36</span> 讨论<span class="postNum">17</span> 粉丝<span class="fanNum">76</span></p>'
	+ '</div>'
	+ '</div>'
	+ '<p class="brief">个人简介：<span>什么都懂点儿</span></p>'
	+ '<div id="interactive">'
	+ '<span id="userFollow">+ 加关注</span>' 
	+ '<span id="userUnfollow">取消关注</span>'
	+ '</div>'
	+ '</div>';
	
	$(".reader-comment .reader-info").html(userInfoTemplate);
}
