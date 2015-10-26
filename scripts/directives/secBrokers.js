/**
 * Created by Ellis.Xie on 5/12/2015
 *
 * Example: 
 *		<link rel="stylesheet" href="styles/sec-brokers.css">
 *		<sec-brokers show="exp..." stock-code="exp..."></sec-brokers>
 */
GLHApp.directive('secBrokers', function(){
	return {
		scope: {
			show: '=',
			stockCode: '='
		},
		restrict: 'E',
		templateUrl: 'templates/sec-brokers.html',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
});