/**
 * Created by liaozhida
 *2015-7-8
 */
GLHApp.directive('chartAsset',   ['ApiService','$routeParams', function (ApiService,$routeParams) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            items: '='
        },
        controller: function ($scope, $element) {

        },
        template: '<div id="container" style="margin: 0 auto">资产数据部分缺失，我们正在完善信息中...</div>',
        link: function (scope, element, attrs) {

            //个股编号（行业编号+个股编号：hk00243）
            //console.info($routeParams.stockCode+":::$routeParams.stockCode");
            scope.stockCode = $routeParams.stockCode;
            scope.type = scope.stockCode.slice(0,2)
            scope.code = scope.stockCode.slice(2,scope.stockCode.length);


            //f10股权结构信息
            scope.assetList = [];
            ApiService.get(ApiService.getApiUrl().chartAsset, {type: scope.type,code:scope.code }, function (response) {

                scope.assetList = response.result;

                var ideas =[];
                var inx = 0;
                $.each(scope.assetList, function(index,item){
                    scope.subItem = new Object();
                    scope.subItem.name = index ;
                    scope.subItem.data = [item/1000000] ;
                    ideas[inx] = scope.subItem ;
                    inx ++ ;
                });

                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'pie-asset',
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: ['资产']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '金额'
                        },
                        stackLabels: {  //总额
                            enabled: false,
                            style: {
                                fontWeight: 'bold',
                                color:  (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        },
                        labels: {
                            format: '{value}百万',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        title: {
                            text: '金额(RMB)',
                            style: {
                                color: '#5C5C61'
                            }
                        }
                    },
                    legend: { //图例
                        align: 'left', 
                        x: 5, 
                        verticalAlign: 'bottom',
                        y: -0,      
                        floating: false,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: true
                    },
                    tooltip: {
                        formatter: function() {
                            return ''+
                                this.series.name +': '+ this.y +'<br>'+
                                'Total: '+ this.point.stackTotal+'<br>'
                                +'占比:'+this.y/this.point.stackTotal+'%';
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                color: '#126ca5' || (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                textShadow: '0 0 0px black'
                            }
                        }
                    },
                    series: ideas
                });


                // chart.series[0].setData(ideas, true);
            });


        }
    }
}]);