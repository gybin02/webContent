'use strict';
var GLHApp = angular.module('GLHApp', [
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'ui.bootstrap',
    'textAngular',
    'ngJcrop',
    'angularFileUpload',
    'dialogs.main'
]);



GLHApp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', 'CommService', 'FileUploader', '$modal', 'ApiService', '$UserService', function (taRegisterTool, taOptions, CommService, FileUploader, $modal, ApiService, $UserService) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('at', {
            iconclass: "fa fa-at",
            action: function () {
                var textAngular = this;
                var _$editor = textAngular.$editor().displayElements.text;
                var _editor = _$editor.get(0);
                var offset = _$editor.offset();
                var editor = CommService.editor;
                var pos = {
                    'x': offset.left + 20,
                    'y': offset.top + 0,
                    'zIndex': 10000,
                    'scopeId': textAngular.$id,
                    '$editor': _editor
                };

                function insertLink() {
//                	textAngular.$editor().wrapSelection('createLink', item, true);
//            		CommService.editor.insertTextAtCursor(item,false);
                    var inputSaveSel = editor.saveSelection(_editor);
                    if (inputSaveSel.start > 0 && inputSaveSel.start == inputSaveSel.end) {
                    	console.log(inputSaveSel);
                        inputSaveSel.start -= 1;
                    }
                    var savedSel = rangy.saveSelection();
                    CommService.prepForBroadcast('setContentModel-scope-' + textAngular.$id, {
                        "item": '@',
                        "control": _editor,
                        "pos": {"start": inputSaveSel.start, "end": inputSaveSel.end},
                        "savedSel": savedSel
                    });
                    CommService.prepForBroadcast('showSearchBoxFloat', pos);
                    CommService.prepForBroadcast('setFilterText', { symbol: "@", filterText: "*"});

                }

                return insertLink("@");
            },
            activeState: function (commonElement) {
                if (commonElement) return commonElement[0].tagName === 'A';
                return false;
            }
        });
        // $ 方法插入
        taRegisterTool('dollar', {
            iconclass: "fa fa-dollar",
            action: function () {
                var textAngular = this;
                var _$editor = textAngular.$editor().displayElements.text;
                
                var _editor = _$editor.get(0);
                var offset = _$editor.offset();
               
                var editor = CommService.editor;
                var pos = {
                    'x': offset.left + 10,
                    'y': offset.top + 30,
                    'zIndex': 10000,
                    'scopeId': textAngular.$id,
                    '$editor': _editor
                };

                function insertLink(item) {
//                	textAngular.$editor().wrapSelection('createLink', item, true);
//            		CommService.editor.insertTextAtCursor(item,false);
                    var inputSaveSel = editor.saveSelection(_editor);
                    var savedSel = rangy.saveSelection();
                    if (inputSaveSel.start > 0 && inputSaveSel.start == inputSaveSel.end) {
                    	console.log(inputSaveSel);
                    	inputSaveSel.start -= 1;
                        console.log(inputSaveSel);
                    }
                    CommService.prepForBroadcast('setContentModel-scope-' + textAngular.$id, {
                        "item": '$',
                        "control": _editor,
                        "pos": {"start": inputSaveSel.start, "end": inputSaveSel.end},
                        "savedSel": savedSel
                    });
                    CommService.prepForBroadcast('showSearchBoxFloat', pos);
                    CommService.prepForBroadcast('setFilterText', { symbol: "$", filterText: "*"});
                }
                return insertLink('$');
            },
            activeState: function (commonElement) {
                if (commonElement) return commonElement[0].tagName === 'A';
                return false;
            }
        });
        taRegisterTool('uploadImage', {
            iconclass: "fa fa-picture-o",
            action: function ($deferred) {
                var textAngular = this;
                var savedSelection = rangy.saveSelection();
                var _$editor = textAngular.$editor().displayElements.text;
                var modalInstance = $modal.open({
                    // Put a link to your template here or whatever
                    template: '<div style="padding:50px">'
                        + '<input type="file" id="textAngular-uploader-image" nv-file-select uploader="textAngularImgUploader" name="files[]" />'
                        + '<div ng-show="showWaiting"><waiting  wait-text="正在上载图片,请稍后……"></waiting></div>'
                        + '</div>',
                    size: 'lg',
                    controller: ['$modalInstance', '$scope',
                        function ($modalInstance, $scope) {
                            $scope.showWaiting = false;
                            var textAngularImgUploader = $scope.textAngularImgUploader = new FileUploader({
                                url: ApiService.getApiUrl().postImage.url
                            });
                            // FILTERS
                            textAngularImgUploader.filters.push({
                                name: 'customFilter',
                                fn: function (item /* {File|FileLikeObject} */, options) {
                                    return this.queue.length < 10;
                                }
                            });

                            textAngularImgUploader.onAfterAddingFile = function (fileItem) {
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
                            textAngularImgUploader.onCompleteItem = function (fileItem, response, status, headers) {
                                if (response.statusCode == 200) {
                                    $scope.showWaiting = false;
                                    $modalInstance.close(response.result);
                                }
                                if (response.statusCode == 417) {
                                    $UserService.timeOutTip($('#textAngular-uploader-image'), textAngular);
                                }
                            }
                        }
                    ]
                });

                modalInstance.result.then(function (imgUrl) {
                    rangy.restoreSelection(savedSelection);
                    textAngular.$editor().wrapSelection('insertImage', imgUrl);
                    _$editor.find();
                    $deferred.resolve();
                });
                return false;
            }
        });
        taOptions.toolbar = [
            ['at', 'dollar', 'uploadImage', 'insertLink'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['bold', 'italics', 'underline']
        ];
        return taOptions;
    }]);
});

GLHApp.filter('datetimeFormat', ['CommService', function (CommService) {
    return function (input) {
        var data = { publishTimeLoc: '' };
        CommService.formatPubTime(data, input);
        return data.publishTimeLoc;
    };
}]);

GLHApp.config(function (ngJcropConfigProvider) {
    ngJcropConfigProvider.setJcropConfig({
        bgColor: 'black',
        bgOpacity: .4,
        aspectRatio: 1
    });

});

//添加通用http请求配置
GLHApp.config(['$httpProvider', function ($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
   
}]);
