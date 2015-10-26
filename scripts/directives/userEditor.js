/**
 * Created by liaozhida on 3/26/2015. Modified by Daniel.zuo on 14/04/2015
 */
GLHApp.directive('userEditor', ['ApiService', 'CommService', 'DialogService', 'FileUploader','$UserService','$timeout',function (ApiService, CommService, DialogService,FileUploader,$UserService,$timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        	show:"@",        	
        	postType:"@",
        	showAction:"@",
        	defaultContent:"@"

        },
        controller: function ($scope,$element) {
            var _editor = $element.find('[contenteditable="true"]').get(0);
            $scope.showWaiting = false;
        	var imgUploader = $scope.imgUploader = new FileUploader({
                url: ApiService.getApiUrl().postImage.url
            });
        	// FILTERS
        	imgUploader.filters.push({
            	name: 'customFilter', 
            	fn: function (item /* {File|FileLikeObject} */,options) {
                    return this.queue.length < 10;
                }
            });

            imgUploader.onAfterAddingFile = function (fileItem) {
                if (fileItem.file.type != "image/png"
                    && fileItem.file.type != "image/jpeg"
                    && fileItem.file.type != "image/gif") {
                    DialogService.launch("notify", "请上传.jpg|.jpeg|.png的图片文件");
                    return;
                }

                if (fileItem.file.size / 1024 / 1024 > 3) {
                    DialogService.launch("notify", "选择的头像大于3M，请重新选择");
                    return;
                }
                $scope.showWaiting = true;
                fileItem.upload();
            };
            
            // 隐藏等待框
            $scope.hideWaitting = function(){
            	$scope.showWaiting = false;
            }
            
            var uploadCommlete = function(imgSrc){
            	$scope.editor.focus(_editor);
            	$scope.editor.insertTextAtCursor('<img src="'+imgSrc+'" style="width:100%;" />');
            }
            
            imgUploader.onCompleteItem = function (fileItem, response, status, headers) {
            	$scope.hideWaitting();
            	if(response.statusCode == 200){
            		uploadCommlete(response.result);
            	}else{
            		DialogService.launch("notify", response.message);
            	}
            };
        },
        templateUrl: "templates/user-editor.html",
        link: function (scope, element, attrs) {

			scope.isSubmit = false;
        	if(scope.defaultContent){
            	element.find(".contenteditable").append(scope.defaultContent);
        	}
            // Modified on 2015-04-14
            // ------------------------
        	var _symbol='',
        		_scopeId = scope.$id,
        		_broadcastId = 0,
        		_$editor = element.find('.userEditor-main > [contenteditable="true"]'),
        		_editor = _$editor.get(0),
        		isShowSearchBoxFloat = false,
        		keyword="*",_keywordPos="",start,end,symbolPos={};
        	
        	var editor = scope.editor = CommService.editor;
        	//定义SearchBoxFloat        	
        	var searchBoxFloat = {
	            // 显示浮动搜索框
    			position:function(pos){
    				return {
    					'x':pos.x,
            			'y':pos.y-80,
            			'zIndex': 10000,
            			'scopeId':_scopeId,
            			'$editor':_editor
        			};
    			},
    			show:function (pos) {
    				var pos = this.position(pos);
    				CommService.prepForBroadcast('showSearchBoxFloat',pos);
    				editor.focus(pos.$editor);
				},
	            hide:function(){
	            	isShowSearchBoxFloat = false;
	            	_symbol = '',keyword='*',symbolPos={};
	            	CommService.prepForBroadcast('hideSearchBoxFloat');
            	},
	            setFilterText:function(filterText){
	            	CommService.prepForBroadcast('setFilterText',filterText);
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
        	
        	// 显示PDF上传
    		scope.showUploadPdf = function () {
    	        ApiService.get(ApiService.getApiUrl().loginTimeOut, {}, function (response) {
    	        	scope.$broadcast('showMaskUploadPdf');
    	            },
    	            function (error) {
    	            	if(error.statusCode == 403){
                    		$UserService.timeOutTip(element.find('.btn.btn-info.send-diy'), scope);
                    	}else{
                     		 scope.post = {showPostAlert:' error open',postStatus:'error',postMsg:error.message}
                     	}
    	            }
    	        );
            }
            // 显示长文本编辑框
            scope.showTextEditor = function () {
            	ApiService.get(ApiService.getApiUrl().loginTimeOut, {}, function(response){
            		//scope.$broadcast('showMaskTextEditor');
            		/*加载最新页面*/
                     window.location="/articleCreate";
            		
            	},
            	function (error){
            		if(error.statusCode == 403){
            			$UserService.timeOutTip(element.find('.btn.btn-info.send-diy'), scope);
            		}else{
            			scope.post = {showPostAlert:' error open',postStatus:'error',postMsg:error.message}
            			
            			}
            	  	}
            	);
        	}
            
            
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
            			var keyword = _$editor.text().substring(symbolPos.start+1,end);
            			searchBoxFloat.setFilterText({'symbol':_symbol,'filterText':keyword ||'*'});
            			return;
            		}
                }
            	searchBoxFloat.hide();
            }
        	
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
            		pastedText = (e.originalEvent || e).clipboardData.getData('text')
            	}
            	pastedText = CommService.removeHTMLTag(pastedText).replace(/[\s|\n|\r]+/,'');
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
            });
        	
            // 文本框清空
            scope.textEditorClear = function(){
                scope.contentModel = '';
                _$editor.html(scope.defaultContent || '');
            }
            // 添加浮动层内容到编辑器
            scope.addSymbolOnMouseClick = function (symbol) {
            	_symbol = symbol;
            	editor.focus(_editor);
            	
            	var offset = _$editor.offset(),
    				position = {"x":offset.left+20,"y":offset.top-20+_$editor.outerHeight()};
            	searchBoxFloat.show(position);
            	searchBoxFloat.setFilterText({"symbol":symbol,"filterText":keyword});
            	
            	editor.insertTextAtCursor(symbol,false);
            	isShowSearchBoxFloat = true;
            	
            	var saveSel = editor.saveSelection(_editor);
    			start = saveSel.start;
    			end = saveSel.end;
    			
    			if(start > 0 && start == end){
    				start -=1;
    			}
    			
    			symbolPos = {'start':start,'end':end};
            };
            // 设置文本框内容
            scope.$on('setContentModel-scope-'+_scopeId, function (e, area) {
            	editor.focus(area.control);
            	editor.restoreSelection(_editor,{"start":start,"end":end});
            	console.log("setContentModel",start,end);
            	editor.insertTextAtCursor(CommService.removeHTMLTag(_symbol+area.item),false);
            	isShowSearchBoxFloat = false;
            	_symbol = '';
            });
            
            scope.$on('hideUserEditor',function(){
            	element.addClass('hide');
            })
            
            scope.$on('showUserEditor',function(){
            	element.removeClass('hide');
            })
            
            // 评论回复广播post id 和组件id
            scope.$on('replyComment-scope-'+_scopeId, function (event,comment) {
            	_broadcastId = comment._broadcastId;        	
                scope.replyPostId = comment.postId;
                scope.replyUserId = comment.userId;
                scope.replyCommentId = comment.commentId;
            });
            var response = {
        		success:function(data){
					scope.isSubmit = false;
            		if(data.statusCode == 200){
                 		 scope.post = {showPostAlert:' success open',postStatus:'big_ok',postMsg:'发表成功'}                             
                 		 CommService.prepForBroadcast('loadFeeds','userEditor=> userTrends => loadFeeds;');
                 		 scope.textEditorClear();

                 	}
                 	$timeout(function(){
                 		 scope.post = {};
                 	},2000);
                },
                error:function(data){
					scope.isSubmit = false;
                	if(data.statusCode == 403){
                		$UserService.timeOutTip(element.find('.btn.btn-info.send-diy'), scope);
                	}else{
                 		 scope.post = {showPostAlert:' error open',postStatus:'error',postMsg:data.message}
                 	}
                	$timeout(function(){
                		 scope.post = {};
                	},2000);
                }
            };
            
            // 評論提交
            scope.submitComment = function (scopeId) {
				scope.isSubmit = true;
            	if (!scope.replyPostId) {
            		var param = {
                          "type": 0,
                          "title": '',
                          "content": _$editor.html()?_$editor.html():undefined,
                          "file": ''
            		};
        			ApiService.post(ApiService.getApiUrl().publishCommit,{},param,response.success,response.error);
            	}else{
            		if(scopeId ==_broadcastId){
            			var param = {
        					"content": _$editor.html()?_$editor.html():undefined,
        					"replyUid": scope.replyUserId,
        					"replyCommentId": scope.replyCommentId
            			};
            			if(param.content){
            				ApiService.post(ApiService.getApiUrl().addComment,{postId:scope.replyPostId},param,response.success,response.error);
            			}else{
            				var data = {"message":"回复内容为空!"};
            				response.error(data);
            			}
                	}
            	}
            }
        }
    }
}]);
