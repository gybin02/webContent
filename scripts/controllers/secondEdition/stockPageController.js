GLHApp.controller('stockPageController', ['$scope', '$location', '$routeParams', 'ApiService', 'CommService', 'DialogService', '$UserService', 'StockService',
    function ($scope, $location, $routeParams, ApiService, CommService, DialogService, $UserService, StockService) {
		//tabs 切换
//		$("#tab-nav li").on("click", function() {
//			$this = $(this);
//			var tabName = $this.find("a").data("name");
//			$this.addClass("active").siblings("li").removeClass("active");
//			$("#"+tabName).addClass("active").siblings("div").removeClass("active");
//		})
		
		//个股编号（行业编号+个股编号：hk00243）
        $scope.stockCode = $routeParams.stockCode;
        $scope.type = $scope.stockCode.slice(0,2)
        $scope.code = $scope.stockCode.slice(2,$scope.stockCode.length);

        $scope.stockInfo = {};
        $scope.currentTab = "cream";

        $scope.isUserStock = false;
        //精华帖子列表
        $scope.creamList = [];

        //帖子列表
        $scope.postList = [];

        //监视登录框，登录的情况下重新刷新是否添加自选
        $scope.$on("initAfterLogin", function (event, options) {
            $scope.init();
        });

        $scope.init = function () {
            ApiService.get(ApiService.getApiUrl().isUserStock, {stockCodes: $scope.stockCode}, function (response) {
                $scope.isUserStock = response.result[$scope.stockCode];
            }, function (response) {
                $scope.isUserStock = false;
            });
        }

        $scope.init();
        
        $scope.defaultStockCode = [];
        
        //获取个股行情
        $scope.getStockInfo = function() {
        	var x, n = 0, rotINT;
        	$scope.stockInfoload = false;
        	ApiService.get(ApiService.getApiUrl().stockDetail, {stocks: $scope.stockCode, detail:true}, function (response) {
	            $scope.isBaseInfoLoaded = true;
	            if (response.result != null && response.result.length > 0) {
	                $scope.stockInfo = angular.copy(response.result[0]);
	                $scope.defaultStockCode.push("$"+response.result[0].name+"("+$routeParams.stockCode+")$ ");
	                if($scope.stockInfo.extInfo){
	                	$scope.stockInfo.tradeInfo = [];
	                	//extInfo list
	                	var tmpInfoList = [];
	                	var tmpInfo = {};
	                	for(var i=0; i<$scope.stockInfo.extInfo.length; i++){
	                		if((i+1)%2 == 0){
	                			tmpInfo.value = $scope.stockInfo.extInfo[i];
	                			tmpInfoList.push(tmpInfo);
	                			tmpInfo = {};
	                		}else{
	                			tmpInfo.name = $scope.stockInfo.extInfo[i];
	                		}
	                	}
	                	var detail = [];
	                	for(var i=0; i<tmpInfoList.length; i++){
	                		detail.push(tmpInfoList[i]);
	                		if((i+1)%tmpInfoList.length == 0){
	                			$scope.stockInfo.tradeInfo.push(detail);
	                			detail = [];
	                		} 
	                	}
	                	
	                	if(detail.length > 0){
	                		$scope.stockInfo.tradeInfo.push(detail);
	                	}
	                }
	                
	                if($scope.stockInfo.name == null){
	                	$scope.stockInfo.name = "--";
	                }
	                
	                if($scope.stockInfo.code){
	                	$scope.stockInfo.stockCodeExtShow = $scope.stockInfo.type.toUpperCase()+":"+$scope.stockInfo.code;
	                }
	                
	                if($scope.stockInfo.price == null){
	                	$scope.stockInfo.price = "--";
	                }else{
	                	if ($scope.stockInfo.type == "sh" || $scope.stockInfo.type == "sz") {
	                		$scope.stockInfo.price = "￥" + $scope.stockInfo.price;
	                	} else {
	                		$scope.stockInfo.price = "$" + $scope.stockInfo.price;
	                	}
	                }
	                if ($scope.stockInfo.change > 0) {
	                    $scope.stockInfo.fontColor = "font_red";
	                    $scope.stockInfo.changeRate = "+" + $scope.stockInfo.change + " (+" + $scope.stockInfo.netChange + "%)";
	                } else if ($scope.stockInfo.change < 0) {
	                    $scope.stockInfo.fontColor = "font_green";
	                    $scope.stockInfo.changeRate = $scope.stockInfo.change + " (" + $scope.stockInfo.netChange + "%)";
	                } else {
	                	$scope.stockInfo.fontColor = "font_normal";
	                	if($scope.stockInfo.change == null){
	                		if($scope.stockInfo.netChange == null){
	                			$scope.stockInfo.changeRate = "-- (--)";
	                		}else{
	                			$scope.stockInfo.changeRate = "-- (" + $scope.stockInfo.netChange + ".00%)";
	                		}
	                	}else{
	                		if($scope.stockInfo.netChange == null){
	                			$scope.stockInfo.changeRate = $scope.stockInfo.change + ".00 (--)";
	                		}else{
	                			$scope.stockInfo.changeRate = $scope.stockInfo.change + ".00 (" + $scope.stockInfo.netChange + ".00%)";
	                		}
	                	}
	                }
	            } else {
	                $location.path("/error/stockNotFound/" + $scope.stockCode);
	            }
        		$scope.stockInfoload = true;
	
	        }, function (response) {
	        	//
	        	//$("#reload").css("transform", "rotate(90deg)");
	        	
	        });
        };
        $scope.getStockInfo();
        
        var x, y, n = 0, ny = 0, rotINT, rotYINT
		function rotateDIV() {
		    x = document.getElementById("reload")
		        clearInterval(rotINT)
		        rotINT = setInterval("startRotate()", 10)
		}
		function rotateYDIV() {
		    y = document.getElementById("rotatey1")
		        clearInterval(rotYINT)
		        rotYINT = setInterval("startYRotate()", 10)
		}
		function startRotate() {
		    n = n + 1
		        x.style.transform = "rotate(" + n + "deg)"
		        x.style.webkitTransform = "rotate(" + n + "deg)"
		        x.style.OTransform = "rotate(" + n + "deg)"
		        x.style.MozTransform = "rotate(" + n + "deg)"
		        if (n == 180 || n == 360) {
		            clearInterval(rotINT)
		            if (n == 360) {
		                n = 0
		            }
		        }
		}
		function startYRotate() {
		    ny = ny + 1
		        y.style.transform = "rotateY(" + ny + "deg)"
		        y.style.webkitTransform = "rotateY(" + ny + "deg)"
		        y.style.OTransform = "rotateY(" + ny + "deg)"
		        y.style.MozTransform = "rotateY(" + ny + "deg)"
		        if (ny == 180 || ny >= 360) {
		            clearInterval(rotYINT)
		            if (ny >= 360) {
		                ny = 0
		            }
		        }
		}
		
		rotateDIV();
        
        $scope.$on('loadFeeds', function() {
        	if($scope.currentTab == "post"){
        		$scope.getPostList();
        	}else{
        		$scope.currentTab = "post";
        	}
        });
        
        $scope.paginationNoticeConf = {
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
            onChange: function () {
                //获取分页数据
                $scope.getNoticeList();
            }
        };

//      $scope.paginationCreamConf = {
//          //当前页码
//          currentPageNum: 1,
//          //每页显示数
//          itemsPerPage: 10,
//          //页码显示个数
//          pagesLength: 9,
//          //总页数
//          numberOfPages: 0,
//          //总记录数
//          totalItems: 0,
//          onChange: function () {
//              $scope.getCreamList();
//          }
//      };

        $scope.paginationPostConf = {
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
            onChange: function () {
                $scope.getPostList();
            }
        };
        
        //获取公告列表
        $scope.getNoticeList = function () {
            $scope.isNoticeLoaded = false;
            $scope.NoticeList = new Array();
            var params = {page: $scope.paginationNoticeConf.currentPageNum,
                count: $scope.paginationNoticeConf.itemsPerPage,
                stockCode: $scope.stockCode};
            ApiService.get(ApiService.getApiUrl().stockNotice, params,
                function (response) {
                    $scope.isNoticeLoaded = true;
                    $scope.NoticeList = response.result;
                    if($scope.NoticeList){
                    	for(var i in $scope.NoticeList){
                    		if($scope.NoticeList[i].fileType){
                    			$scope.NoticeList[i].fileType = $scope.NoticeList[i].fileType.toLowerCase();
                    		}
                    	}
                    }
                    $scope.paginationNoticeConf.totalItems = response.totalCount;
                    $scope.paginationNoticeConf.currentCounts = response.result.length;
                }, function (response) {
                    $scope.isNoticeLoaded = true;
                }
            );
        }
        
        
        //获取精华帖子
        var creampage = 1;
        $scope.creamList = [];
        $scope.isCreamLeft = true;
        $scope.getCreamList = function () {
            var params = {page: creampage,
                count: 10,
                stockCode: $scope.stockCode, cream: true};
            $scope.isCreamLoaded = false;
            ApiService.get(ApiService.getApiUrl().getStockPost, params,
                function (response) {
//                  $scope.paginationCreamConf.totalItems = response.totalCount;
//                  $scope.paginationCreamConf.currentCounts = response.result.length;
					$scope.creamconf = response.totalCount;
                    //异步用户信息
//                  var userIdCollections = [];
                    for (var index in response.result) {
                        var temp = response.result[index];
                        CommService.formatPubTime(temp, temp.createDate);
                        $scope.creamList.push({
                            postId: temp.postId,
                            userId: temp.userId,
                            avatar: temp.avatar,
                            nickname: temp.nickname,
                            title: temp.title,
                            summary: temp.summary,
                            file: temp.file,
                            publishTimeLoc: temp.publishTimeLoc,
                            userType: temp.userType,
                            type: temp.type,
                            postCount: temp.postCount.read
                        })

//                      if (userIdCollections.indexOf(temp.userId) == -1) {
//                          userIdCollections.push(temp.userId);
//                      }
                    }
                    $scope.isCreamLoaded = true;
                    //异步获取用户信息
//                  var userIds = userIdCollections.join(',');
//                  $scope.asyncLoadUser(userIds, $scope.creamList);

                }, function (response) {
                    $scope.isCreamLoaded = true;
                });
                
        }
        $scope.getCreamList();
        
        $scope.viewMoreCream = function() {
            creampage++;
            if (creampage*10 >= $scope.creamconf) {
            	$scope.isCreamLeft = false;
            }
        	$scope.getCreamList();
        }

        //获取全部帖子
        var postpage = 1;
        $scope.postList = [];
        $scope.isPostLeft = true;
        $scope.getPostList = function () {
            var params = {page: postpage,
                count: 10,
                stockCode: $scope.stockCode, cream: false};
            $scope.isPostLoaded = false;
            ApiService.get(ApiService.getApiUrl().getStockPost, params,
                function (response) {
//                  $scope.paginationPostConf.totalItems = response.totalCount;
//                  $scope.paginationPostConf.currentCounts = response.result.length;
					$scope.postconf = response.totalCount;
                    //异步用户信息
                    var userIdCollections = [];
                    for (var index in response.result) {
                        var temp = response.result[index];
                        CommService.formatPubTime(temp, temp.createDate);
                        $scope.postList.push({
                            postId: temp.postId,
                            userId: temp.userId,
                            avatar: temp.avatar,
                            title: temp.title,
                            summary: temp.summary,
                            file: temp.file,
                            publishTimeLoc: temp.publishTimeLoc,
                            userType: temp.userType,
                            type: temp.type
                        })

//                      if (userIdCollections.indexOf(temp.userId) == -1) {
//                          userIdCollections.push(temp.userId);
//                      }
                    }
                    $scope.isPostLoaded = true;
                    //异步获取用户信息
//                  var userIds = userIdCollections.join(',');
//                  $scope.asyncLoadUser(userIds, $scope.postList);

                }, function (response) {
                    $scope.isPostLoaded = true;
                }
            );
        }
        $scope.getPostList();
        
        $scope.viewMorePost = function() {
            postpage++;
            if (postpage*10 >= $scope.postconf) {
            	$scope.isPostLeft = false;
            }
        	$scope.getPostList();
        }


        //f10股票信息
        $scope.companyInfo = new Object();
        ApiService.get(ApiService.getApiUrl().chartCompanyInfo, {type: $scope.type,code: $scope.code}, function (response) {
            $scope.companyInfo=response.result;
        });
        
        $scope.showTab = function (currentTab) {
            $scope.currentTab = currentTab;
        }

        //跳转到帖子详情
        $scope.postDetail = function (postId) {
            window.open("/p/" + postId+".html");
        }
        
        //添加自选股
        $scope.addUserStock = function () {
            console.info("add user stock:"+$scope.stockInfo.code+"-"+$scope.stockInfo.type);
            StockService.addUserStock($scope.stockInfo.code, $scope.stockInfo.type, $scope, $("#btnAddUserStock"));
        }

        //删除自选股
        $scope.delUserStock = function () {
            StockService.delUserStock($scope.stockInfo.code, $scope.stockInfo.type, $scope, $("#btnDelUserStock"));
        }
        
        //回复框弹出 
        $scope.reply = function($event,postId,userId){
	        var _user_editor = angular.element($event.target).parent().parent().next();
	        var _scopId = _user_editor.attr('data-scope-id');
	        CommService.prepForBroadcast('replyComment-scope-'+_scopId,{ "postId":postId,"userId":userId,"_broadcastId":_scopId,"commentId":null});
	        if(_user_editor.hasClass('hide')){
	        	_user_editor.removeClass('hide');
	        }else{
	        	_user_editor.addClass('hide');
	        }
        }
        
        
        //股票交易功能
        $scope.trade = function(code){
			$scope.stockCode = code;
			$scope.showSecBrokers = !$scope.showSecBrokers;
		}
        
        
        
}]);