/**
 * Created by liaozhida on 3/26/2015.
 */
GLHApp.directive('searchBox', ['$location','ApiService','$timeout',function($location,ApiService,$timeout){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
        },
        templateUrl: "templates/secondEdition/search-box.html",
        controller:function(){
        },
        controllerAs:'collections', 

        link: function(scope, element, attrs){
            scope.searchPost =  new Object();
            scope.searchUser =  new Object();
            scope.searchStock =  new Object();

            scope.key = "";
            scope.showflag = 0;
            scope.stockFirst = false;

            scope.searcher = function(event,newValue){
                console.log("start search "+newValue);
                if(newValue=='undefined'){
                    scope.showflag = 1;
                    return;
                }
                scope.key = newValue.replace(/[#$%^&*!/\\\]\[]/g, '');
                scope.showflag = 0;
                //按回车键或者右边的小检索按钮
                if(event.keyCode == 13||event.currentTarget.id=="btnGlobalSearch"){
                    scope.showflag = 1;
                    $location.path('search/'+scope.key);
                }else if(scope.key.trim()==""){
                    scope.showflag = 1;
                }else if( scope.key.length>0){
                    getSearchBox();
                }
            };

            scope.jump = function(path,param){
                $location.path(path+"/"+param);
            }

            //获取数据成功的回调函数
            var getSearchBoxSucc = function (data) {
                angular.forEach(data, function(value, key) {
                	if(key == 'result'){ 
                        var searchPost = value.searchPost;
                        var searchUser = value.searchUser;
                        var searchStock = value.searchStock;

                        scope.searchPost = searchPost;
                        scope.searchStock = searchStock;
                        scope.searchUser = searchUser;
                	}  
                });
            }
            //发起搜索请求
            var getSearchBox = function(){
                var encodeKey = scope.key;
                if(isNaN(encodeKey)){           //非数字
                    scope.stockFirst = false;
                }else{                          //数字
                    scope.stockFirst = true;
                }
                encodeKey = encodeURI(encodeKey);
                ApiService.get(ApiService.getApiUrl().getSearchBox, {keyword: encodeKey}, getSearchBoxSucc);
            }

            scope.searchPage = function (rawValue) {
                scope.showflag = 1;2
                $location.path(rawValue+"/"+ scope.key);
            }

            scope.blurTimeout = function () {
                $timeout(function(){scope.showflag = 1; }, 500);
            }





        }
        
        
        
    }
}]);
