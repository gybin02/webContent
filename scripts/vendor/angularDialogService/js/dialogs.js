(function () {
    "use strict";
    var MESSAGE = {
        DIALOGS_ERROR: "错误",
        DIALOGS_ERROR_MSG: "发生未知错误.",
        DIALOGS_CLOSE: "关闭",
        DIALOGS_PLEASE_WAIT: "请等待",
        DIALOGS_PLEASE_WAIT_ELIPS: "请等待...",
        DIALOGS_PLEASE_WAIT_MSG: "等待操作完成.",
        DIALOGS_PERCENT_COMPLETE: "% 完成",
        DIALOGS_NOTIFICATION: "提示",
        DIALOGS_NOTIFICATION_MSG: "未知应用提示.",
        DIALOGS_CONFIRMATION: "确认",
        DIALOGS_CONFIRMATION_MSG: "确认所需.",
        DIALOGS_OK: "确定",
        DIALOGS_YES: "是",
        DIALOGS_NO: "否"
    };

    var ctrlrs = angular.module('dialogs.controllers', ['ui.bootstrap.modal']);

    /**
     * Error Dialog Controller
     */
    ctrlrs.controller('errorDialogCtrl', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
        //-- Variables -----//
        $scope.MESSAGE = MESSAGE;
        $scope.header = (angular.isDefined(data.header)) ? data.header : MESSAGE.DIALOGS_ERROR;
        $scope.msg = (angular.isDefined(data.msg)) ? data.msg : MESSAGE.DIALOGS_ERROR_MSG;
        $scope.icon = (angular.isDefined(data.fa) && angular.equals(data.fa, true)) ? 'fa fa-warning' : 'glyphicon glyphicon-warning-sign';

        //-- Methods -----//

        $scope.close = function () {
            $modalInstance.close();
            $scope.$destroy();
        };
    }]);

    /**
     * Wait Dialog Controller
     */
    ctrlrs.controller('waitDialogCtrl', ['$scope', '$modalInstance', '$timeout', 'data', function ($scope, $modalInstance, $timeout, data) {
        //-- Variables -----//
        $scope.MESSAGE = MESSAGE;
        $scope.header = (angular.isDefined(data.header)) ? data.header : MESSAGE.DIALOGS_PLEASE_WAIT_ELIPS;
        $scope.msg = (angular.isDefined(data.msg)) ? data.msg : MESSAGE.DIALOGS_PLEASE_WAIT_MSG;
        $scope.progress = (angular.isDefined(data.progress)) ? data.progress : 100;
        $scope.icon = (angular.isDefined(data.fa) && angular.equals(data.fa, true)) ? 'fa fa-clock-o' : 'glyphicon glyphicon-time';

        //-- Listeners -----//
        // Note: used $timeout instead of $scope.$apply() because I was getting a $$nextSibling error
        // close wait dialog
        $scope.$on('dialogs.wait.complete', function () {
            $timeout(function () {
                $modalInstance.close();
                $scope.$destroy();
            });
        }); // end on(dialogs.wait.complete)

        // update the dialog's message
        $scope.$on('dialogs.wait.message', function (evt, args) {
            $scope.msg = (angular.isDefined(args.msg)) ? args.msg : $scope.msg;
        }); // end on(dialogs.wait.message)

        // update the dialog's progress (bar) and/or message
        $scope.$on('dialogs.wait.progress', function (evt, args) {
            $scope.msg = (angular.isDefined(args.msg)) ? args.msg : $scope.msg;
            $scope.progress = (angular.isDefined(args.progress)) ? args.progress : $scope.progress;
        }); // end on(dialogs.wait.progress)

        //-- Methods -----//

        $scope.getProgress = function () {
            return {'width': $scope.progress + '%'};
        }; // end getProgress

    }]); // end WaitDialogCtrl

    /**
     * Notify Dialog Controller
     */
    ctrlrs.controller('notifyDialogCtrl', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
        //-- Variables -----//
        $scope.MESSAGE = MESSAGE;
        $scope.header = (angular.isDefined(data.header)) ? data.header : MESSAGE.DIALOGS_NOTIFICATION;
        $scope.msg = (angular.isDefined(data.msg)) ? data.msg : MESSAGE.DIALOGS_NOTIFICATION_MSG;
        $scope.icon = (angular.isDefined(data.fa) && angular.equals(data.fa, true)) ? 'fa fa-info' : 'glyphicon glyphicon-info-sign';

        //-- Methods -----//

        $scope.close = function () {
            $modalInstance.close();
            $scope.$destroy();
        }; // end close
    }]); // end WaitDialogCtrl

    /**
     * Confirm Dialog Controller
     */
    ctrlrs.controller('confirmDialogCtrl', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
        //-- Variables -----//
        $scope.MESSAGE = MESSAGE;
        $scope.header = (angular.isDefined(data.header)) ? data.header : MESSAGE.DIALOGS_CONFIRMATION;
        $scope.msg = (angular.isDefined(data.msg)) ? data.msg : MESSAGE.DIALOGS_CONFIRMATION_MSG;
        $scope.icon = (angular.isDefined(data.fa) && angular.equals(data.fa, true)) ? 'fa fa-check' : 'glyphicon glyphicon-check';

        //-- Methods -----//

        $scope.no = function () {
            $modalInstance.dismiss('no');
        }; // end close

        $scope.yes = function () {
            $modalInstance.close('yes');
        }; // end yes
    }]); // end ConfirmDialogCtrl / dialogs.controllers
//== Services ================================================================//

    angular.module('dialogs.services', ['ui.bootstrap.modal', 'dialogs.controllers'])

        .provider('dialogs', [function () {
            var _b = true; // backdrop
            var _k = true; // keyboard
            var _w = 'dialogs-default'; // windowClass
            var _copy = true; // controls use of angular.copy
            var _wTmpl = null; // window template
            var _wSize = 'sm'; // large modal window default

            var _fa = false; // fontawesome flag

            var _setOpts = function (opts) {
                var _opts = {};
                opts = opts || {};
                _opts.kb = (angular.isDefined(opts.keyboard)) ? opts.keyboard : _k; // values: true,false
                _opts.bd = (angular.isDefined(opts.backdrop)) ? opts.backdrop : _b; // values: 'static',true,false
                _opts.ws = (angular.isDefined(opts.size) && (angular.equals(opts.size, 'sm') || angular.equals(opts.size, 'lg') || angular.equals(opts.size, 'md'))) ? opts.size : _wSize; // values: 'sm', 'lg', 'md'
                _opts.wc = (angular.isDefined(opts.windowClass)) ? opts.windowClass : _w; // additional CSS class(es) to be added to a modal window

                return _opts;
            }; // end _setOpts

            /**
             * Use Backdrop
             *
             * Sets the use of the modal backdrop.  Either to have one or not and
             * whether or not it responds to mouse clicks ('static' sets the
             * backdrop to true and does not respond to mouse clicks).
             *
             * @param    val    mixed    (true, false, 'static')
             */
            this.useBackdrop = function (val) { // possible values : true, false, 'static'
                if (angular.isDefined(val))
                    _b = val;
            }; // end useStaticBackdrop

            /**
             * Use ESC Close
             *
             * Sets the use of the ESC (escape) key to close modal windows.
             *
             * @param    val    boolean
             */
            this.useEscClose = function (val) { // possible values : true, false
                if (angular.isDefined(val))
                    _k = (!angular.equals(val, 0) && !angular.equals(val, 'false') && !angular.equals(val, 'no') && !angular.equals(val, null) && !angular.equals(val, false)) ? true : false;
            }; // end useESCClose

            /**
             * Use Class
             *
             * Sets the additional CSS window class of the modal window template.
             *
             * @param    val    string
             */
            this.useClass = function (val) {
                if (angular.isDefined(val))
                    _w = val;
            }; // end useClass

            /**
             * Use Copy
             *
             * Determines the use of angular.copy when sending data to the modal controller.
             *
             * @param    val    boolean
             */
            this.useCopy = function (val) {
                if (angular.isDefined(val))
                    _copy = (!angular.equals(val, 0) && !angular.equals(val, 'false') && !angular.equals(val, 'no') && !angular.equals(val, null) && !angular.equals(val, false)) ? true : false;
            }; // end useCopy

            /**
             * Set Window Template
             *
             * Sets a path to a template to use overriding modal's window template.
             *
             * @param    val    string
             */
            this.setWindowTmpl = function (val) {
                if (angular.isDefined(val))
                    _wTmpl = val;
            }; // end setWindowTmpl

            /**
             * Set Size
             *
             * Sets the modal size to use (sm,lg,md), requires Angular-ui-Bootstrap 0.11.0 and Bootstrap 3.1.0 +
             *
             * @param    val    string (sm,lg,md)
             */
            this.setSize = function (val) {
                if (angular.isDefined(val))
                    _wSize = (angular.equals(val, 'sm') || angular.equals(val, 'lg') || angular.equals(val, 'md')) ? val : _wSize;
            }; // end setSize

            /**
             * Use Font-Awesome.
             *
             * Sets Font-Awesome flag to true and substitutes font-awesome icons for
             * Bootstrap's glyphicons.
             */
            this.useFontAwesome = function () {
                _fa = true;
            }; // end useFontAwesome


            this.$get = ['$modal', function ($modal) {

                return {
                    /**
                     * Error Dialog
                     *
                     * @param    header    string
                     * @param    msg    string
                     * @param    opts    object
                     */
                    error: function (header, msg, opts) {
                        opts = _setOpts(opts);

                        return $modal.open({
                            templateUrl: '/dialogs/error.html',
                            controller: 'errorDialogCtrl',
                            backdrop: opts.bd,
                            keyboard: opts.kb,
                            windowClass: opts.wc,
                            size: opts.ws,
                            resolve: {
                                data: function () {
                                    return {
                                        header: angular.copy(header),
                                        msg: angular.copy(msg),
                                        fa: _fa
                                    };
                                }
                            }
                        }); // end modal.open
                    }, // end error

                    /**
                     * Wait Dialog
                     *
                     * @param    header        string
                     * @param    msg        string
                     * @param    progress    int
                     * @param    opts    object
                     */
                    wait: function (header, msg, progress, opts) {
                        opts = _setOpts(opts);

                        return $modal.open({
                            templateUrl: '/dialogs/wait.html',
                            controller: 'waitDialogCtrl',
                            backdrop: opts.bd,
                            keyboard: opts.kb,
                            windowClass: opts.wc,
                            size: opts.ws,
                            resolve: {
                                data: function () {
                                    return {
                                        header: angular.copy(header),
                                        msg: angular.copy(msg),
                                        progress: angular.copy(progress),
                                        fa: _fa
                                    };
                                }
                            }
                        }); // end modal.open
                    }, // end wait

                    /**
                     * Notify Dialog
                     *
                     * @param    header        string
                     * @param    msg        string
                     * @param    opts    object
                     */
                    notify: function (header, msg, opts) {
                        opts = _setOpts(opts);

                        return $modal.open({
                            templateUrl: '/dialogs/notify.html',
                            controller: 'notifyDialogCtrl',
                            backdrop: opts.bd,
                            keyboard: opts.kb,
                            windowClass: opts.wc,
                            size: opts.ws,
                            resolve: {
                                data: function () {
                                    return {
                                        header: angular.copy(header),
                                        msg: angular.copy(msg),
                                        fa: _fa
                                    };
                                }
                            }
                        }); // end modal.open
                    }, // end notify

                    /**
                     * Confirm Dialog
                     *
                     * @param    header    string
                     * @param    msg    string
                     * @param    opts    object
                     */
                    confirm: function (header, msg, opts) {
                        opts = _setOpts(opts);

                        return $modal.open({
                            templateUrl: '/dialogs/confirm.html',
                            controller: 'confirmDialogCtrl',
                            backdrop: opts.bd,
                            keyboard: opts.kb,
                            windowClass: opts.wc,
                            size: opts.ws,
                            resolve: {
                                data: function () {
                                    return {
                                        header: angular.copy(header),
                                        msg: angular.copy(msg),
                                        fa: _fa
                                    };
                                }
                            }
                        }); // end modal.open
                    }, // end confirm

                    /**
                     * Create Custom Dialog
                     *
                     * @param    url    string
                     * @param    ctrlr    string
                     * @param    data    object
                     * @param    opts    object
                     */
                    create: function (url, ctrlr, data, opts) {
                        var copy = (opts && angular.isDefined(opts.copy)) ? opts.copy : _copy;
                        opts = _setOpts(opts);

                        return $modal.open({
                            templateUrl: url,
                            controller: ctrlr,
                            keyboard: opts.kb,
                            backdrop: opts.bd,
                            windowClass: opts.wc,
                            size: opts.ws,
                            resolve: {
                                data: function () {
                                    if (copy)
                                        return angular.copy(data);
                                    else
                                        return data;
                                }
                            }
                        }); // end modal.open
                    } // end create

                }; // end return

            }]; // end $get
        }]); // end provider dialogs
//== Dialogs.Main Module =====================================================//

    /**
     * Include this module 'dialogs.main' in your module's dependency list where you
     * intend to use it.  Then inject the 'dialogs' service in your controllers that
     * need it.
     */

    angular.module('dialogs.main', ['dialogs.services'])

        .config(['dialogsProvider', function (dialogsProvider) {

            try {
                var _sheets = document.styleSheets;

                sheetLoop:
                    for (var i = (_sheets.length - 1); i >= 0; i--) {
                        var _matches = null;
                        var _rules = null;

                        if (!_sheets[i].disabled) {
                            // check href of style sheet first
                            if (_sheets[i].href !== null)
                                _matches = _sheets[i].match(/font\-*awesome/i);

                            if (angular.isArray(_matches)) {
                                dialogsProvider.useFontAwesome();
                                break;
                            } else {
                                // try to find css rule .fa, in case style sheet has been concatenated
                                _rules = _sheets[i].cssRules;
                                for (var x = (_rules.length - 1); x >= 0; x--) {
                                    if (_rules[x].selectorText.toLowerCase() == '.fa') {
                                        dialogsProvider.useFontAwesome();
                                        break sheetLoop; // done, exit both for loops
                                    }
                                }
                            }
                        } // end if(disabled)
                    } // end for


            } catch (err) {
                // console.log('Error Message: ' + err);
            }
        }]) // end config

        // Add default templates via $templateCache
        .run(['$templateCache', '$interpolate', function ($templateCache, $interpolate) {

            // get interpolation symbol (possible that someone may have changed it in their application instead of using '{{}}')
            var startSym = $interpolate.startSymbol();
            var endSym = $interpolate.endSymbol();

            $templateCache.put('/dialogs/error.html', '<div class="modal-header dialog-header-error"><button type="button" class="close" ng-click="close()">&times;</button><h4 class="modal-title text-danger"><span class="' + startSym + 'icon' + endSym + '"></span> <span ng-bind-html="header"></span></h4></div><div class="modal-body text-danger" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn-blue dialog-btn" ng-click="close()">' + startSym + 'MESSAGE.DIALOGS_CLOSE' + endSym + '</button></div>');
            $templateCache.put('/dialogs/wait.html', '<div class="modal-header dialog-header-default"><h4 class="modal-title"><span class="' + startSym + 'icon' + endSym + '"></span> ' + startSym + 'header' + endSym + '</h4></div><div class="modal-body"><p ng-bind-html="msg"></p><div class="progress progress-striped active"><div class="progress-bar progress-bar-info" ng-style="getProgress()"></div><span class="sr-only">' + startSym + 'progress' + endSym + '' + startSym + 'MESSAGE.DIALOGS_PERCENT_COMPLETE' + endSym + '</span></div></div>');
            $templateCache.put('/dialogs/notify.html', '<div class="modal-header dialog-header-default"><button type="button" class="close" ng-click="close()" class="pull-right">&times;</button><h4 class="modal-title text-info"><span class="' + startSym + 'icon' + endSym + '"></span> ' + startSym + 'header' + endSym + '</h4></div><div class="modal-body text-info" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn-blue dialog-btn" ng-click="close()">' + startSym + 'MESSAGE.DIALOGS_OK' + endSym + '</button></div>');
            $templateCache.put('/dialogs/confirm.html', '<div class="modal-header dialog-header-default"><button type="button" class="close" ng-click="no()">&times;</button><h4 class="modal-title"><span class="' + startSym + 'icon' + endSym + '"></span> ' + startSym + 'header' + endSym + '</h4></div><div class="modal-body" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn-gray dialog-btn" ng-click="yes()">' + startSym + 'MESSAGE.DIALOGS_YES' + endSym + '</button><button type="button" class="btn-blue dialog-btn" ng-click="no()">' + startSym + 'MESSAGE.DIALOGS_NO' + endSym + '</button></div>');
        }]); // end run / dialogs.main
})();