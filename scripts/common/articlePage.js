var articleId = $("#article-id").val();
var articleUserId = $("#user-id").val();

(function() {
	$(function() {
			Comment.initPagination();
			articleLogin.needLogin();
			//关注状态修改
			articleLogin.followStatus(articleUserId);
			//获取帖子收藏等信息
			interactiveFunc.getArticleDetail(articleId);
		})
		//nav 效果
	$('#logged-in > ul > li').hover(function() {
		$(this).find('ul').stop().slideDown(200);
	}, function() {
		$(this).find('ul').stop().slideUp(200);
	})

	//是否弹出登录框
	$("#not-login .logging").on("click", function() {
		articleLogin.showLogin();
	})
	$(".mask, #closePopup").on("click", function() {
		articleLogin.closeLogin();
	})
	

	//提交登录验证
	$("#submit").on("click", function(e) {
		e.preventDefault();
		articleLogin.loginSubmit();
	})
	

	//文章作者链接
	$(".author-info a").attr("href", "/#/userInfo/" + articleUserId);

	//关注用户相关
	$("#follow").on("click", function() {
		if (!window.localStorage.user || need) {
			articleLogin.showLogin();
			return;
		} else {
			interactiveFunc.follow(articleUserId);
		}
	});
	$("#unfollow").on("click", function() {
		if (!window.localStorage.user || need) {
			articleLogin.showLogin();
			return;
		} else {
			interactiveFunc.unfollow(articleUserId);
		}
	});


	//帖子点赞
	$(".favorite").on("click", function() {
		if (!window.localStorage.user || need) {
			articleLogin.showLogin();
		} else {
			if ($(".favorite span").hasClass('active')) {
				interactiveFunc.cancelFavorite(articleId);
			} else {
				interactiveFunc.addFavorite(articleId);
			}
		}
	});
	//帖子收藏
	$(".collect").on("click", function() {
		if (!window.localStorage.user || need) {
			articleLogin.showLogin();
		} else {
			if ($(".collect span").hasClass('active')) {
				interactiveFunc.removeColloct(articleId);
				$("#collect-tag").css("display", "none");
			} else {
				interactiveFunc.addCollect(articleId);
				$("#collect-tag").css("display", "block");
			}
		}
	});
	//发送私信
	$("#sendmsg").on("click", function() {
		if (!window.localStorage.user || need) {
			articleLogin.showLogin();
		} else {
			var userInfo = JSON.parse(window.localStorage.user);
			$("#smg-popup i").html($("h3.author-name").text()); //取的文章作者的昵称 zhongyi
			$("#smg-popup, .mask").fadeIn(400);
			$(".mask, #closeSmg").on("click", function() {
				$("#smg-popup, .mask").fadeOut(400);
				$(".smg-content span").html("");
			})
		}
	});

	$(".smg-content button").on("click", function() {
		var smgContent = $("#short-msg").val();
		if (smgContent == "" || smgContent == undefined) {
			$(".smg-content span").show().html("私信内容为空！");
			return;
		}
		interactiveFunc.sendMsg();
	})


	//发表评论
	$("#comment-btn").on("click", function() {
		if (!window.localStorage.user || need) {
			articleLogin.showLogin();
			return;
		} else {
			commentText = $("#comment-text").val();
			Comment.commitComment(articleId, commentText);
		}
	});

	//回到顶部
	var r_t = $(".return-top");
	$(window).scroll(function() {
		if ($(window).scrollTop() > 200) {
			r_t.fadeIn(200);
		} else {
			r_t.fadeOut(600);
		}
	});

	$("#returnTop").click(function() {
		$("html, body").animate({
			scrollTop: 0
		}, 200);
	});

	$(".return-top .QR-code").hover(function() {
		$(".QR-code span").stop().fadeIn(400);
	}, function() {
		$(".QR-code span").stop().fadeOut(400);
	})

}());

//登录相关
var articleLogin = {};
//登录状态检测，是否显示登录状态栏
articleLogin.checkStatus = function() {
	if (!window.localStorage.user || need) {
		$("#not-login").css("display", "block");
		$("#logged-in").css("display", "none");
	} else {
		$("#logged-in").css("display", "block");
		$("#not-login").css("display", "none");

		//获取用户数据
		var userInfo = JSON.parse(window.localStorage.user);
		if (!userInfo.user.avatar) {

			//默认头像
			userInfo.user.avatar = "/images/avatar.png";
		} else {
			//个人头像更改
			$(".my-avatar img").attr("src", userInfo.user.avatar);
		}
		//个人设置页面跳转
		$("#setUserInfo").on("click", function() {
			if (!window.localStorage.user) {
				window.location = "/#/"
			} else {
				window.location = "/#/userUpdate/update/" + userInfo.user.userId;
			}
		});
	}
};
articleLogin.checkStatus();


//登录操作
articleLogin.loginSubmit = function() {
	var userAccount = $("#account").val();
	var userPw = $("#password").val();

	//验证前判断
	if (typeof userAccount == 'undefined' || typeof userPw == 'undefined' || !userAccount || !userPw) {
		$("#login-form .err").css("visibility", "visible").html("请输入用户名或密码");
		return;
	}

	var data = {
		"userName": userAccount,
		"password": userPw
	};
	data = JSON.stringify(data);

	$.ajax({
		type: "POST",
		data: data,
		dataType: "json",
		contentType: "application/json;charset=UTF-8",
		url: "/api/user/login",
		async: true,
		success: function(response, status) {
			//验证成功后的回调函数
			if (response.statusCode == 200) {
				$(".article-login, .mask").fadeOut(400);
				window.localStorage.user = JSON.stringify(response.result);
				articleLogin.checkStatus();
				Comment.initPagination();
				//关注状态修改
				articleLogin.followStatus(articleUserId);
				//获取帖子收藏等信息
				interactiveFunc.getArticleDetail(articleId);
				need = false;
				//解绑keyup事件
				$(document).unbind("keyup");
			} else {
				//验证失败
				$("#login-form .err").css("visibility", "visible").html(response.message);
			}

		}
	});
};

//退出登录
articleLogin.logOut = function() {
	if (window.localStorage.user) {
		window.localStorage.removeItem("user");
	}

	$.ajax({
		type: "GET",
		data: {},
		url: "/api/user/login"
	})
	location.reload();
};

//判断是否需要登录
var need = false;
articleLogin.needLogin = function() {
	/*获得服务器用户状态*/
	$.get("/api/user/status/get", function(response) {
		if (response.statusCode == 403) {
			need = true;
//			articleLogin.showLogin();
		}
	});
}

//是否显示登录窗
articleLogin.showLogin = function() {
	$(".article-login, .mask").fadeIn(400);
	//Enter键登录  Esc键关闭
    $(document).bind("keyup", function (event) {
        if (event.keyCode == 13) {
            articleLogin.loginSubmit();
        }
        if (event.keyCode == 27) {
            articleLogin.closeLogin();
        }
    });
}

articleLogin.closeLogin = function() {
	$(".article-login, .mask").fadeOut(400);
	$("#login-form .err").css("visibility", "hidden");
	$(document).unbind("keyup");
}

//获取用户关注状态
articleLogin.followStatus = function(userId) {
	if (!window.localStorage.user) return;
	$.ajax({
		type: "GET",
		url: "/api/friendships/isfollow?userIds=" + userId,
		async: false,
		success: function(response) {
			if (response.statusCode == 200) {
				var status = response.result;

				if (status[userId] == true) {
					$("#unfollow").css("display", "inline-block");
					$("#follow").css("display", "none");
				} else {
					$("#follow").css("display", "inline-block");
					$("#unfollow").css("display", "none");
				}

			} else {
				return;
			}
		}
	});
}

//帖子点赞、收藏、给作者发送私信功能 ajax
var interactiveFunc = {};
//获取文章详情
interactiveFunc.getArticleDetail = function(postId) {
	$.ajax({
		type: "GET",
		url: "/api/post/" + postId + "/info",
		success: function(response) {
			if (response.statusCode == 200) {
				if (!window.localStorage.user) return;
				var isLike = response.result.isLike;
				var isFav = response.result.isFav;
				if (isLike == true) {
					$(".favorite span").addClass("active");
				} else {
					$(".favorite span").removeClass("active");
				}
				if (isFav == true) {
					$(".collect span").addClass("active");
					$("#collect-tag").css("display", "block");
				} else {
					$(".collect span").removeClass("active");
					$("#collect-tag").css("display", "none");
				}
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
};
//添加喜欢
interactiveFunc.addFavorite = function(postId) {
	$.ajax({
		type: "POST",
		url: "/api/post/" + postId + "/like/add",
		success: function(response) {
			if (response.statusCode == 200) {
				$(".favorite span").toggleClass("active");
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
};
//取消喜欢
interactiveFunc.cancelFavorite = function(postId) {
		$.ajax({
			type: "POST",
			url: "/api/post/" + postId + "/like/delete",
			success: function(response) {
				if (response.statusCode == 200) {
					$(".favorite span").toggleClass("active");
				} else {
					//验证失败
					alert(response.message);
				}
			}
		})
	}
	//添加收藏
interactiveFunc.addCollect = function(postId) {
	$.ajax({
		type: "POST",
		url: "/api/post/" + postId + "/fav/add",
		success: function(response) {
			if (response.statusCode == 200) {
				$(".collect span").toggleClass("active");
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
};
//取消收藏
interactiveFunc.removeColloct = function(postId) {
	$.ajax({
		type: "POST",
		url: "/api/post/" + postId + "/fav/delete",
		success: function(response) {
			if (response.statusCode == 200) {
				$(".collect span").toggleClass("active");
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
};
//关注作者  
interactiveFunc.follow = function(destUserId) {
	var data = {
		"destUserId": destUserId
	};
	data = JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: "/api/friendships/follow",
		data: data,
		contentType: "application/json;charset=UTF-8",
		success: function(response) {
			if (response.statusCode == 200) {
				$("#unfollow").css("display", "inline-block");
				$("#follow").css("display", "none");
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
};

//取消关注作者  
interactiveFunc.unfollow = function(destUserId) {
	var data = {
		"destUserId": destUserId
	};
	data = JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: "/api/friendships/unfollow",
		data: data,
		contentType: "application/json;charset=UTF-8",
		success: function(response) {
			if (response.statusCode == 200) {
				$("#unfollow").css("display", "none");
				$("#follow").css("display", "inline-block");
			} else {
				//验证失败
				alert(response.message);
			}
		}
	})
};

/*分享按钮*/
$("li.share-btn").hover(function() {

	$(this).find(".share-box").show();

}, function() {

	$(this).find(".share-box").hide();


})

interactiveFunc.sendMsg = function() {
	var userId = window.localStorage.user;
	userId = JSON.parse(userId).user.userId;
	var smgContent = $("#short-msg").val();
	var msgdata = {
		"sendTo": articleUserId,
		"sendFrom": userId,
		"content": smgContent
	};
	msgdata = JSON.stringify(msgdata);
	$.ajax({
		type: "POST",
		url: "/api/message/add",
		data: msgdata,
		dataType: "json",
		contentType: "application/json;charset=UTF-8",
		success: function(response) {
			if (response.statusCode == 200) {
				$("#short-msg").val(" ");
				$(".smg-content span").empty();
				$("#seccMsg").css("display", "block").find("span").html("发送成功");
				setTimeout(function() {
					$("#seccMsg").css("display", "none");
					$("#smg-popup, .mask").fadeOut(400);
				}, 1500);
			} else {
				//验证失败
				$(".smg-content span").html(response.message);
			}
		}
	})
}

//评论帖子功能
var Comment = {
	commitComment: function(postId, commentText, replyCommentId, replyUid) {
		if (!commentText || commentText == "") {
			return;
		}
		if (!replyCommentId) {
			replyCommentId = null;
		}
		if (!replyUid) {
			replyUid = null;
		}
		//		var commentText = $("#comment-text").val()?$("#replyInput").val():$("#reply-text").val();
		var comments = {
			"content": commentText,
			"replyCommentId": replyCommentId,
			"replyUid": replyUid
		};
		comments = JSON.stringify(comments);
		$.ajax({
			type: "POST",
			data: comments,
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			url: "/api/post/" + postId + "/comment",
			async: true,
			success: function(response) {
				if (response.statusCode == 200) {
					$("#comment-text").val("");
					Comment.initPagination();
				} else {
					//提交失败
					alert(response.message);
					return;
				}
			}
		});
	},

	getComment: function(postId, page, count) {
		var pageData = {
			"page": page,
			"count": count
		};

		$.ajax({
			type: "GET",
			dataType: "json",
			data: pageData,
			url: "/api/post/" + postId + "/comment",
			async: true,
			cache: false,
			success: function(response) {
				if (response.statusCode == 200) {
					Comment.publishComment(response);

					//删除评论、操作评论
					$(".comment-content").on("click","span", function() {
						var $this = $(this);
						var commentId = $this.parents(".reader-comment").data("num");
						var replyUid = $this.parents(".reader-comment").data("uid");
						if ($this.hasClass("delete")) {
							Comment.deleteComment(commentId);
						}
						//回复别人评论
						if ($this.hasClass("reply")) {
							$this.parent().find(".replyBox").slideDown(200);
						}
						$(".replyBtn").on("click", function() {
							$(this).attr("disabled", "disabled");
							var commentText = $this.parent().find(".replyInput").val();
							Comment.commitComment(articleId, commentText, commentId, replyUid);
						})
						$(".cancle").on("click", function() {
							$(this).parent().slideUp(200);
						})
					})

				} else {
					//提交失败
					alert(response.message);
					return;
				}
			}
		});
	},

	publishComment: function(response) {
		var returnInfo = response.result;
		for (var i = returnInfo.length - 1; i >= 0; i--) {

			var commentInfo = '<div class="reader-comment" data-num="' + returnInfo[i].commentId + '" data-uid="' + returnInfo[i].userId + '"><div class="comment-info"><a href="/#/userInfo/' + returnInfo[i].userId + '"><img src="' + returnInfo[i].avatar + '"/ ></a><div class="cmt-name">' + returnInfo[i].nickname + '</div><span>' + Comment.formatTime(returnInfo[i].createDate);
			if (returnInfo[i].replyCommentId) {
				commentInfo += '回复了评论</span></div>';
			} else {
				commentInfo += '发表了评论</span></div>';
			}

			var commentContent = '<div class="comment-content"><p>' + returnInfo[i].content;
			if (!window.localStorage.user) {
				//commentContent += '</div>'; //这个标导致html结构出错 zhongyi
			} else {
				var userInfo = JSON.parse(window.localStorage.user);
				if (userInfo.user.userId == returnInfo[i].userId) {
					commentContent += '</p><span class="reply">[回复]</span> <span class="delete">[删除]</span>';
				} else {
					commentContent += '</p><span class="reply">[回复]</span>';
				}
			}
			commentContent += '<div class="replyBox"><textarea type="text" class="replyInput" value="" /></textarea><div class="cancle">取消</div><button class="submit-btn replyBtn"  type="button">回复评论</button></div><div class="clearfix"></div></div>'
			var replyComment;
			if (returnInfo[i].replyCommentId) {
				replyComment = '<dl class="comment-intrct"><dt>' + returnInfo[i].replyNickname + '：</dt><dd>' + returnInfo[i].replyComment + '</dd></dl>';
			} else {
				replyComment = " ";
			}

			$("#comment-area").prepend(commentInfo + commentContent + replyComment);
		}
		/*加入连接*/
		addCommentLink();
	},

	deleteComment: function(commentId) {
		$.ajax({
			type: "POST",
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			url: "/api/post/comment/" + commentId + "/delete",
			async: false,
			cache: false,
			success: function(response) {
				if (response.statusCode == 200) {
					Comment.initPagination();

					//					location.reload();

				} else {
					//提交失败
					alert(response.message);
					return;
				}
			}
		});
	},

	initPagination: function() {
		$.ajax({
			type: "GET",
			url: "/api/post/" + articleId + "/comment",
			async: true,
			cache: false,
			contentType: "application/json;charset=UTF-8",
			success: function(response) {
				if (response.statusCode == 200) {
					Comment.publishComment(response);
					var num_entries = response.totalCount;
					console.log(num_entries);
					// 创建分页
					$("#pagination").pagination(num_entries, {
						num_edge_entries: 1, //边缘页数
						num_display_entries: 5, //主体页数
						callback: Comment.pageselectCallback,
						items_per_page: 15, //每页显示1项
						prev_text: "<",
						next_text: ">",
						prev_show_always: false,
						next_show_always: false
					});
                  
				} else {
					//提交失败
					alert(response.message);
					return;
				}
			}
		});
	},

	pageselectCallback: function(page_index, jq) {
		var newPageIndex = page_index + 1;
		$("#comment-area").empty();
		Comment.getComment(articleId, newPageIndex, 15);
		return false;
	},

	//格式化时间
	formatTime: function(publishTime) {
		var date = new Date();
		var tmpTime = publishTime * 1000;
		var time = Math.floor(date.getTime() / 1000);
		var publishTime = time - publishTime;
		if (publishTime < 60) {
			return "刚刚";
		} else if (60 <= publishTime && publishTime < 60 * 60) {
			return Math.floor(publishTime / 60) + "分钟前";
		} else if (publishTime >= 60 * 60 && publishTime < 24 * 60 * 60) {
			return Math.floor(publishTime / 3600) + "小时前";
		} else if (publishTime >= 24 * 60 * 60 && publishTime < 10 * 24 * 60 * 60) {
			return Math.floor(publishTime / 86400) + "天前";
		} else {
			var resultDate = new Date(tmpTime);
			var year = resultDate.getFullYear();
			var month = resultDate.getMonth();
			month += 1;
			var day = resultDate.getDate();
			return year + "年" + month + "月" + day + "日";
		}
	}

}


/*前段加上股票和用户的链接*/
function addLink(text,target) {
		if (text == null) {
			return text;
		}
		//var uReg=/@[^\s]+\s?/;
		//匹配开头已@结尾是空格或者冒号 远端原则
		//var uReg = /@\S+?\s|@\S+?\s|@\S+?:/
		var uReg = /@([^(|:| |<|@|&)]*)(|:| |<|@|&)/g;
		//var uReg = /@(.*?)(@| |:|<)/g
		var uRegLen = 0;

		var regText = text;
		do {
			var uArr = uReg.exec(regText);
			uRegLen = uArr == null ? 0 : uArr.length;
			if (uArr != null && uArr.length > 0) {
				for (var i = 0; i < uArr.length; i++) {
					if (uArr[i].indexOf("@") >= 0 && uArr[i].length > 1) {
						var nick = uArr[i].substring(1, uArr[i].length);
						var uHtml = '<a class="user-popover" href="javascript:userPopover.openUser();" user-Nick="' + nick + '">' + uArr[i] + '</a>';
						text = text.replace(new RegExp(uArr[i], 'gm'), uHtml);
					}
				}
			}
		} while (uRegLen > 0)


		//匹配以$开头,$+空格结尾的字符
		var sReg = /\$(.*?)\((.*?)\)\$/g;
		var sRegLen = 0;
		var regSText = text;
		do {
			var sArr = sReg.exec(regSText);
			sRegLen = sArr == null ? 0 : sArr.length;
			if (sArr != null && sArr.length >= 3) {
				if (sArr[0].indexOf("$") >= 0 && sArr[0].indexOf("(") >= 0 && sArr[0].indexOf(")") >= 0 && sArr[0].length > 3 && sArr[1].length > 0 && sArr[2].length > 0) {
					//提取股票代码
					sArrNew = sArr[2].replace(')', '\\)').replace('(', '\\(');
					dReg = /[a-zA-Z.0-9]+|[0-9]+/;
					stockCode = dReg.exec(sArrNew);
					var replaceTarget = '\\$' + sArr[1] + '\\(' + sArrNew + '\\)\\$';
					var sHtml = '<a href="/#/stockDetail/' + stockCode + '" target="flag">' + sArr[0] + '</a>';
					//var replaceTarget = sArr[2].replace("(", "/(").replace(")", "/)");
					text = text.replace(new RegExp(replaceTarget, 'gm'), sHtml);
				}
			}
		} while (sRegLen > 0)
		target.html(text);
		//return text;
	}
	/*开始加入文章中的股票与用户链接*/
$(document).ready(function() {
	     setTimeout(function(){
	      var content = $(".main-content").html();
		  addLink(content,$(".main-content"));
	     },1000);
		addCommentLink();
	})

function addCommentLink(){
	setTimeout(function(){
	   $(".comment-content").each(function(index){
		     addLink($(this).html(),$(this));
	   })
	},500);
}

	/*@股票和用户*/
var n = new Mention({
	textInput: $("#comment-text"),
	items: [],
	symbols: ["@", "$"],
	config: [{
			items: "",
			url: "/api/post/lastCalls?key=",
			title: "想要用@提到谁？",
			name: "userNick",
			pinyin: "",
			attach: "",
			symbol: "@",
			type: ""


		}, {
			items: "",
			url: "/api/search/stock?keyword=",
			title: "搜索股票",
			name: "stockName",
			pinyin: "stockCode",
			attach: "$",
			symbol: "$",
			type: "type"
		}

	]

});

n._init();
function atUser(symbol){
	if(symbol=="$"){
		n.module=1;
	} else{
		n.module=0;
	}
	insertAtCursor(document.getElementById("comment-text"),symbol);
	n.showSearchBox(document.getElementById("comment-text"),symbol);
	n.active=true;
}

$(document).keydown(function(e) {

	if (e.keyCode == 8) {
		if ($("#user-keywords").val().length == 0 && $("#user-search-box").css("display")!="none") {
			$("#user-search-box").hide();
			$("#comment-text").focus();
		}
	}

})