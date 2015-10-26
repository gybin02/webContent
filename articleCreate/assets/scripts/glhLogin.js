function glhLogin(opts) {
	
	        /*默认的一些配置*/
       var defaults = {
		    name: "glhLogin",
		    loginBox: $(".article-login"), //主题元素
		    mask: $(".mask"), //灰色背景
		    msgbox: $("#login-form .err"), //提示信息元素
		    isReload: true, //"是否刷新",
		    postApi: "/api/user/login"
	};
	var opt = $.extend({}, defaults, opts);

	return {
		opts: opt,
		logOut: function() {

		},
		loginStatus: function(e) {
			//获得服务器状态
			var $this = this;
			$.get("/api/user/status/get", function(response) {
				if (response.statusCode == 403) {
					console.log($this.name);
					//注销登录
					if (e) {
						$this.showLogin();
					}
				}
			});
		},
		showLogin: function() {
			//拼接html
			var loginBoxHTML = '<div class="mask"></div>';
			loginBoxHTML += '<div class="article-login">';
			loginBoxHTML += '<p><span>登录到格隆汇</span><img id="closePopup" onClick="glhLogin.hideLogin()" src="/images/secondEdition/close.png"/></p>';
			loginBoxHTML += '<form id="login-form">';
			loginBoxHTML += '<div class="user-account form-row">';
			loginBoxHTML += '	<img src="/images/secondEdition/login_01.png"/>',
			loginBoxHTML += '	<input type="text" name="account" id="account" value="" placeholder="邮箱&nbsp;/&nbsp;手机号" />',
			loginBoxHTML += '</div>';
			loginBoxHTML += '<div class="user-password form-row">';
			loginBoxHTML += '	<img src="/images/secondEdition/login_02.png"/>';
			loginBoxHTML += '	<input type="password" name="password" id="password" value="" placeholder="密码" />';
			loginBoxHTML += '</div>';
			loginBoxHTML += '<div class="pwd-wrap">';
			loginBoxHTML += '	<label><input type="checkbox" name="" id="keep-pwd" value="" />记住密码</label>';
			loginBoxHTML += '	<a href="">忘记密码？</a>';
			loginBoxHTML += '</div>'
			loginBoxHTML += '<input type="button" onClick="glhLogin.submit()" value="登录" id="submit"/>';
			loginBoxHTML += '<p class="err">登录失败，用户名或密码错误</p>';
			loginBoxHTML += '</form>';
			loginBoxHTML += '<p class="register">还没有账号？<a href="">立即注册</a></p>';
			loginBoxHTML += '</div>';
			if($(".article-login").length<1){
			$(loginBoxHTML).appendTo("body");
			}
			$(".article-login").fadeIn(0);
			$(".mask").fadeIn(0);
		},
		hideLogin: function() {
			$(".article-login").fadeOut(0);
			$(".mask").fadeOut(0);
		},
		checkData: function() {
			var userAccount = $("#account").val();
			var userPw = $("#password").val();
			//验证前判断
			if (typeof userAccount == 'undefined' || typeof userPw == 'undefined' || !userAccount || !userPw) {
				$("#login-form .err").css("visibility", "visible").html("请输入用户名或密码");
				return false;
			}else{
			   return true;	
			}
		},
		formatData: function(type) {
			userAccount = $("#account").val();
			userPw = $("#password").val();
			data = {
				"userName": userAccount,
				"password": userPw
			};
			if (type == "json") {
                data = JSON.stringify(data);
			}
			return data;
		},
		successCallback:function(events){
			
			return true;
			
		},
		submit: function(isReload, msg) {
			//验证
			if (!isReload) isReload = this.opts.isReload;
			var $this = this;
			if(!this.checkData()){
				return false;
			}
			$.ajax({
				url: $this.opts.postApi,
				type: "POST",
				data: $this.formatData("json"),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				success: function(response) {
					if (response.statusCode == 200) {
						//登录成功设置数据
						$this.hideLogin();
						window.localStorage.user = JSON.stringify(response.result);
						if (isReload) window.location.reload();
						//登录成功回调函数
						this.successCallback();
					} else {
						//验证失败
						$("#login-form .err").css("visibility", "visible").html(response.message);
					}


				},

			});
		}

	};

}
var glhLogin = new glhLogin({isReload:0});

