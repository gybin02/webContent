/*
 * Created by Daniel.zuo on 4/15/2015
 * */
GLHApp.directive("textEditorBeta", ["$timeout", "$UserService", "ApiService", "CommService",
	function($timeout, $UserService, ApiService, CommService) {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function($scope) {},
			templateUrl: "templates/secondEdition/text-editor-beta.html",
			link: function(scope, element, attrs) {
				if ($UserService.isLoggedIn()) {
					scope.userAvatar = $UserService.getUser().user.avatar;
					scope.userNick = $UserService.getUser().user.nickname;
				}

				var _scopeId = scope.$id,
					_$editor = element.find('#bb-content-editor'),
					_editor = _$editor.get(0),
					isShowSearchBoxFloat = false,
					_symbol, keyword = "*",
					savedSel, savedSelActiveElement, start, end, symbolPos = {};
				var selection = scope.selection = {
					save: function() {
						// Remove markers for previously saved selection
						if (savedSel) {
							rangy.removeMarkers(savedSel);
						}
						savedSel = rangy.saveSelection();
						savedSelActiveElement = document.activeElement;
					},
					restore: function() {
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
					position: function(pos) {
						return {
							'x': pos.x,
							'y': pos.y + 20,
							'zIndex': 100000,
							'scopeId': _scopeId,
							'$editor': _editor
						};
					},
					show: function(pos) {
						var pos = this.position(pos);
						CommService.prepForBroadcast('showSearchBoxFloat', pos);
						editor.focus(_editor);
					},
					hide: function() {
						isShowSearchBoxFloat = false;
						_symbol = "";
						keyword = "*";
						CommService.prepForBroadcast('hideSearchBoxFloat');
					},
					setFilterText: function(filter) {
						CommService.prepForBroadcast('setFilterText', filter);
					},
					setPosition: function() {
						var cursorPos = editor.searchBoxFloatPosition();
						this.show(cursorPos.startPos);
						var saveSel = editor.saveSelection(_editor);
						// 鼠标添加 符号后模糊搜索
						start = saveSel.start > 0 ? saveSel.start - 1 : saveSel.start;
						end = saveSel.end;
						isShowSearchBoxFloat = true;
					}
				};
				// 设置文本框内容
				scope.$on('setContentModel-scope-' + _scopeId, function(e, area) {
					editor.restoreSelection(area.control, {
						"start": start,
						"end": end
					});
					editor.focus(area.control);
					editor.insertTextAtCursor(_symbol + area.item, false);
					isShowSearchBoxFloat = false;
					_symbol = "";
				});
				// 显示面板
				scope.$on('showMaskShortMsg', function(event) {
					document.body.style.overflow = "hidden";
					element.css({
						"display": "block",
						"background-color": "rgba(0,0,0,.5)"
					});
				});
				
				// 个股页显示面板
				scope.$on('showStockShortMsg', function(event, stockName, stockCode) {
					document.body.style.overflow = "hidden";
					element.css({
						"display": "block",
						"background-color": "rgba(0,0,0,.5)"
					});
					_$editor.html("$"+stockName+"("+stockCode+")$&nbsp;");
				});

				// 隐藏面板
				scope.hideTextEditor = function() {
					searchBoxFloat.hide();
					element.css({
						"display": "none"
					});
					document.body.removeAttribute("style");
				};

				function isSymbol(newSaveSel) {
					var symbol = _$editor.text().substring(symbolPos.start, symbolPos.end);
					return ['@', '$'].indexOf(symbol) > -1;
				}

				function getSymbolText() {
					var newSaveSel = editor.saveSelection(_editor);
					start = newSaveSel.start - 1;
					end = newSaveSel.end;
					var inputValue = _$editor.text().substring(start, end);

					if (['@', '$'].indexOf(inputValue) > -1) {
						symbolPos = {
							"start": start,
							"end": end
						};
						_symbol = inputValue;
						isShowSearchBoxFloat = true;
						searchBoxFloat.setPosition();
					} else {
						if (element.hasClass('hide')) {
							searchBoxFloat.hide();
						}
					}
				}



				function triggerChange() {
						var newSaveSel = editor.saveSelection(_editor);
						if (isShowSearchBoxFloat && newSaveSel.end > 0) {
							if (start > end && end > 0) {
								start = end - 1;
							}
							end = newSaveSel.end;
							if (isSymbol(newSaveSel) && symbolPos && symbolPos.end <= end && !/\s+/.test(keyword)) {
								var keyword = _$editor.text().substring(symbolPos.start, end);
								searchBoxFloat.setFilterText({
									'symbol': _symbol,
									'filterText': keyword || '*'
								});
								return;
							}
						}
						searchBoxFloat.hide();
					}
					//144 wujieming add begin
				var bodyHeight = screen.height;
				//内容输入太长出现滚动条
				function autoScroll() {
						if (_editor.offsetHeight + 480 >= bodyHeight) {
							_editor.style.height = bodyHeight - 480 + 'px';
							_editor.style.overflowY = 'auto';
						} else {
							_editor.style.height = 'auto';
						}
					}
					//检查次数

				function calcByteCount(str) {
					var StrLength = str.length;
					var ByteCount = 0;
					for (i = 0; i < StrLength; i++) {
						ByteCount = (str.charCodeAt(i) < 256) ? ByteCount + 1 : ByteCount + 2;

					}
					return ByteCount;


				}

				// Editor事件注册
				_$editor.on('focus', function(e) {
						e.preventDefault();
						var $this = $(this);
						$this.data('before', $this.html());
						return $this;
					}).on('paste', function(e) {
						e.preventDefault();
						var pastedText;
						if (window.clipboardData && window.clipboardData.getData) { // IE
							pastedText = window.clipboardData.getData('Text');
						} else {
							pastedText = (e.originalEvent || e).clipboardData.getData('text');
						}
						editor.insertTextAtCursor(CommService.removeHTMLTag(pastedText), false);
					})
					.on('keydown keyup', function(e) {
						var $this = $(this);
						if ((e.keyCode == 50 || e.keyCode == 52 || e.keyCode == 229) && e.shiftKey) {
							getSymbolText();
						}
						if ($this.data('before') !== $this.html()) {
							$this.data('before', $this.html());
							$this.trigger('change');
						}
						var numb = $(".word-number");
						numb.text(188 - $this.text().length);
						if (parseInt(numb.text()) <= 0) {
							console.log(numb.text());
							$("span.word-number").css({
								"color": "#FF0000"
							});
						} else {
							$("span.word-number").css({
								"color": "#333"
							});
						}

						return $this;
					})
					.on('blur', function(e) {
						e.preventDefault();
						isShowSearchBoxFloat = false;
					})
					.on('change', function(e) {
						e.preventDefault();
						triggerChange();
						autoScroll();

					});

				// 添加@，$
				scope.addSymbols = function(symbol) {
					_symbol = symbol;
					var offset = $("#bb-content-editor").offset(),
						position = {
							"x": offset.left + 20,
							"y": offset.top - 20 + _$editor.outerHeight()
						};
					searchBoxFloat.show(position);
					searchBoxFloat.setFilterText({
						"symbol": symbol,
						"filterText": "*"
					});
					var saveSel = CommService.editor.saveSelection(_editor);
					start = saveSel.start;
					end = saveSel.end + 1;
					symbolPos = {
						'start': start,
						'end': end
					};
					editor.focus(_editor);
					editor.insertTextAtCursor(symbol, false);
					isShowSearchBoxFloat = true;
				};
				scope.error = {
					"status": true,
					"message": ""
				};
				//此处加一个隐藏搜索窗的代码，暂时没有想到好的办法--lizhongyi 2015-09-23
				 $(document).click(function(e) {var e = e || window.event,
					target = e.srcElement || e.target;
					if (target.className != 'ng-untouched ng-valid ta-bind ng-dirty ng-valid-parse' && 
					    target.id!="bb-content-editor" &&
					    target.name != 'at' &&
					    target.name != 'dollar' &&
					    target.className!="fa fa-at" &&
					    target.className!="fa fa-dollar"&&
					    target.className!="dollar"&&
					    target.className!="at"&&
					    target.className!="form-control contenteditable wordwrap"
					 ) {
                      searchBoxFloat.hide();
					}
                })

				// 提交文本
				scope.submitCommit = function() {
					var param = {
						type: 0,
						/*title: scope.textTitle,*/
						content: _$editor.html(),
						file: ''
					}
					contents = $.trim(_$editor.html().replace(/<\/?[^>]*>/g, '').replace(/&nbsp;/ig, '')); //禁止空文本提交
					if (contents) {
						if(contents.length>188){
						scope.error = {
							"status": false,
							"message": "字数超出了限制"
						};
						return;
						}
						$("#submit-btn-1").attr("disabled", 'disabled'); 
						$("#submit-btn-1").text("正在发表...")
						ApiService.post(ApiService.getApiUrl().articleCommit, {}, param, function(response) {
							if (response.statusCode == 200) {
								$("#short-form").hide();
								$(".success-window").show();
								/*创建定时器，还有一个动画，我觉得是没必要的*/
								var sec=5;
								var autoBack=setInterval(function(){
									sec--;
									$(".mien").text(sec);
									if(sec==0){
										clearInterval(autoBack);
										scope.hideTextEditor();
										
									}
								},1000);
								$(".modal.short .modal-content").css("background","#22AEE6");
								$(".success-window a.detail-link").
								attr('href', '/p/' + $.trim(response.result)+".html");
								setTimeout(function() {
									/*还原初始状态*/
									scope.htmlContent = scope.textTitle = '';
									$("#submit-btn-1").removeAttr('disabled'); 
									$(".modal.short .modal-content").css("background","#FFF");
									$("#submit-btn-1").text('发表'); 
									$(".success-window").hide();
									$("#short-form").show();
									$(".mien").text(5);
	
								}, 5000)
								CommService.prepForBroadcast('loadFeeds', 'uploadPdf => userTrends => loadFeeds;');
							} else if (response.statusCode == 403) {
								$("#submit-btn-1").removeAttr('disabled'); 
								$UserService.authPage(scope);
							}
						});
					} else {
						scope.error = {
							"status": false,
							"message": "请填写内容"
						};
						$("#submit-btn-1").removeAttr('disabled'); //恢复按钮可点
						$("#submit-btn-1").text('发表'); //恢复按钮可点
						$timeout(function() {
							scope.error = {
								"status": true,
								"message": ""
							};
						}, 3000);
					}
				};
			}
		}
	}
]);