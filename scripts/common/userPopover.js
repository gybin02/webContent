	
var userPopover = {};
userPopover.getUserInfo = function() {
	var userId;
	$(".reader-comment").hover(function() {
		userId = $(this).data("uid");
		console.log(userId);
	})
};
userPopover.active=0;
userPopover.userId=0;
userPopover.publishInfo = function(data) {
	user=data.user;
	user.sex=user.sex=="M"? "男":"女";
	var userInfoTemplate = '<div class="popover-container">'
	+ '<div class="user-info">'
	+ '<span><img src="'+user.avatar+'"/></span>'
	+ '<div class="info-box">'
	+ '<p class="name">'+user.nickname+'</p>'
	+ '<img src="/images/man.png" alt="" /><span class="gender">'+user.sex+'</span><span class="address">'+data.address+'</span>'
	+ '<p>关注<span class="followNum">'+data.followNum+'</span> 讨论<span class="postNum">'+data.postNum+'</span> 粉丝<span class="fanNum">'+data.fanNum+'</span></p>'
	+ '</div>'
	+ '</div>'
	+ '<p class="brief">个人简介：<span>'+data.clsName+'</span></p>'
	+ '<div id="interactive">';
	if(data.isFollow==0){
	userInfoTemplate+='<span style="cursor: pointer;" onclick="userPopover.follow('+user.userId+')" id="userFollow">+ 加关注</span>';
	userInfoTemplate+='<span style="cursor: pointer;display:none" onclick="userPopover.unfollow('+user.userId+')" id="userUnfollow">取消关注</span>';
	}else{
	userInfoTemplate+='<span style="cursor: pointer; display:none" onclick="userPopover.follow('+user.userId+')" id="userFollow">+ 加关注</span>';
	userInfoTemplate+='<span style="cursor: pointer;" onclick="userPopover.unfollow('+user.userId+')" id="userUnfollow">取消关注</span>';
	}
	userInfoTemplate+='</div>';
	userInfoTemplate+='</div>';
	
	return userInfoTemplate;
}

/*取消关注*/
userPopover.unfollow=function(userId){
	
	var data = {
		"destUserId": userId
	};
	
	$("#userUnfollow").css("display", "none");
	$("#userFollow").css("display", "inline-block");
	data = JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: "/api/friendships/unfollow",
		data: data,
		contentType: "application/json;charset=UTF-8",
		success: function(response) {
			if (response.statusCode == 200) {
				
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
}
/*加关注*/
userPopover.follow=function(userId){
	
	var data = {
		"destUserId": userId
	};
	$("#userUnfollow").css("display", "inline-block");
	$("#userFollow").css("display", "none");
	data = JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: "/api/friendships/follow",
		data: data,
		contentType: "application/json;charset=UTF-8",
		success: function(response) {
			if (response.statusCode == 200) {
	
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
}



userPopover.openUser=function(){
	
	window.location='/#/userInfo/'+userPopover.userId;
	
}


userPopover.getUserInfo=function(target){
	     
	    $.ajax({
	    	url:"/api/user/get?userId=&nick="+encodeURIComponent(target.attr('user-Nick')),
	    	type:"get",
	    	cache:true,
	    	beforeSend:function(){
	    		
	    	},
	    	success:function(result){
	    		if(result.statusCode==417) return false;
	    		userPopoverHtml=userPopover.publishInfo(result.result);
	    		userPopover.userId=result.result.user.userId;
	    		$(userPopoverHtml).appendTo($("body"));
	    		$(".popover-container").css({
	 	 top:target.offset().top-210,
	 	left:target.offset().left
	     });
	    $(".popover-container").show();
	    		
	    	}
	    })
	
}

userPopover._show=function(target){
	  
	  $(".popover-container").css({
	 	 top:target.offset().top-220,
	 	left:target.offset().left
	});
	$(".popover-container").show();
}


$(document).on("mouseenter","a.user-popover",function(){
	userPopover.getUserInfo($(this));
	
 })

$(document).on("mouseenter",".popover-container",function(){
	userPopover.active=1;
})
$(document).on("mouseleave",".popover-container",function(){
	$(".popover-container").remove();
	userPopover.active=0;
})


$(document).on("mouseleave","a.user-popover",function(){
	setTimeout(function(){
		if(userPopover.active==0){
		$(".popover-container").remove();
		}
	},100)
	
  
 })







