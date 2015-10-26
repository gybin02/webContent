/*
 * create by daniel.zuo on 4/24/2015
 */

GLHApp.service('DialogService', ['$timeout', 'dialogs', function ($timeout, dialogs) {
    var service = {};
    var title = "格隆汇--港股那点事";
    service.launch = function (which, msg) {
        switch (which) {
            case 'error':
                dialogs.error(title, msg);
                break;
            case 'wait':
                service.wait = dialogs.wait(undefined, undefined, _progress);
                _fakeWaitProgress();
                break;
            case 'customwait':
                service.customwait = dialogs.wait('??', '???', _progress);
                _fakeWaitProgress();
                break;
            case 'notify':
                dialogs.notify(title, msg);
                break;
            case 'confirm':
                var dlg = dialogs.confirm(title, msg);
                dlg.result.then(function (btn) {
                    //$scope.confirmed = 'You confirmed "Yes."';
                    service.confirm = {status: true};
                    if (service.confirmYes) {
                        service.confirmYes();
                    }
                }, function (btn) {
                    //$scope.confirmed = 'You confirmed "No."';
                    service.confirm = {status: false};
                });
                break;
            case 'custom':
                var dlg = dialogs.create('/dialogs/custom.html', 'customDialogCtrl', {}, {
                    size: 'lg',
                    keyboard: true,
                    backdrop: false,
                    windowClass: 'my-class'
                });
                dlg.result.then(function (name) {
                    //$scope.name = name;
                    service.custom = {name: name};
                }, function () {
                    if (angular.equals($scope.name, ''))
                    //$scope.name = 'You did not enter in your name!';
                        service.custom = {name: 'You did not enter in your name!'};
                });
                break;
        }
    }; // end launch
    var _fakeWaitProgress = function () {
        $timeout(function () {
            if (_progress < 100) {
                _progress += 33;
                //$rootScope.$broadcast('dialogs.wait.progress',{'progress' : _progress});
                _fakeWaitProgress();
            } else {
                //$rootScope.$broadcast('dialogs.wait.complete');
                _progress = 0;
            }
        }, 1000);
    };

    //toolTip式消息
    service.toolTip = function (element, scope, msg) {
        var options = {
            content: '<div class="popover-tips">' + msg + '</div>',
            placement: "top",
            trigger: "manual",//"manual",
            html: true,
            animation: false
        };
        element.popover(options);
        element.popover('show');
        setInterval(function () {
            element.popover('destroy');
        }, 3000);

    }

    return service;
}])