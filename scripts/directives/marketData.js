/**
 * Created by vincent.chang on 3/26/2015.
 */
GLHApp.directive('marketData', ['$location', "$window", 'ApiService', function ($location, $window, ApiService) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            dataItems: "@"
        },
        templateUrl: "templates/marketData.html",
        link: function (scope, ele, attrs) {


//            scope.dataItems = [
//                {
//                    fontClass: "font_green",
//                    title: "恒生指数",
//                    total: "23833.79",
//                    totalFloatingPoint: "+63.19",
//                    currentFloatingPoint: "+0.26%",
//                    splitClass: "bg_green"
//                },
//                {
//                    fontClass: "font_green",
//                    title: "道琼斯指数",
//                    total: "17662.94",
//                    totalFloatingPoint: "+332.78",
//                    currentFloatingPoint: "+1.85%",
//                    splitClass: "bg_green"
//                },
//                {
//                    fontClass: "font_red",
//                    title: "上证指数",
//                    total: "3309.07",
//                    totalFloatingPoint: "+23.01",
//                    currentFloatingPoint: "+0.7%",
//                    splitClass: "bg_red"
//                },
//                {
//                    fontClass: "font_red",
//                    title: "深证成指",
//                    total: "11611.92",
//                    totalFloatingPoint: "+55.26",
//                    currentFloatingPoint: "+0.48%",
//                    splitClass: "bg_red"
//                }
//            ];

            //获取大盘数据回调
            var getSuccess = function (data) {
                scope.dataItems = new Array();
                for (var i in data.result) {
                    var o = new Object();
                    o.title = data.result[i].name;
                    o.total = data.result[i].index;
                    o.code = data.result[i].code;


                    if (data.result[i].change > 0) {
                        o.totalFloatingPoint = "+" + data.result[i].change;
                        o.currentFloatingPoint = "+" + data.result[i].netChange + "%";
                        o.fontClass = "font_red";
                        o.splitClass = "bg_red";
                    } else {
                        o.totalFloatingPoint = data.result[i].change;
                        o.currentFloatingPoint = data.result[i].netChange + "%";
                        if (o.totalFloatingPoint < 0) {
                            o.fontClass = "font_green";
                            o.splitClass = "bg_green";
                        } else {
                            o.fontClass = "font_normal";
                            o.splitClass = "bg_normal";
                        }
                    }

                    scope.dataItems.push(o);

                }

                $window.localStorage.marketData = angular.toJson(scope.dataItems);

            };

            //获取大盘数据
            var getMarket = function () {
                ApiService.get(ApiService.getApiUrl().getMarket, {marketCodes: "glh00001,hkHSI,usDJI,sh000001,sz399001"}, getSuccess);
            }

            //一分钟更新大盘数据
            var intervalId = setInterval(function () {
                scope.$apply(getMarket);
            }, 60000);

            //当去掉的时候，取消刷新大盘数据
            ele.bind("$destroy", function () {
                clearInterval(intervalId);
            });

            if ($window.localStorage.marketData) {
                scope.dataItems= angular.fromJson($window.localStorage.marketData);
            } else {
                getMarket();
            }

            scope.marketDetail = function (code) {
                //暂时只有格隆汇港A100
                if (code == "glh00001") {
                    $location.path("/glhExponent/" + code);
                }
            }

        }
    }
}]);
