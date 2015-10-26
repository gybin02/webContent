/*
 * Created by Daniel.zuo on 4/15/2015
 * */
GLHApp.directive("textEditor",["$timeout","$UserService","ApiService","CommService", function ($timeout,$UserService,ApiService,CommService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        controller:function($scope){
        },
        templateUrl: "templates/text-editor.html",
        link: function (scope, element, attrs) {

        	var $at = scope.$$childTail.$$childHead;
        	var $dollar = $at.$$nextSibling;        	
        	var _scopeId,
        		_$editor = element.find('div[contenteditable="true"]'),
        		_editor = _$editor.get(0),
        		isShowSearchBoxFloat = false,
        		_symbol,keyword = "*",savedSel,savedSelActiveElement,start,end,symbolPos={};
        		
        	var selection = scope.selection = {
    			save:function(){
    				 // Remove markers for previously saved selection
    	            if (savedSel) {
    	                rangy.removeMarkers(savedSel);
    	            }
    	            savedSel = rangy.saveSelection();
    	            savedSelActiveElement = document.activeElement;
	            },
				restore:function(){
					if (savedSel) {
		                rangy.restoreSelection(savedSel, true);
		                savedSel = null;
		                window.setTimeout(function() {
		                    if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
		                        savedSelActiveElement.focus();
		                    }
		                }, 1);
		            }				
				}
			};
            var editor = CommService.editor;
        	var searchBoxFloat = {
	            // 显示浮动搜索框
    			position:function(pos){
    				return {
    					'x':pos.x,
            			'y':pos.y+20,
            			'zIndex':10000,
            			'scopeId':_scopeId,
            			'$editor':_editor
        			};
    			},
    			show:function (pos) {
    				var pos = this.position(pos);
    				CommService.prepForBroadcast('showSearchBoxFloat',pos);
    				editor.focus(_editor);
				},
	            hide:function(){
	            	isShowSearchBoxFloat = false;
	            	CommService.prepForBroadcast('hideSearchBoxFloat');
            	},
	            setFilterText:function(filter){
	            	CommService.prepForBroadcast('setFilterText',filter);
	            },
	            setText:function(area){
	            	editor.restoreSelection(area.control,{"start":start,"end":end});
	            	selection.restore();
	            	if(area.item==_symbol){
	            		area.item = _symbol;	            		
	            	}else{
	            		area.item = _symbol+area.item;
	            		_symbol = "";
	            	}
	            	editor.insertTextAtCursor(CommService.removeHTMLTag(area.item),false);
	            	_$editor.find('.rangySelectionBoundary').remove();	            	
	            	selection.save();
	            	keyword="*";
	            },
	            setPosition:function(){
	            	//输入过滤成功显示
        			isShowSearchBoxFloat = true;
        			var cursorPos = editor.searchBoxFloatPosition();
        			searchBoxFloat.show(cursorPos.endPos);
        			var saveSel = editor.saveSelection(_editor);
        			// 鼠标添加 符号后模糊搜索
    				start = saveSel.start > 0? saveSel.start - 1 : saveSel.start ;
        			end = saveSel.end;
	            }
            };
        	function insertText(area){
        		savedSel = area.savedSel;
            	start = area.pos?area.pos.start:start;
            	end = area.pos?area.pos.end:end;            	
            	symbolPos = area.pos?{'start':area.pos.start,'end':area.pos.end} : symbolPos;
            	searchBoxFloat.setText(area);
             }
        	
        	function autoScroll(){
        		if(_editor.offsetHeight + 480 >= bodyHeight){
                	_editor.style.height = bodyHeight - 480+'px';
                	_editor.style.overflowY = 'auto';
                }else{
                	_editor.style.height = 'auto';
                }
        	}
        	
        	var bodyHeight = screen.height;
        	// 显示文本框
            scope.$on('showMaskTextEditor', function (event) {
            	_editor.style.maxHeight = bodyHeight - 480 +'px';
            	document.body.style.overflow = "hidden";
            	element.css({"display": "block", "background-color": "#fff"});
            });
            
            // 注册 @ 事件
            scope.$on('setContentModel-scope-'+$at.$id, function (e, area) {

            	isShowSearchBoxFloat = area.pos?true:false;

            	_symbol = "@";
            	insertText(area);

            });
            // 注册 $ 事件
            scope.$on('setContentModel-scope-'+$dollar.$id, function (e, area) {
            	isShowSearchBoxFloat = area.pos?true:false;            	
            	_symbol = "$";
            	insertText(area);
            });            
            // 取消
            scope.cancle = function () {
                scope.hideTextEditor();
            };
            // 隐藏长文本编辑框
            scope.hideTextEditor = function () {
            	searchBoxFloat.hide();
                element.css({"display": "none"});
                document.body.removeAttribute("style");
            };
            
            function isSymbol(newSaveSel){
    			var symbol = _$editor.text().substring(symbolPos.start,symbolPos.end);
    			return ['@','$'].indexOf(symbol) > -1;
            }
            
            function getSymbolText() {
            	var newSaveSel = editor.saveSelection(_editor);
    			start = newSaveSel.start-1;
    			end = newSaveSel.end;    			
    			var inputValue= _$editor.text().substring(start,end);

            	if(['@','$'].indexOf(inputValue) > -1){
            		symbolPos = {"start":start,"end":end};
            		_symbol = inputValue;
            		isShowSearchBoxFloat = true;
            		searchBoxFloat.setPosition();
            	}else{
            		if(element.hasClass('hide')){
            			searchBoxFloat.hide();
            		}
            	}
            }
            
            function triggerChange(){
            	var newSaveSel = editor.saveSelection(_editor);
                if (isShowSearchBoxFloat && newSaveSel.end>0) {
                	if(start>end && end > 0){
                		start = end-1;
                	}
                	end = newSaveSel.end;
                	if(isSymbol(newSaveSel) && symbolPos && symbolPos.end <= end && !/\s+/.test(keyword)){
            			var keyword = _$editor.text().substring(symbolPos.start,end);
            			searchBoxFloat.setFilterText({'symbol':_symbol,'filterText':keyword ||'*'});
            			return;
            		}
                }
            	searchBoxFloat.hide();
            }
            
            // 输入监控
            _$editor.on('focus', function() {
                var $this = $(this);
                $this.data('before', $this.html());
                selection.restore();
                return $this;
            })
            .on('keydown keyup', function(e) {
                var $this = $(this);
                if(e.keyCode == 50 && e.shiftKey){            		
        			_scopeId = $at.$id;
        			getSymbolText();
            	}
            	if(e.keyCode == 52 && e.shiftKey){
            		_scopeId = $dollar.$id;
            		getSymbolText();
            	}
                if ($this.data('before') !== $this.html()) {
                    $this.data('before', $this.html());
                    $this.trigger('change');
                }
                return $this;
            })
            .on('blur',function(e){
            	e.preventDefault();
            	isShowSearchBoxFloat = false;
            })
            .on('change',function(e){
            	e.preventDefault();
        		triggerChange();
            	autoScroll();
            });
            scope.error = { "status":true,"message":"" };
            // 提交文本
            scope.submitCommit = function () {
            	var param = {
                    type: 1,
                    title: scope.textTitle,
                    content: _$editor.html(),
                    file: ''
                }
            	/*给提交俺就设置禁用属性*/
            
            	contents=$.trim(_$editor.html().replace(/<\/?[^>]*>/g,'').replace(/&nbsp;/ig,''));//禁止空文本提交
            	if(param.title && contents){  
            		$("#submit-btn").attr("disabled",'disabled');//禁用按钮可点
            		ApiService.post(ApiService.getApiUrl().publishCommit,{},param,function(response){
            			if(response.statusCode == 200){
                    		scope.hideTextEditor();
                            scope.htmlContent = scope.textTitle = '';
                            $("#submit-btn").removeAttr('disabled');//恢复按钮可点
            				CommService.prepForBroadcast('loadFeeds','uploadPdf => userTrends => loadFeeds;');
            			}
            		},function(response){ 
            			if(response.statusCode == 403){
            				//登录超时，弹出登录框
            				$("#submit-btn").removeAttr('disabled');//恢复按钮可点
            				$UserService.timeOutTip(element.find('.btn.btn-info.send-diy'), scope);
            				scope.hideTextEditor();
            				
                        }else{
            				scope.error = { "status":false,"message":"研报提交失败" };
            			}
            			});

                }else{
	    			scope.error = { "status":false,"message":"请填写标题或内容"};
	    			$("#submit-btn").removeAttr('disabled');//恢复按钮可点
	    			$timeout(function(){
		        		scope.error = { "status":true,"message":"" };
		        	},3000);
	    		}	    		
            };
        }
    }
}]);