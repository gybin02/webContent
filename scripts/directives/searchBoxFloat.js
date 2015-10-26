GLHApp.directive("searchBoxFloat",['ApiService','CommService','$UserService',function(ApiService,CommService,$UserService){
	return {
		restrict: 'E',
        replace: true,
		scope:{},
        templateUrl:'templates/search-box-float.html',
        link: function(scope, element, attrs){
        	var _symbol,_filterText,_scopeId,_pos;
            scope.$on('showSearchBoxFloat',function(event,pos){
                _pos = pos;
                element.addClass("open");
                element.find('ul.dropdown-menu').animate({'left':pos.x,'top':pos.y ,'z-index': pos.zIndex})
            });
        	//注册浮动框显示事件
            scope.$on('hideSearchBoxFloat',function(){
        		scope.hideSearchBoxFloat();
        	});
            
            // 设置搜索文本
            scope.$on('setFilterText',function(event,transparam){
            	 scope.setFilterText(transparam);
            })
            
          //隐藏浮动搜索框
        	scope.hideSearchBoxFloat = function(){
            	element.removeClass("open").removeAttr('style');
        	}
        	scope.setContentModel = function(item){
        		CommService.prepForBroadcast('setContentModel-scope-'+_pos.scopeId,{ control:_pos.$editor, item :item });
        	}
        	//选中所选咧
			scope.selectItem = function (item){
				scope.hideSearchBoxFloat();
				scope.setContentModel(item.name+(_symbol=="$"?"$":"")+" ");
			};

            scope.setFilterText = function(transparam){
            	_symbol = transparam.symbol;
            	_filterText = transparam.filterText;            	
            	//临时过滤
            	scope.filterText = _filterText;
            	//发帖，包含@ 和 $ 浮动层搜索数据绑定
            	if(_symbol=='$'){
            		scope.searchTitle = '输入股票代码:';
            		searchStock(encodeURIComponent(_filterText));
            	}
            	if(_symbol=='@'){
            		scope.searchTitle = '选择昵称或者经常@的人:';
            		searchLastCalls(encodeURIComponent(_filterText));
            	}
            } 
            
            // $搜索           
            function searchStock(filter){
            	//数据股票绑定            	
        		ApiService.get(ApiService.getApiUrl().getSearchStock,{type:"stock",keyword:filter,page:1,count:10},function(response){
        			scope.items = [];
        			if(response.statusCode == 200){
        				console.info("->"+response.result+"--"+response.result.stockList.length); 
        				if(response.result && response.result.stockList.length>0){
            				angular.forEach(response.result.stockList,function(v){   
            					scope.items.push({
            						"name":v.stockName+"("+(v.type || "")+v.stockCode+")",
            						"type":v.type || "",
            						"spell":v.spll || ""});
                			});
            			}
        			}        			
        		});
            };


            //@搜索
            function searchLastCalls(filter){
                //数据绑定
                ApiService.get(ApiService.getApiUrl().getPostLastCalls,{keyword:filter,page:1,count:10},function(response){
                    scope.items = [];
                    if(response.statusCode == 200){
                        if(response.result && response.result.length>0){
                            angular.forEach(response.result,function(v,k){
                                scope.items.push({"name":v.userNick,"type":v.callId,"spell":v.userNick});
                            });
                        }
                    }
                },function(response){
                    if(response.statusCode == 403){
                        $UserService.authPage(scope);
                    }
                });
            };

            /*

            
            // */
		}
	}
}]);