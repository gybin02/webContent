/*统计辅助-网站首页*/
var tongji={};
/*检测所有锚点变化*/
tongji.init=function(){
	window.onhashchange=function(){
     _hmt.push(['_trackPageview','/'+window.location.hash]);
    }
}
/*统计首页*/
tongji.homePage=function(){
	/*统计导航*/
	tongji.init();
	setTimeout(function(){
		$("#naviUl>ul>li").on("click","a",function(){
   	    $.get('tongji.html?btn='+$(this).data('btn'));
   	    _hmt.push(['_trackPageview', '/index/nav/'+$(this).data('btn')]);
         })
	/*登录注册按钮*/
	$('#noLogin').on("click",'a',function(){
		_hmt.push(['_trackPageview', '/index/'+$(this).attr('ng-click')]);
	})
	/*app下载按钮*/
	$("button.clarity-ios").on("click",function(){
		_hmt.push(['_trackPageview','/dowload-ios']);
	})
	$("button.clarity").on("click",function(){
		_hmt.push(['_trackPageview','/dowload-android']);
	})
	/*首页推荐用户*/
	$("#hot-msg-container-user a").on("click",function(){
		_hmt.push(['_trackPageview',$(this).attr('href')+'?form=index']);
	})
	/*推荐用户更多按钮*/
	$("#hot-msg-right input").on("click",function(){
		_hmt.push(['_trackPageview','#/recommendedUsers']);
	})
	/*首页推荐股票*/
	$("#hot-stock a").on("click",function(){
		_hmt.push(['_trackPageview',$(this).attr('href')+'?form=index']);
	})
	/*首页BB点击*/
	$(".bb-text").on("click",function(){
		_hmt.push(['_trackPageview','/p/'+$(this).attr('href')+'.html?from=bb']);
	})
	/*首页BB、文章、上传pdf,发布点击*/
	$(".gl-post-ul li a,.i-want-post li a").on("click",function(){
		_hmt.push(['_trackPageview','/'+$(this).attr('class')+'.html?from=index']);
	})
	/*用户个头部导航点击*/
	$(".user-button a").on("click",function(){
		_hmt.push(['_trackPageview','/'+$(this).attr('class')+'.html?from=index']);
	})
	/*一些通用跳转链接的按钮*/
	
},1000)
	
}
