/**
 * Created by Ellis.Xie on 5/18/2015
 *
 * Example: 
 *		<link rel="stylesheet" href="styles/modal.css">
 *		<link rel="stylesheet" href="styles/user-editor.css">
 *		<link rel="stylesheet" href="styles/at-user.css">
 *		<at-user show="exp..." nickname="exp..."></at-user>
 */
GLHApp.directive('atUser', function(){
	return {
		scope: {
			show: '=',
			nickname: '='
		},
		restrict: 'AE',
		templateUrl: 'templates/at-user.html',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			//编辑@信息
			$scope.$watch('show', function(){
				$scope.lastAt = '';
				if ($scope.show) {
					var atText = iElm.find('div.contenteditable')[0];
					if (atText.innerHTML == '' || $scope.lastAt != $scope.nickname){
						atText.innerHTML = '@' + $scope.nickname + ' ';
						$scope.lastAt = $scope.nickname+"&nbsp;";
					}
				};
			});
		}
	};
});