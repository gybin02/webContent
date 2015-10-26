/**
 * Created by Administrator on 2015/3/24.
 */

GLHApp.controller('HomeController', ['$scope', '$rootScope', '$window', '$http', '$location', '$routeParams', '$HomeService', 'CommService',
    function ($scope, $rootScope, $window, $http, $location, $routeParams, $HomeService, CommService) {
        // 查询港股信息
        $HomeService.hotGGArticleInfo('GG').then(function (data) {
            var result = data.result;
            $scope.ggColumnName = result.columnName;
            $scope.ggColumnCode = result.columnCode;
            var articles = result.articleMap;
            $scope.ggAticles = $scope.formatArticle(articles);
        }, function (data) {
            // 处理错误 .reject
        });

        // 查询热点新闻
        $HomeService.hotGGArticleInfo('RD').then(function (data) {
            var result = data.result;
            $scope.rdhtColumnName = result.columnName;
            $scope.rdhtColumnCode = result.columnCode;
            var articles = result.articleMap;
            $scope.rdhtAticles = $scope.formatArticle(articles);
            $scope.isLoaded = true;
        }, function (data) {
            $scope.isLoaded = true;
            // 处理错误 .reject
        });

        // 查询美股新闻
        $HomeService.hotGGArticleInfo('MG').then(function (data) {
            var result = data.result;
            $scope.mgColumnName = result.columnName;
            $scope.mgColumnCode = result.columnCode;
            var articles = result.articleMap;
            $scope.mgAticles = $scope.formatArticle(articles);
            $scope.isLoaded = true;
        }, function (data) {
            $scope.isLoaded = true;
            // 处理错误 .reject
        });
       
        $scope.getArticleDetail = function(postId){
        	$location.path("/articleDetail/"+postId);
        }

        $scope.formatArticle = function (articles) {
            for (var i in articles) {
                if (articles[i].publishTime) {
                    articles[i].publishTimeLoc = CommService.formatPubTime(articles[i].publishTime);
                }
            }
            return articles;
        }

        $scope.getMoreArticles = function (columnCode, columnName) {
            $scope.$emit('moreArticles', columnCode);
            $location.path("/topic/" + columnCode);
        }

        //打开用户详情
        $scope.openUser=function(userId){
            $location.path("/userInfo/"+userId);
        }
    }]);