/**
 * Created by daniel.zuo on 4/17/2015.
 *
 * 公共服务
 */
GLHApp.service('CommService', ['$rootScope','$location', "$window","$UserService",'ApiService', function ($rootScope,$location,$window,$UserService,ApiService) {
    var service = {};
    //格式化发布时间
    service.formatPubTime = function (data, publishTime) {
        var date = new Date()
        var tmpTime = publishTime * 1000;
        var time = Math.floor(date.getTime() / 1000);
        var publishTime = time - publishTime;
        if (publishTime < 60) {
            data.publishTimeLoc = "刚刚";
        } else if (60 <= publishTime && publishTime < 60 * 60) {
            var publicLoc = Math.floor(publishTime / 60);
            data.publishTimeLoc = publicLoc + "分钟前";
        } else if (publishTime >= 60 * 60 && publishTime < 24 * 60 * 60) {
            var publicLoc = Math.floor(publishTime / 3600);
            data.publishTimeLoc = publicLoc + "小时前";
        } else if (publishTime >= 24 * 60 * 60 && publishTime < 10 * 24 * 60 * 60) {
            var publicLoc = Math.floor(publishTime / 86400);
            data.publishTimeLoc = publicLoc + "天前";
        } else {
            var resultDate = new Date(tmpTime);
            var year = resultDate.getFullYear();
            var month = resultDate.getMonth();
            month += 1;
            var day = resultDate.getDate();
            data.publishTimeLoc = year + "年" + month + "月" + day + "日";
        }
    }

    //过滤html
    service.removeHTMLTag = function (str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
        return str;
    }
    
    service.isIE = function(){
    	var ua= navigator.userAgent, tem, M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    	   if(/trident/i.test(M[1])){
    	       tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
    	       return true;
    	   }
    	   return false;
    }
    

    // textEditor 焦点
    service.editor = {
        focus: function (el) {
            try {
                if (document.activeElement != el) {
                    el.focus();
                }
                if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.setCursor(false, true);
                    range.selectNodeContents(el);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.setCursor(false, true);
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }

            } catch (e) {
            }
        },
        input: function (e) {
            if (97 <= e.charCode && e.charCode <= 122 || 48 <= e.charCode && e.charCode <= 57) {
                //console.log('过滤筛选',e.charCode,e.keyCode);
                return e.key;
            }
        },
        watchInput: function (e) {
            if (e.keyCode == 50 && e.shiftKey) {
                return {
                    _filterText: "''",
                    _symbol: '@'
                };
            }
            if (e.keyCode == 52 && e.shiftKey) {
                return {
                    _filterText: "''",
                    _symbol: '$'
                };
            }
        },
        searchBoxFloatPosition: function () {
        	var userSelection,startPos,endPos;
        	if (service.isIE()) {
        		var _editor = document.activeElement;
        		var offset = _editor.offsetParent;
        		startPos = {'x':offset.offsetLeft,'y':offset.offsetTop+offset.offsetHeight -20};
        		endPos = startPos;
        	}else{
        		startPos = rangy.getSelection().getStartDocumentPos();
                endPos = rangy.getSelection().getEndDocumentPos(); 
        	}
            return { "startPos": startPos, "endPos": endPos };
        },
        textFilter: function (str) {
            return str.replace(decodeURIComponent('%E2%80%8B'), '').replace('&#8203;', '').replace(decodeURIComponent('%E2%80%8D'), '').replace(decodeURIComponent('%27'), '');
        },
        // 设置ContentEditable 光标位置插入html
        insertTextAtCursor: function (html, selectPastedContent) {
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();

                    // Range.createContextualFragment() would be useful here but is
                    // only relatively recently standardized and is not supported in
                    // some browsers (IE9, for one)
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    var firstNode = frag.firstChild;
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        //range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        if (selectPastedContent) {
                            range.setStartBefore(firstNode);
                        } else {
                            range.collapse(true);
                        }
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if ((sel = document.selection) && sel.type != "Control") {
                // IE < 9
                var originalRange = sel.createRange();
                originalRange.collapse(true);
                sel.createRange().pasteHTML(html);
                if (selectPastedContent) {
                    range = sel.createRange();
                    range.setEndPoint("StartToStart", originalRange);
                    range.select();
                }
            }
        },
        saveSelection: function (containerEl) {
            if (window.getSelection && document.createRange) {
                var range = window.getSelection().getRangeAt(0);
                var preSelectionRange = range.cloneRange();
                preSelectionRange.selectNodeContents(containerEl);
                preSelectionRange.setEnd(range.startContainer, range.startOffset);
                var start = preSelectionRange.toString().length;
                return {
                    start: start,
                    end: start + range.toString().length
                }
            } else if (document.selection && document.body.createTextRange) {
                var selectedTextRange = document.selection.createRange();
                var preSelectionTextRange = document.body.createTextRange();
                preSelectionTextRange.moveToElementText(containerEl);
                preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
                var start = preSelectionTextRange.text.length;
                return {
                    start: start,
                    end: start + selectedTextRange.text.length
                }
            }
        },
        restoreSelection: function (containerEl, savedSel) {
            if (window.getSelection && document.createRange) {
                var charIndex = 0, range = document.createRange();
                range.setStart(containerEl, 0);
                range.collapse(true);
                var nodeStack = [containerEl], node, foundStart = false, stop = false;

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType == 3) {
                        var nextCharIndex = charIndex + node.length;
                        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                            range.setStart(node, savedSel.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                            range.setEnd(node, savedSel.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        var i = node.childNodes.length;
                        while (i--) {
                            nodeStack.push(node.childNodes[i]);
                        }
                    }
                }
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && document.body.createTextRange) {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(containerEl);
                textRange.collapse(true);
                textRange.moveEnd("character", savedSel.end);
                textRange.moveStart("character", savedSel.start);
                textRange.select();
            }
        }
    }


    //共享调用服务
    service.prepForBroadcast = function (command, params) {
        $rootScope.$broadcast(command, params);
    };
    
    service.newRec = function(){
    	service.prepForBroadcast("newFeeds",$rootScope.result.newFeeds);
    }
    
    service.changeTab = function(){
    	var path = $location.path();
    	if(/user*/g.test(path)){
    		$rootScope.result.newRecCount = 0;
        }if(path == '/userMessage'){
        	$rootScope.result.newRecCount = $rootScope.result.newRecMsg = 0;
        }if(path == '/commentMe'){
        	$rootScope.result.newRecCount = $rootScope.result.newRecComment = 0;
        }if(path == '/referMe'){
        	$rootScope.result.newRecCount = $rootScope.result.newRecCallme = 0;
        }if(path == '/userFans'){
        	$rootScope.result.newRecCount = $rootScope.result.newFollowers = 0;
        }
        service.newRec();
    }
    
    // 
    service.asyncUnreadMsg = function(){
    	ApiService.get(ApiService.getApiUrl().getUserStatus,{},
    			function(response){
    				
            		if(response.statusCode == 200){            			
            			$rootScope.result = response.result;
            			$rootScope.result.newRecCount = response.result.newRecMsg 
            					+ response.result.newRecComment 
            					+ response.result.newRecCallme 
            					+ response.result.newFollowers
            					+ response.result.newFeeds;
            			service.changeTab();
            		}else if(response.statusCode == 403){
            			//
            		}
            	},
    			function(response){
    				//检测用户是否登录 
    				if(response.statusCode==403){
    					$UserService.logOut();
                    }
    			});
    }
    return service;
}]);

//设置默认图片
function setDefaultImg(e) {
    e.src = '../images/default.jpg';
    e.onerror = null;//控制onerror事件只触发一次

}
