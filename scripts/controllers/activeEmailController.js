GLHApp.controller('ActiveEmailController', ['$scope', '$rootScope', '$location', '$routeParams', 'ApiService','DialogService',
    function ($scope, $rootScope, $location, $routeParams, ApiService,DialogService) {

    //成功回调
    var successCallBack = function (data) {
        //设置显示的邮箱地址
        $scope.userEmail = data.result.email;
    }

    if ($routeParams.userId && $routeParams.activeCode && $routeParams.inviteCode) {
        ApiService.post(ApiService.getApiUrl().active_user,
            {userId: $routeParams.userId, activeCode: $routeParams.activeCode, code: $routeParams.inviteCode}, {},
            successCallBack, function (response, status) {
            if (response.statusCode == 406 || response.statusCode == 417) {
                DialogService.launch("error", response.message);
            }
        });
    }

    $scope.updateUserInfo = function () {
        var userId = $routeParams.userId;
        $location.path('/userUpdate/email/' + userId);
    }


}]);


