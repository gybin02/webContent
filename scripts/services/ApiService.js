/**
 * Api统一调用入口
 * Created by vincent.chang on 4/3/2015.
 */
GLHApp.factory('ApiService', ["$resource", "$location", "$window", '$http', 'DialogService', function ($resource, $location, $window, $http, DialogService) {

    var service = {};

    //定义Api请求地址对象
    var restApiUrl = {

        //登录
        login: {url: "/api/user/login", needCommonAlert: true},

        //邮箱激活帐号Api
        active_user: {url: "/api/user/active?userId={userId}&activeCode={activeCode}&code={code}", needCommonAlert: true},

        //用户注册
        register: {url: "/api/user/register", needCommonAlert: true},

        //获取用户详情的国家，地区，城市，职业下拉列表的值
        getInfo: {url: "/api/user/getInfo", needCommonAlert: true},

        //修改用户资料是初始化信息
        getUserDetail: {url: "/api/user/getDetail?userId={userId}", needCommonAlert: true},

        //获取用户信息
        getUserInfoById: {url: "/api/user/get?userId={userId}", needCommonAlert: false},

        //用户资料完善
        updateInfo: {url: "/api/user/updateInfo", needCommonAlert: true},

        //通过手机找回密码
        findPhone: {url: "/api/user/findPhone", needCommonAlert: true},

        //通过邮箱找回密码发邮件
        findEmail: {url: "/api/user/findEmail?email={email}", needCommonAlert: true},

        //通过邮箱找回密码修改密码
        updateByEmail: {url: "/api/user/updateByEmail", needCommonAlert: true},

        //获取首页栏目列表
        getColumnList: {url: "/api/column/list", needCommonAlert: true},

        //查询热点话题和港股信息
        getArticleColumn: {url: "/api/article/column/{columnCode}", needCommonAlert: true},

        //邀请码验证
        checkInvitCode: {url: "/api/invitationCode/isAvailable/{code}", needCommonAlert: true},

        //注册手机发送手机验证码
        sendRegistCode: {url: "/api/sms/register/{phone}", needCommonAlert: true},

        //找回密码发送手机验证码
        sendForgetCode: {url: "/api/sms/forgot/{phone}", needCommonAlert: true},

        //获取更多文章
        getArticleList: {url: "/api/article/list?columnCode={columnCode}&limit={limit}&page={page}", needCommonAlert: true},

        //获取帖子详情
        getPost: {url: "/api/post/{postId}", needCommonAlert: true},
        
        //删除帖子
        deletePost:{url: "/api/post/{postId}/delete", needCommonAlert: true},

        //获取文章评论
        getPostComment: {url: "/api/post/{postId}/comment?page={page}&count={count}", needCommonAlert: false},

        //帖子点赞
        likePost: {url: "/api/post/{postId}/like/add", needCommonAlert: true},
        
        //帖子点赞
        cancelLikePost: {url: "/api/post/{postId}/like/delete", needCommonAlert: true},

        //帖子收藏
        addFavPost: {url: "/api/post/{postId}/fav/add", needCommonAlert: true},
        
        //帖子取消收藏
        delFavPost: {url: "/api/post/{postId}/fav/delete", needCommonAlert: true},

        //获取收藏列表
        getFavPostList: {url: "/api/post/fav?page={page}&count=10&userId={userId}", needCommonAlert: false},

        //获取帖子列表
        getPostList: {url: "/api/post?page={page}&count=10&userId={userId}", needCommonAlert: false},

        //获取帖子列表
        getMyCommentList: {url: "/api/comment?userId={userId}&page={page}&count=10", needCommonAlert: false},

        //获取大盘行情
        getMarket: {url: "/api/quote/market/base?marketCodes={marketCodes}", needCommonAlert: false},

        //原有发帖
        publishCommit: {url: "/api/post", needCommonAlert: true},
        
        //网站新增发帖
        articleCommit: {url: "/api/post/add", needCommonAlert: true},

        //帖子评论
        addComment: {url: "/api/post/{postId}/comment", needCommonAlert: true},
        
        //删除评论
        deleteComment: {url: "/api/post/comment/{commentId}/delete", needCommonAlert: true},

        //取消帖子收藏
        removeFavor: {url: "/api/post/{postId}/fav/delete", needCommonAlert: true},

        //获取feeds列表
        getFeedList: {url: "/api/feeds?page={page}&count={count}", needCommonAlert: false},

        //搜索用户
        getSearchUser: {url: "/api/search/user?keyword={keyword}&count=7&page={page}", needCommonAlert: false},

        //搜索帖子文章
        getSearchPost: {url: "/api/search/post?type=all&keyword={keyword}&count=7&page={page}", needCommonAlert: false},

        //搜索行业信息
        getSearchGics: {url: "/api/stockGics/gics?keyword={keyword}&page={page}&count=10", needCommonAlert: false},

        //搜索二级行业下的所有公司
        getSearchGicsCompany: {url: "/api/stockGics/{gicsII}/stock?page={page}&count=10", needCommonAlert: false},

        //搜索一级行业下面的二级行业
        getSearchGicsII: {url: "/api/stockGics/{gicsI}/gicsII?page={page}&count=10", needCommonAlert: false},

        //获取私信列表
        getMessagesList: {url: "/api/message/get?sendTo={sendTo}&page={page}&count={count}&sendFrom={sendFrom}", needCommonAlert: false},

        //获取提到我的列表
        getReferList: {url: "/api/post/callme?&page={page}&count={count}", needCommonAlert: false},

        //搜索股票
        getSearchStock: {url: "/api/search/stock?keyword={keyword}&count=10&page={page}", needCommonAlert: false},

        //搜索 帖子&股票&用户
        getSearchBox: {url: "/api/search/searchBox?keyword={keyword}&count=3&page=1", needCommonAlert: false},

        //关注用户
        followUser: {url: "/api/friendships/follow", needCommonAlert: true},

        //取消关注
        unfollowUser: {url: "/api/friendships/unfollow", needCommonAlert: true},

        //发送私信
        sendMessage: {url: "/api/message/add", needCommonAlert: true},

        //修改密码
        updatePassword: {url: "/api/user/updatePwd", needCommonAlert: true},

        //发帖图片上传
        postImage: {url: "/api/file/post/image", needCommonAlert: true},

        //发帖pdf上传
        postPDF: {url: "/api/file/post/pdf", needCommonAlert: true},

        //获取关注列表
        getFollowings: {url: "/api/friendships/followings?page={page}&count=10&userId={userId}", needCommonAlert: false},

        //获取粉丝列表
        getFollowers: {url: "/api/friendships/followers?page={page}&count=10&userId={userId}", needCommonAlert: false},

        //取消关注
        unfollow: {url: "/api/friendships/unfollow?destUserId={destUserId}", needCommonAlert: true},

        //加关注
        addAttention: {url: "/api/friendships/follow?destUserId={destUserId}", needCommonAlert: true},

        //获取用户基本信息
        getUserBaseInfo: {url: "/api/user/get?userId={userId}&nick={nick}", needCommonAlert: true},

        //获取用户基本信息集合
        getUserList: {url: "/api/user/list?userIds={userIds}", needCommonAlert: false},

        //获取评论我的列表
        getCommentMeList: {url: "/api/comment/my?page={page}&count={count}", needCommonAlert: false},

        //获取最近@人列表
        getPostCallMe: {url: "/api/post/callme?page={page}&count={count}", needCommonAlert: false},
        
        getPostLastCalls: {url: "/api/post/lastCalls?key={keyword}&page={page}&count={count}", needCommonAlert: false},

        //获取热度榜
        getHotRead: {url: "/api/article/hots?type={type}&count={count}", needCommonAlert: false},

        //上传头像预览
        screenShot: {url: "/api/file/user/screenshot", needCommonAlert: true},

        //上传裁剪后的头像
        cropAvatar: {url: "/api/file/user/cropAvatar?avatarPath={avatarPath}&x={x}&y={y}&width={width}&height={height}", needCommonAlert: true},

        //获取自选股列表
        selfStock: {url: "/api/userstock", needCommonAlert: false},

        //获取其他人的选股列表
        userStock: {url: "/api/userstock?userId={userId}", needCommonAlert: false},

        //获取个股行情数据
        getStocksDetail: {url: "/api/quote/stock?stocks={stocks}", needCommonAlert: false},

        //获取格隆汇港A100指数详情
        marketDetail: {url: "/api/quote/market/detail?marketCode={marketCode}", needCommonAlert: true},

        //用户退出
        logout: {url: "/api/user/logout", needCommonAlert: false},

        //用户登录超时判断
        loginTimeOut: {url: "/api/user/login/timeout", needCommonAlert: true},

        //获取个股行情
        stockDetail: {url: "/api/quote/stock?stocks={stocks}&detail={detail}", needCommonAlert: false},

        //获取个股公告
        stockNotice: {url: "/api/stock/announcements?page={page}&count={count}&stockCode={stockCode}", needCommonAlert: false},

        //获取股票相关帖子列表
        getStockPost: {url: "/api/post?page={page}&count={count}&stockCode={stockCode}&cream={cream}", needCommonAlert: false},

        //批量获取指定用户是否已被加关注
        getFollowStatus: {url: "/api/friendships/isfollow?userIds={userIds}", needCommonAlert: false},

        //获取股票是否属于自选股
        isUserStock: {url: "/api/userstock/isUserStock?stockCodes={stockCodes}", needCommonAlert: false},

        //获取热点媒体列表
        getMediaArticleList: {url: "/api/media/articlelist?count={count}&page={page}", needCommonAlert: true},

        //添加自选股
        addUserStock: {url: "/api/userstock/add", needCommonAlert: false},
        
        //邮箱忘记密码检查active code
        checkActiveCode: {url: "/api/user/checkActiveCode?email={email}&activeCode={activeCode}", needCommonAlert: false},
        
        //删除自选股
        delUserStock: {url: "/api/userstock/delete?stockCodes={stockCodes}", needCommonAlert: false},

        //检查注册时用户昵称是否含有敏感词
        checkNickname: {url: "/api/detection/checkNickname?word={word}", needCommonAlert: false},
        
        //获取即时消息
        getUserStatus: { url:"/api/user/status/get",needCommonAlert:true},

        //是否启用邀请码注册功能
        isInvitRegEnable: {url: "/api/invitationCode/isEnable", needCommonAlert: false},

        //是否已经登录了
        isLogin:{url:"/api/user/isLogin",needCommonAlert:false},

        //推荐用户
        recommendUser:{url:"/api/recomUser?page={page}&count={count}",needCommonAlert:false},

        //新版周热读
        hotViewBeta:{url:"/api/shortPosts?page={page}&count={count}",needCommonAlert:false},

        //热门股票
        hotStockList:{url:"/api/hotStock?page={page}&count={count}",needCommonAlert:false},
        
        //获取推荐用户

		recommendUserList :{url:"/api/recomUser?page={page}&count={count}",needCommonAlert:false},
		//获取幻灯片
		slideList  : {url:"/api/slide/list?page={page}&count={count}",needCommonAlert:false},

		recommendUserList :{url:"/api/recomUser?page={page}&count={count}",needCommonAlert:false},

        //f10公司信息
        chartCompanyInfo:{url:"/api/chart/companyInfo/{type}/{code}",needCommonAlert:false},

        //f10公司债务
        chartLiability:{url:"/api/chart/liability/{type}/{code}",needCommonAlert:false},

        //f10公司股权比例
        chartShareRatio:{url:"/api/chart/ratio/{type}/{code}",needCommonAlert:false},

        //f10公司资产
        chartAsset:{url:"/api/chart/asset/{type}/{code}",needCommonAlert:false},

        //f10公司财务
        chartFinance:{url:"/api/chart/finance/{type}/{code}",needCommonAlert:false},

        //slideList:{url:"/api/slideList", needCommonGay:true}
    };

    //调用Get方法
    service.get = function (apiKey, apiParams, success, error) {
        $http.get(makeApiUrl(apiKey.url, apiParams)).success(function (response, status) {
            //成功直接回调成功函数
            if (response.statusCode == 200) {
                if (success instanceof  Function) {
                    success(response);
                }
            } else {
                if (apiKey.needCommonAlert) {
                    //统一错误处理
                    if (response.statusCode == 500 || response.statusCode == 404) {
                        DialogService.launch("error", response.message);
                    }
                }

                if (error instanceof  Function) {
                    error(response);
                }
            }
        }).error(function (response, status) {
            //调用API时出错,统一到错误页面
            $location.path('/error');
        });
    };

    //调用Post方法
    service.post = function (apiKey, apiParams, data, success, error) {
    	consistentHandle(apiKey, apiParams, data, success, error);
    };

    //调用Put方法
    service.put = function (apiKey, apiParams, data, success, error) {
    	consistentHandle(apiKey, apiParams, data, success, error);
    };

    //调用删除方法
    service.remove = function (apiKey, apiParams, data, success, error) {
    	consistentHandle(apiKey, apiParams, data, success, error);
    };
    
    var consistentHandle = function(apiKey, apiParams, data, success, error){
        $http.post(makeApiUrl(apiKey.url, apiParams), data).success(function (response, status) {
            //成功直接回调成功函数
            if (response.statusCode == 200) {
                if (success instanceof  Function) {
                    success(response);
                }
            } else {
                if (apiKey.needCommonAlert) {
                    //统一错误处理
                    if (response.statusCode == 500 || response.statusCode == 404) {
                        DialogService.launch("error", response.message);
                    }
                }
                if (error instanceof  Function) {
                    error(response);
                }
            }
        }).error(function (response, status) {
            //调用API时出错,统一到错误页面
            $location.path('/error');
        });
    
    }

    //处理ApiUrl
    var makeApiUrl = function (apiUrl, apiParams) {
        var url = apiUrl;
        //替换ApiUrl中的参数
        for (var i in apiParams) {
            url = url.replace("{" + i + "}", apiParams[i]);
        }

        return url;
    };

    //获取ApiUrl
    service.getApiUrl = function () {
        return restApiUrl;
    };

    return service;
}]);
