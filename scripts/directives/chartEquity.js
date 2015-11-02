/**
 * 股权结构 f10图形
 * Created by liaozhida
 *2015-7-8
 */
GLHApp.directive('chartEquity', ['ApiService','$routeParams', function (ApiService,$routeParams) {
    return {
        restrict: 'AE',
        replace: true,

        controller: function ($scope, $element, $attrs) {
        },
        template: '<div id="container" style="margin: 0 auto">股权比例数据缺失，我们正在完善信息中...</div>',
        link: function (scope, element, attrs) {

            //个股编号（行业编号+个股编号：hk00243）
            //console.info($routeParams.stockCode+":::$routeParams.stockCode");
            scope.stockCode = $routeParams.stockCode;
            scope.type = scope.stockCode.slice(0,2)
            scope.code = scope.stockCode.slice(2,scope.stockCode.length);



            //f10股权结构信息
            scope.ratioList = [];
            ApiService.get(ApiService.getApiUrl().chartShareRatio, {type: scope.type,code:scope.code }, function (response) {

                scope.ratioList = response.result;

                var ideas = [

                ];

                $.each(scope.ratioList, function(index,item) {
                    ideas[index]=[item.name,item.percent];
                });

                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'pie-equity',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 350,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}：{point.percentage}%'
                            }
                        }
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                        percentageDecimals: 1
                    },
                    series: [{
                        type: 'pie',
                        name: '股权结构',
                        data: scope.items
                    }]
                });

                chart.series[0].setData(ideas, true);

            });


        }
    }
}]);