/**
 * Created by Ellis.Xie on 5/18/2015
 *
 * Example: 
 *		<link rel="stylesheet" href="styles/modal.css">
 *		<modal width="180px" height="100px" header="exp..." show="exp...">...</modal>
 */
GLHApp.directive('modal', function(){
	return {
		scope: {
			show: '=',
			header: '='
		},
		restrict: 'AE',
		replace: true,
		transclude: true,
		templateUrl: 'templates/modal.html',
		link: function($scope, iElm, iAttrs, controller) {

			$scope.modalPanelStyle = {'width': iAttrs.width, 'height': iAttrs.height};

			if ($scope.header != null && $scope.header.length > 0) {
				$scope.showHeader = true;
			};

			$scope.closeModal = function(){
				$scope.show = false;
			}
		}
	};
});