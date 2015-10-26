/*
 * create by daniel.zuo on 4/20/2015
 */

GLHApp.directive('uploadPdf',['FileUploader','CommService','ApiService','$timeout','$UserService', function(FileUploader,CommService,ApiService,$timeout,$UserService){
    return {
        restrict: 'E',
        replace:true,
        templateUrl:'templates/upload-pdf.html',        
        controller: function($scope){
        	var uploaderPdf = $scope.uploaderPdf = new FileUploader({
                url: ApiService.getApiUrl().postPDF.url
            });
            // FILTERS
        	uploaderPdf.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });
            // CALLBACKS
            uploaderPdf.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            };
            uploaderPdf.onAfterAddingFile = function(fileItem) {
                fileItem.upload();
            };
            uploaderPdf.onBeforeUploadItem = function(item) {
            };
            uploaderPdf.onSuccessItem = function(fileItem, response, status, headers) {                
            };
            uploaderPdf.onErrorItem = function(fileItem, response, status, headers) {
            };
            uploaderPdf.onCancelItem = function(fileItem, response, status, headers) {
            };
            uploaderPdf.onCompleteItem = function(fileItem, response, status, headers) {
            	if(response.statusCode == 200){
            		fileItem.url = response.result;
            	}else{
            		$scope.uploaderPdf.queue = [];
            		$scope.error = { "status":false,"message":response.message };
            	}
            };
        },
        link: function(scope, element, attr){
        	// 获取textarea 文本元素
        	var _scopeId = 'pdf-'+scope.$id,
        		_$editor = element.find('#pdf-contenteditable-describ'),
        		_editor = _$editor.get(0),        		        		
        		isShowSearchBoxFloat = false,
        		_symbol,keyword="*",start,end,symbolPos={};
        	// 获取textarea焦点
        	var editor = CommService.editor;
        	var searchBoxFloat = {
	            // 显示浮动搜索框
    			position:function(pos){
    				return {
    					'x':pos.x,
            			'y':pos.y+20,
            			'zIndex':100000,
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
	            	_symbol="";keyword="*";
	            	CommService.prepForBroadcast('hideSearchBoxFloat');
            	},
	            setFilterText:function(filter){
	            	CommService.prepForBroadcast('setFilterText',filter);
	            },
	            setPosition:function(){
	            	var cursorPos = editor.searchBoxFloatPosition();
	    			this.show(cursorPos.startPos);
	    			var saveSel = editor.saveSelection(_editor);
	    			// 鼠标添加 符号后模糊搜索
					start = saveSel.start > 0? saveSel.start - 1 : saveSel.start ;
	    			end = saveSel.end;
	    			isShowSearchBoxFloat = true;
	            }
            };
        	// 设置文本框内容
            scope.$on('setContentModel-scope-'+_scopeId, function (e, area) {
            	editor.restoreSelection(area.control,{"start":start,"end":end});
            	editor.focus(area.control);
            	editor.insertTextAtCursor(_symbol+area.item,false);
            	isShowSearchBoxFloat = false;
            	_symbol="";
            });
            // 显示研报上传面板
        	scope.$on('showMaskUploadPdf',function(target){
        		element.find('.modal,.modal-backdrop').addClass('in').css({ 'display':'block'});
        	});
        	
        	// 隐藏研报上传面板
        	scope.hideMaskUploadPdf = function(){
        		element.find('.modal,.modal-backdrop').removeClass('in').css({ 'display':'none'});
        		searchBoxFloat.hide();
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
            //144 wujieming add begin
            var bodyHeight = screen.height;
            //内容输入太长出现滚动条
            function autoScroll(){
        		if(_editor.offsetHeight + 480 >= bodyHeight){
                	_editor.style.height = bodyHeight - 480+'px';
                	_editor.style.overflowY = 'auto';
                }else{
                	_editor.style.height = 'auto';
                }
        	}
            //144 wujieming add end
        	
        	// Editor事件注册
        	_$editor.on('focus', function(e) {
        		e.preventDefault();
                var $this = $(this);
                $this.data('before', $this.html());
                return $this;
            }).on('paste',function(e){
            	e.preventDefault();
            	var pastedText;
            	if (window.clipboardData && window.clipboardData.getData) { // IE
            	    pastedText = window.clipboardData.getData('Text');
            	}else{
            		pastedText = (e.originalEvent || e).clipboardData.getData('text');
            	}
                editor.insertTextAtCursor(CommService.removeHTMLTag(pastedText),false);
            })
            .on('keydown keyup', function(e) {            	
                var $this = $(this);
                if((e.keyCode == 50 || e.keyCode == 52 || e.keyCode == 229) && e.shiftKey){
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
        		//144 wujieming add begin
        		//内容输入太长出现滚动条
        		autoScroll();
        		//144 wujieming add end
            });
        	
        	// 添加@，$
        	scope.addSymbol = function (symbol) {
        		_symbol = symbol;
        		var offset = _$editor.offset(),
        			position = {"x":offset.left+20,"y":offset.top-20+_$editor.outerHeight()};
            	searchBoxFloat.show(position);
                searchBoxFloat.setFilterText({"symbol":symbol,"filterText":"*"});                
                var saveSel = CommService.editor.saveSelection(_editor);
    			start = saveSel.start;
    			end = saveSel.end+1;
    			symbolPos = {'start':start,'end':end};
    			editor.focus(_editor);
    			editor.insertTextAtCursor(symbol,false);
            	isShowSearchBoxFloat = true;
             };
             scope.error = { "status":true,"message":"" };
        	 //发送研报信息
        	 scope.submitPdfContent = function(){
        		var contentModel = _$editor.html();
        		if(!scope.title || !contentModel){
        			scope.error = { "status":false,"message":"请填写研报详细描述或标题"};
        			return;
        		}
        		if(scope.uploaderPdf.queue.length>0){
        			var param = {
                        type: 2,
                        title: scope.title,
                        content: contentModel,
                        file: scope.uploaderPdf.queue[0].url || ''
                    };  
            		ApiService.post(ApiService.getApiUrl().publishCommit,{},param,function(response){
            			if(response.statusCode == 200){
                    		scope.uploaderPdf.queue = [];
                    		scope.uploaderPdf.progress = 0;
                    		scope.title = '';
                    		_$editor.html('');
            				scope.hideMaskUploadPdf();
            				CommService.prepForBroadcast('loadFeeds','uploadPdf => userTrends => loadFeeds;');
            			}
            		},function(response){ 
            			if(response.statusCode == 403){
            				//登录超时，弹出登录框
            				$UserService.timeOutTip(element.find('.btn.btn-info.send-diy'), scope);
            				scope.hideMaskUploadPdf();
                        }else{
            				scope.error = { "status":false,"message":"研报提交失败" };
            			}
            			});
        		}else{
        			scope.error = { "status":false,"message":"请上传研报文件" };
        			return;
        		}
        		$timeout(function(){
            		scope.error = { "status":true,"message":"" };
            	},3000);
        	}        	
            scope.hideMaskUploadPdf();
        }
    }
}]);