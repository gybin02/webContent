/**
 * Created by Administrator on 2015/3/24.
 */

GLHApp.controller('appController', ['$scope', '$root$scope', '$http', '$location', '$routeParams', '$MainService', '$UserService', 'CommService','ApiService','$interval','StockService','$anchorScroll',
    function ($scope, $root$scope, $http, $location, $routeParams, $MainService, $UserService, CommService,ApiService,$interval,StockService,$anchorScroll) {
        $scope.hotCurrentPage = 1;
        $scope.appSpreadFlag = false;
        $scope.columnCode = "all";
        $scope.navShow = true;
        $scope.isLogin = false;
        $scope.needLoginShow = true;
        $scope.loginedUser = {};
        //点击头部登录按钮登录后是否跳转到用户主页
        $scope.isNeedUserHome = false;        
        $root$scope.result = {};
    	$scope.result = $root$scope.result;
    	
    	$scope.mobileFlag = true;
    	  
    	CommService.asyncUnreadMsg();
        $interval(function(){
        	CommService.asyncUnreadMsg();
        },5*60*1000);
        //分辨率是768以下，导航栏高度重新设置
//        if (screen.height <= 768) {
//            $scope.headerHeight = {'height': '50px', 'line-height': '50px'};
//            $scope.bannerMargin = {'margin-top': '70px'};
//            $scope.bannerTop = {'top': '70px'};
//            $scope.menuHeight = {'height': '50px', 'line-height': '50px'};
//        } else {
//            $scope.headerHeight = {'height': '66px', 'line-height': '66px'};
//            $scope.bannerMargin = {'margin-top': '66px'};
//            $scope.bannerTop = {'top': '66px'};
//            $scope.menuHeight = {'height': '88px', 'line-height': '88px'};
//        }

        //初始化弹出框
        $(function () {
            $('[data-toggle="popover"]').popover()
        })

        //已登录
        if ($UserService.isLoggedIn()) {
            $scope.isLogin = true;
            $scope.loginedUser = $UserService.getUser();
        }

        // 同步调用，获得承诺接口
        var promise = $MainService.getColumns();
        promise.then(function (data) {
            // 调用承诺API获取数据 .resolve
        	//用于存放要显示的导航菜单
        	var arrayNav = new Array();
        	for(var i=0;i<data.result.length;i++){
        		//状态为1才显示，0不显示
        		if(data.result[i].status==1){
        			arrayNav.push(data.result[i]);
        		}
        	}
            $scope.navColumns = arrayNav;
        }, function (data) {
            // 处理错误 .reject
        });

        $scope.footerLinks = $MainService.footerLinks;

        //登录
        $scope.login = function () {
            //点击登录按钮登录需要切换Url到我的首页
            console.info("login--");
            $scope.$broadcast('openLoginModal', {needChangeUrl: $scope.isNeedUserHome, needReturnHome: false});
        };

        //退出
        $scope.exit = function () {
            $scope.isLogin = false;
            $scope.$broadcast('executeExit', {});
        };

        //注册
        $scope.register = function () {
            location.href = '/#/register';
        };
        
        //判断是不是移动端
        /**
         * 判断用户是否通过手机浏览器访问，
         * 通过userAgent 判断终端类型(android,ios)
         * 跳转到对应的APP下载地址
         */
        $scope.browser={
    	    versions:function(){ 
    	    	var u = navigator.userAgent.toLowerCase();
    	           return {//移动终端浏览器版本信息 
    	                trident: u.indexOf('trident') > -1, 							//IE内核
    	                presto: u.indexOf('presto') > -1, 								//opera内核
    	                webKit: u.indexOf('applewebkit') > -1, 							//苹果、谷歌内核
    	                gecko: u.indexOf('gecko') > -1 && u.indexOf('khtml') == -1, 	//火狐内核
    	                ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), 				//ios终端
    	                android: u.indexOf('android') > -1 || u.indexOf('linux') > -1, 	//android终端或者uc浏览器
    	                iPhone: u.indexOf('iphone') > -1,   							//是否为iPhone
    	                iMac:u.indexOf('mac') > -1,										//是否为imac
    	                iPad: u.indexOf('ipad') > -1, 									//是否iPad
    	                IOsweb: u.indexOf('safari') == -1 								//是否web应该程序，没有头部与底部
    	            };
    	         }(),
    	         language:(navigator.browserLanguage || navigator.language).toLowerCase()
        };
 
        /*手机端跳转到另外的页面*/
        /*if($scope.browser.versions.android||$scope.browser.versions.iPhone){
        	window.location.href="http://localhost:8080/appIndex.html";
        }*/
        
        
        //点击导航下载APPP
        $scope.downloadAppLink = function(){
            // 判断是否是为Android iOS移动端，跳转到应用宝APP下载地址
            var theUrl = 'http://www.gelonghui.com';
            if($scope.browser.versions.android||$scope.browser.versions.iPad ||$scope.browser.versions.iPhone){
                theUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.gelonghui.glhapp';
            }
            location.href = theUrl;
        }
            	
        //点击 X 关闭APP下载提示
        $scope.hideHover = function(){
        	$scope.mobileFlag = false;
        }
        
        
        $scope.appLink = function(){
    
        }
        
        if($scope.browser.versions.android || $scope.browser.versions.iPad || $scope.browser.versions.iPhone){
        	$scope.mobileFlag = true;
        }else{
        	$scope.mobileFlag = false;
        }
        
        //Note that the $routeParams are only updated after a route change completes successfully.
        //This means that you cannot rely on $routeParams being correct in route resolve functions.
        $root$scope.$on('$routeChangeSuccess', function (evt, next, current) {
            if ($routeParams.topicCode) {
                $scope.columnCode = $routeParams.topicCode;
            } else {
                $scope.columnCode = "";
            }

            var urlPath = $location.path();

            if (urlPath.indexOf("/articleDetail") < 0) {
                $root$scope.title = "格隆汇--港股那点事";
            }
        });



        $root$scope.$on('$routeChangeStart', function (evt, next, current) {
            var urlPath = $location.path();

            if (urlPath == "/" || urlPath.indexOf("/activeEmail") >= 0 || urlPath.indexOf("/register") >= 0) {
                $scope.isNeedUserHome = true;
            } else {
                $scope.isNeedUserHome = false;
            }

            //页面不是在栏目间切换，清空栏目选中项
            if (urlPath.indexOf('/topic') < 0) {
                $scope.topicCode = ""
                	
            }

            if (urlPath == '/' || urlPath.indexOf('/topic') >= 0 || urlPath.indexOf('/articleDetail') >= 0) {
                $scope.navShow = true;
//                //分辨率是768以下，导航栏高度重新设置
//                if (screen.height <= 768) {
//                    $scope.viewTop = {margin: '68px 0px 0px 0px'};
//                } else {
//                    $scope.viewTop = {margin: '110px 0px 0px 0px'};
//                }
            }
            else {
                $scope.navShow = false;
//                if (screen.height <= 768) {
//                    $scope.viewTop = {margin: '70px 0px 0px 0px'};
//                } else {
//                    $scope.viewTop = {margin: '88px 0px 0px 0px'};
//                }
            }

            //屏幕宽度小于768
            if (screen.width < 768) {
                //顶部导航栏隐藏
                $scope.navShow = false;
//                if (screen.height <= 768) {
//                    $scope.viewTop = {margin: '70px 0px 0px 0px'};
//                } else {
//                    $scope.viewTop = {margin: '88px 0px 0px 0px'};
//                }
            }

            //邮箱激活的情况下、用户注册、完善用户资料的情况下情况原有客户端登录信息
            if (urlPath.indexOf("/activeEmail") >= 0 || urlPath.indexOf("/register") >= 0
                || (urlPath.indexOf("/userUpdate") >= 0 && ($routeParams.type == "email" || $routeParams.type == "phone"))) {
                $scope.isLogin = false;
                $scope.needLoginShow = false;
                //$UserService.logOut();
            } else {
                $scope.needLoginShow = true;
            }

        });


        
        
        /*栏目详情页*/
        //分页初始化
	    $scope.topicPaginationConf = {
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
	        onChange: function(){
	            $scope.getArticleDatas(this.currentPageNum);
	        }
	    }

        $scope.getArticleDatas = function (page) {
	    	$scope.topicPaginationConf.currentPageNum = page || $scope.topicPaginationConf.currentPageNum;
        	var articleCode =$scope.columnCode/* $routeParams.topicCode*/;
            var params = {columnCode: $scope.columnCode, limit: 2, page: page};
            ApiService.get(ApiService.getApiUrl().getArticleList, params, function (response) {
                    $scope.topicList = [];
                    $scope.columnName = response.result.columnName;
                    var results = response.result.articleList;
                    for (var i in results) {
                        var article = results[i];
                        CommService.formatPubTime(article, article.publishTime);
                        $scope.topicList.push({
                            id: article.articleId,
                            postId: article.postId,
                            imgSrc: article.picturePath,
                            title: article.articleTitle.slice(0,30),
                            content: article.articleSummary.slice(0,52)+"...",
                            author: article.author,
                            authorType:article.authorType,
                            latestTime: article.publishTimeLoc,
                            discussCount: article.commentCount,
                            praiseCount: article.likeCount,
                            userId:article.userId,
                            readCount:article.readCount,
                            authorAvatar:article.authorAvatar
                        });
                    }
                    $scope.topicPaginationConf.totalItems = response.totalCount;
                    $scope.topicPaginationConf.currentCounts = results.length;
                    $scope.isLoaded = true;
                },
                function (response) {
                    $scope.isLoaded = true;
                    if(response.statusCode==406 || response.statusCode==417){
                        DialogService.launch("error",response.message);
                    }
                }
            );
        }

        $scope.getArticleDatas(1);

        //周热读
        $scope.weekList = [];
        var hotRead = function(page){
            ApiService.get(ApiService.getApiUrl().hotViewBeta, {page: page, count: 5}, function (response) {
                $scope.weekList=response.result;
                for (var i in $scope.weekList) {
                    CommService.formatPubTime($scope.weekList[i], $scope.weekList[i].createDate);
                }
                console.info($scope.weekList);
            });
        }
        hotRead(1);


        //推荐用户
        $scope.recommendUserList = [];
        ApiService.get(ApiService.getApiUrl().recommendUser, {page: 1, count: 12}, function (response) {
            $scope.recommendUserList=response.result;
        });

        //热门股票
        $scope.hotStockList = [];
        ApiService.get(ApiService.getApiUrl().hotStockList, {page: 1, count: 6}, function (response) {
            $scope.hotStockList = response.result;
            $scope.hsList = [];
            var stockCode = "";
             
            for(var i in $scope.hotStockList){
                stockCode = $scope.hotStockList[i].stockType+$scope.hotStockList[i].stockCode;
                ApiService.get(ApiService.getApiUrl().stockDetail, {stocks: stockCode, details: false}, function (response) {

                    $scope.hsList.push({    
                        stockName: response.result[0].name,
                        stockType:response.result[0].type,
                        stockCode:response.result[0].code,
                        price: response.result[0].price,
                        change: response.result[0].change,
                        netChange: response.result[0].netChange
                    });
                	/*console.info(i+"---"+response.result[0].price);
                	$scope.hotStockList[i].price = response.result[0].price;*/

                });
                
            }

            //console.info("it is weird"+$scope.hsList);
            //console.info(" $scope.hotStockList--"+ $scope.hotStockList[0].stockName);

        });

        /*各种onclick事件*/

        $scope.getArticleDetail = function (postId) {
            $location.path("/articleDetail/" + postId);
        }

        //打开用户详情
        $scope.openUser=function(userId){
            $location.path("/userInfo/"+userId);
        }

        //打开用户详情beta版本
        $scope.openUserBeta = function(userId){
            location.href="/#/userInfo/"+userId;
        }


        //跳转app
        $scope.appDownload=function(){
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.gelonghui.glhapp';
        }

        //长文编辑器
        $scope.showTextEditor = function () {
          //$scope.$broadcast('showMaskTextEditor');
            /*加载最新页面*/
            window.location="/articleCreate/;
        }

        // 显示PDF上传
        $scope.showUploadPdf = function () {
            $scope.$broadcast('showMaskUploadPdf');
        }

        // 显示短文发帖
        $scope.showShortMsg = function () {
            console.info("invole shortMsg");
            $scope.$broadcast('showMaskShortMsg');
        }

        //个人设置
        $scope.updateInfo = function () {
            if($scope.loginedUser.user==undefined){
                var url = "http://"+$location.host()+":"+$location.port()+"/#/userUpdate/update/7552";
                location.href=url;
                console.info("please login!");
            }else{
                var url = "http://"+$location.host()+":"+$location.port()+"/#/userUpdate/update/" + $scope.loginedUser.user.userId;
                location.href=url;
            }
        };

        //话题导航
        $scope.topicClick = function (columnCode, columnName) {
            $scope.columnCode = columnCode;
            $location.path("/topic/" + columnCode);
        };

        //点击更多热点话题或者港股的时候展示
        $scope.$on("moreArticles", function (event, data) {
            $scope.columnCode = data;
        });

        //登录成功通知主Controller
        $scope.$on("loginSuccess", function (event, options) {
            $scope.isLogin = true;
            $scope.loginedUser = $UserService.getUser();
            $scope.$broadcast("initAfterLogin", options);
        });

        //需要登录通知
        $scope.$on("needLogin", function (event, options) {
            $scope.isLogin = false;
            $scope.$broadcast('openLoginModal', options);
        });

        $scope.userTabChanged = function(currentTab){
            location.href="/#/" + currentTab;
        }
        $scope.$on("userTabChanged", function (event, currentTab) {
            $location.path("/" + currentTab);
        });

        $scope.$on("userLogout", function (event, currentTab) {
            $scope.isLogin = false;
            $scope.$broadcast('executeExit', {});
        });

        //用户资料修改监听
        $scope.$on("userChangeInfo", function (event, options) {
            $scope.loginedUser = $UserService.getUser();
            //$scope.$broadcast('executeUserChange', {});
        });

        $scope.chooseColumn = function(data){
            $scope.columnCode = data;
            console.info("$scope.columnCode :: "+$scope.columnCode);
            $scope.topicPaginationConf.currentPageNum = 1;
            $scope.getArticleDatas($scope.topicPaginationConf.currentPageNum);
           // $scope.getArticleDatas(this.currentPageNum);
        };

        $scope.chooseAppColumn = function(data){
            $scope.columnCode = data;
            $scope.appSpreadFlag = $scope.appSpreadFlag==true?false:true;
            console.info("$scope.columnCode :: "+$scope.columnCode);
            $scope.topicPaginationConf.currentPageNum = 1;
            $scope.getArticleDatas($scope.topicPaginationConf.currentPageNum);
           // $scope.getArticleDatas(this.currentPageNum);
        };

        //添加自选股
        $scope.addUserStock = function (code,type) {
            console.info("add user stock:"+code+"-"+type);
            StockService.addUserStock(code, type, $scope, $("#stock_hot_span_click"));
        };

        //热度换页
        $scope.hotPage = function(page){
            $scope.hotCurrentPage = page;
            console.info($scope.hotCurrentPage);
            hotRead(page);

        }

        //判断是否热度当前页
        $scope.ifBlue = function(page){
            return page == $scope.hotCurrentPage;
        }

        //小页面是否显示
        $scope.appSpread = function(){
            $scope.appSpreadFlag = $scope.appSpreadFlag==true?false:true;
            console.info($scope.appSpreadFlag+":$scope.appSpreadFlag");
        }


        //悬浮框的几个基本事件
        $("#hoverImage").mouseenter(function(){
            $("#hover-qr").show();
            $("#hoverImage").attr("src","images/secondEdition/btn_code_2.png");
        });
        $("#hoverImage").mouseleave(function(){
            $("#hover-qr").hide()
            $("#hoverImage").attr("src","images/secondEdition/btn_code_1.png");
        });
        $("#hoverTop").mouseenter(function(){
            $("#hoverTop").attr("src","images/secondEdition/btn_Top_2.png");

        });
        $("#hoverTop").mouseleave(function(){
            $("#hoverTop").attr("src","images/secondEdition/btn_Top_1.png");

        });

        $("#hoverTop").click(function(){
            $anchorScroll();
        });


        //退出
       /* $scope.$on("executeExit", function (event, options) {
            console.info("----------logout-");
            $UserService.logOut();
            $location.path('/');
        });*/


        //获取大盘数据回调
        var getSuccess = function (data) {
            $scope.dataItems = new Array();
            for (var i in data.result) {
                var o = new Object();
                o.title = data.result[i].name;
                o.total = data.result[i].index;
                o.code = data.result[i].code;


                if (data.result[i].change > 0) {
                    o.totalFloatingPoint = "+" + data.result[i].change;
                    o.currentFloatingPoint = "+" + data.result[i].netChange + "%";
                    o.fontClass = "font_red";
                    o.splitClass = "bg_red";
                } else {
                    o.totalFloatingPoint = data.result[i].change;
                    o.currentFloatingPoint = data.result[i].netChange + "%";
                    if (o.totalFloatingPoint < 0) {
                        o.fontClass = "font_green";
                        o.splitClass = "bg_green";
                    } else {
                        o.fontClass = "font_normal";
                        o.splitClass = "bg_normal";
                    }
                }

                $scope.dataItems.push(o);

                console.info("--->>>"+o);

            }

            $window.localStorage.marketData = angular.toJson($scope.dataItems);

        };

        //获取大盘数据
        var getMarket = function () {
            ApiService.get(ApiService.getApiUrl().getMarket, {marketCodes: "glh00001,hkHSI,usDJI,sh000001,sz399001"}, getSuccess);
        }

        //一分钟更新大盘数据
        var intervalId = setInterval(function () {
            $scope.$apply(getMarket);
        }, 60000);

        //当去掉的时候，取消刷新大盘数据
        ele.bind("$destroy", function () {
            clearInterval(intervalId);
        });

        //alert($window.localStorage.marketData);

        if ($window.localStorage.marketData) {
            $scope.dataItems= angular.fromJson($window.localStorage.marketData);
        } else {
            getMarket();
        }

        $scope.marketDetail = function (code) {
            //暂时只有格隆汇港A100
            if (code == "glh00001") {
                $location.path("/glhExponent/" + code);
            }
        }
        
        
    }]);


//统一错误页面
GLHApp.controller('ErrorController', ['$scope', '$root$scope', '$http', '$location', '$routeParams', 'ApiService', function ($scope, $root$scope, $http, $location, $routeParams, ApiService) {

    switch ($routeParams.errorType) {
        case "userNotFound":
            $scope.errorMsg = "抱歉，该用户不存在";
            break;
        case "postNotFound":
            $scope.errorMsg = "帖子可能已被删除";
            break;
        case "stockNotFound":
            $scope.errorMsg = "非常抱歉，没有为您找到代码为\"" + $routeParams.code + "\"的股票";
            break;
        case "invalidActiveCode":
            $scope.errorMsg = "链接地址已经失效";
            break;
        default:
            $scope.errorMsg = '系统错误';
            break;
    }
}]);

//统一成功页面
GLHApp.controller('SuccessController', ['$scope', '$root$scope', '$http', '$location', '$routeParams', 'ApiService', function ($scope, $root$scope, $http, $location, $routeParams, ApiService) {
    $scope.showLogin = true;
    //换面来源
    switch ($routeParams.type) {
        case "register":
            $scope.messageInfo = "恭喜您,格隆汇账号注册成功,您可以"
            break;
        case "registerMail":
            $scope.messageInfo = "恭喜您,格隆汇账号注册成功。激活邮件已发送到您的注册邮箱，请登录邮箱激活您的账号。"
            $scope.showLogin = false;
            break;
        case "updatePwd":
            $scope.messageInfo = "恭喜您,密码修改成功，欢迎登录格隆汇  "
            break;
        case "updatePwdMail":
            $scope.messageInfo = "恭喜您,密码修改成功，欢迎登录格隆汇  "
            break;
        case "sendPwdMail":
            $scope.messageInfo = "邮件发送成功，请登录邮箱完成密码修改 "
            $scope.showLogin = false;
            break;
        default :
            break;
    }
    
    
    
}]);

//公司简介页面
GLHApp.controller('IntroductionController', ['$scope', '$root$scope', '$http', '$location', '$routeParams', function ($scope, $root$scope, $http, $location, $routeParams) {

    if ($routeParams.type && $routeParams.type == "mobile") {
        $("#header").hide();
        $("#banner").hide();
        $("#footer").hide();
        $("#wrapper").css("margin-top", "0px");
        $("#wrapper .main").css("margin-top", "0px");
        $("#wrapper .main .main-content .content").css("margin-top", "0px");

    }
}]);
