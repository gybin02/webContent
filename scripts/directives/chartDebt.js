/**
 * Created by liaozhida
 *2015-7-8
 */
GLHApp.directive('chartDebt',   ['ApiService','$routeParams', function (ApiService,$routeParams) {
    return {
        restrict: 'AE',
        replace: true,
        controller: function ($scope, $element, $attrs) {

        },
        template: '<div id="container" style="margin: 0 auto">负债和权益数据缺失，我们正在完善信息中...</div>',
        link: function (scope, element, attrs) {

            //个股编号（行业编号+个股编号：hk00243）
            //console.info($routeParams.stockCode+":::$routeParams.stockCode");
            scope.stockCode = $routeParams.stockCode;
            scope.type = scope.stockCode.slice(0,2)
            scope.code = scope.stockCode.slice(2,7);


            //f10股权结构信息
            scope.assetList = [];
            ApiService.get(ApiService.getApiUrl().chartLiability, {type: scope.type,code:scope.code }, function (response) {

                scope.assetList = response.result;

                var ideas =[];
                var inx = 0;
                $.each(scope.assetList, function(index,item){
                    scope.subItem = new Object();
                    scope.subItem.name = index ;
                    scope.subItem.data = [item] ;
                    ideas[inx] = scope.subItem ;
                    inx ++ ;
                });


                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'pie-debt',
                        type: 'column'
                    },
                    title: {
                        text: '资产'
                    },
                    xAxis: {
                        categories: ['负债与所有者权益']
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
                        }
                    },
                    legend: { //图例
                        align: 'right',
                        x: -10,
                        verticalAlign: 'top',
                        y: -14,
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
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
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