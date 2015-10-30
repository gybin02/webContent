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
		logout: function() {
			var $this = this;
			            $("#noLogin").removeClass("ng-hide");
						$("#loginStatus-auto").addClass("ng-hide");
						//$(".article-img-circle").attr("src",response.result.user.avatar);
						window.localStorage.removeItem("user");
						window.location='/#/';
			$.get("/api/user/logout", function(response) {
				if (response.statusCode == 200) {
					   /*为了增强用户体验，先取消状态，再向送服务端发送数据*/
				}
			});

		},
		
		loginStatus: function() {
			/*获得服务器用户状态*/
			var $this = this;
			return $.get("/api/user/status/get", function(response) {
				if (response.statusCode == 403) {
					$this.showLogin();
			     }else{
			     	return response;
			     }
			});
		},
		needLogin: function(e) {
			/*获得服务器用户状态*/
			var $this = this;
			$.get("/api/user/status/get", function(response) {
				if (response.statusCode == 403) {
					console.log($this.name);
					//注销登录
					
						$this.showLogin();
					
				}
			});
		},
		showLogin: function(callBack) {
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
			loginBoxHTML += '	<a  onclick="glhLogin.hideLogin()"; href="/#/updatePwd">忘记密码？</a>';
			loginBoxHTML += '</div>'
			loginBoxHTML += '<input  type="button" onClick="glhLogin.submit()" value="登录" class="submit" id="glhLogin-submit"/>';
			loginBoxHTML += '<p class="err">登录失败，用户名或密码错误</p>';
			loginBoxHTML += '</form>';
			loginBoxHTML += '<p onclick="glhLogin.hideLogin()" class="register">还没有账号？<a href="/#/register">立即注册</a></p>';
			loginBoxHTML += '</div>';
			if($(".article-login").length<1){
			$(loginBoxHTML).appendTo("body");
			}
			$(".article-login").fadeIn(300);
			$(".mask").fadeIn(300);
			/*设置下一步操作*/
			if(callBack){
				this.successCallback=callBack;
			}
		},
		hideLogin: function() {
			$(".article-login").fadeOut(100);
			$(".mask").fadeOut(100);
			$("#glhLogin-submit").removeAttr("disabled"); 
			$("#glhLogin-submit").val("登录");
			$("#login-form .err").css({"visibility":"visible","color":"red"}).html("");
		},
		checkData: function() {
			var userAccount = $("#account").val();
			var userPw = $("#password").val();
			//验证前判断
			if (typeof userAccount == 'undefined' || typeof userPw == 'undefined' || !userAccount || !userPw) {
				this.loginError("请输入用户名或密码");
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
		submit: function(isReload, msg) {
			//验证
			if (!isReload) isReload = this.opts.isReload;
			var $this = this;
			if(!this.checkData()){
				return false;
			}
			var $this = this;
			$.ajax({
				url: $this.opts.postApi,
				type: "POST",
				data: $this.formatData("json"),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				beforeSend:function(){
					//禁用按钮点击事件
					$("#glhLogin-submit").attr("disabled", 'disabled'); 
					$("#glhLogin-submit").val("登录中...");
				},
				success: function(response) {
					if (response.statusCode == 200) {
			            $this.loginSuccess(response);
					 } else {
						//验证失败
						$this.loginError(response.message);
					}


				},

			});
		},
		successCallback:function(){
			return true;
		},
		loginError:function(msg){
	    	
	    	 $("#login-form .err").css("visibility", "visible").html(msg);
	    	 $("#glhLogin-submit").removeAttr("disabled"); 
			 $("#glhLogin-submit").val("登录");
	    	
	   },
		loginSuccess:function(response){
			           $this=this;
			          $("#login-form .err").css({"visibility":"visible","color":"green"}).html("登录成功");
						setTimeout(function(){
							/*显示头部dom*/
						$("#noLogin").addClass("ng-hide");
						$(".noLogin-big").addClass("ng-hide");
						$("#loginStatus-auto").removeClass("ng-hide");
						$("#loginStatus").removeClass("ng-hide");
						$(".gl-user a .article-img-circle").attr("src",response.result.user.avatar);
						
						window.localStorage.user = JSON.stringify(response.result);
						/*延迟操作给用户看到成功状态*/
						    $this.hideLogin();
							$this.successCallback();
				},1e3)
			
		}
	    

	};

}
var glhLogin = new glhLogin({isReload:0});
