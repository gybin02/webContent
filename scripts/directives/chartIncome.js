/**
 * Created by liaozhida
 *2015-7-8
 */
GLHApp.directive('chartIncome',  ['ApiService','$routeParams', function (ApiService,$routeParams) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            items: '='
        },
        controller: function ($scope, $element, $attrs) {
        },
        template: '<div id="container" style="margin: 0 auto"></div>',
        link: function (scope, element, attrs) {
            //个股编号（行业编号+个股编号：hk00243）
            //console.info($routeParams.stockCode+":::$routeParams.stockCode");
            scope.stockCode = $routeParams.stockCode;
            scope.type = scope.stockCode.slice(0,2)
            scope.code = scope.stockCode.slice(2,scope.stockCode.length);

            //总收入
            scope.income = [];
            //日期
            scope.dateArray = [];
            //增长率
            scope.incomeRate = [];
            //净利润
            scope.profit = [];
            //净利润增长率
            scope.profitRate = [];
            //净利率
            scope.profitRatio = [];
            //毛利率
            scope.grossRatio = [];
            //roa
            scope.roa = [];
            //roe
            scope.roe = [];
            //eps 每股收益
            scope.eps = [];
            //pe
            scope.pe = [];
            //每股净资产
            scope.nav = [];
            //pb
            scope.pb = [];
            //每股现金流
            scope.cashFlow = [];


            ApiService.get(ApiService.getApiUrl().chartFinance, {type: scope.type,code:scope.code }, function (response) {

                scope.financeResult  = response.result;

                var dates = [];
                $.each(response.result, function(index,item){

                    $.each(item, function(name,element){
                        if(name==='income'){
                            scope.income[index] = element/1000000;
                            console.debug("income:"+scope.income[index]);
                        }
                        if(name==='endDate'){
                            scope.dateArray[index] = element.slice(0,10);
                            console.debug("date:"+scope.dateArray[index]);
                        }
                        if(name==='incomeRate'){
                            scope.incomeRate[index] = element;
                        }
                        if(name==='profit'){
                            scope.profit[index] = element/1000000;
                        }
                        if(name==='profitRate'){
                            scope.profitRate[index] = element;
                        }
                        if(name==='grossRatio'){
                            scope.grossRatio[index] = element;
                        }
                        if(name==='profitRatio'){
                            scope.profitRatio[index] = element;
                        }
                        if(name==='roa'){
                            scope.roa[index] = element;
                        }
                        if(name==='roe'){
                            scope.roe[index] = element;
                        }
                        if(name==='eps'){
                            scope.eps[index] = element;
                        }
                        if(name==='pe'){
                            scope.pe[index] = element;
                        }
                        if(name==='pb'){
                            scope.pb[index] = element;
                        }
                        if(name==='nav'){
                            scope.nav[index] = element;
                        }
                        if(name==='cashFlow'){
                            scope.cashFlow[index] = element;
                        }

                    });
                });

                console.debug("scope.dateArray:"+scope.dateArray+"-scope.income:"+scope.income);

                //总收入
                new Highcharts.Chart({
                    chart: {
                        zoomType: 'xy',
                        renderTo:'pillar-income'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: scope.dateArray
                    },
                    yAxis: [{ // Primary yAxis
                        labels: {
                            format: '{value}百万RMB',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        title: {
                            text: '总收入',
                            style: {
                                color: '#5C5C61'
                            }
                        }
                    }, { // Secondary yAxis
                        min:0,
                        title: {
                            text: '增长率(%)',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        labels: {
                            format: '{value} %',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        opposite: true
                    }],

                    tooltip: {
                        shared:true
                    },
                    labels: {
                        items: [{
                            html: '',
                            style: {
                                left: '40px',
                                top: '8px',
                                color: 'black'
                            }
                        }]
                    },
                    series: [{
                        type: 'column',
                        name: '总收入(RMB)',
                        data: scope.income,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 0,
                            y: 5,
                            style: {
                                fontSize: '15px',
                                fontFamily: 'Consolas',
                                textShadow: '0 0 0px black'
                            }
                        },
                        tooltip:{
                            valueSuffix:'RMB'
                        }
                    },  {
                        type: 'spline',
                        name: '增长率',
                        data: scope.incomeRate,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#000000',
                            align: 'right',
                            x: 4,
                            y: 20,
                            style: {
                                fontSize: '15px',
                                fontFamily: 'Consolas',
                                textShadow: '0 0 0px black'
                            }
                        },
                        yAxis: 1,
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        },
                        tooltip:{
                            valueSuffix:'%'
                        }
                    }]
                });

                //净利润
                new Highcharts.Chart({
                    chart: {
                        zoomType: 'xy',
                        renderTo:'pillar-profit'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: scope.dateArray
                    },
                    yAxis: [{ // Primary yAxis
                        labels: {
                            format: '{value}百万RMB',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        title: {
                            text: '',
                            style: {
                                color: '#5C5C61'
                            }
                        }
                    }, { // Secondary yAxis
                        title: {
                            text: '',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        labels: {
                            format: '{value}%',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        opposite: true
                    }],

                    tooltip: {
                        shared:true
                    },
                    labels: {
                        items: [{
                            html: '',
                            style: {
                                left: '40px',
                                top: '8px',
                                color: 'black'
                            }
                        }]
                    },
                    series: [{
                        type: 'column',
                        name: '净利润',
                        data: scope.profit,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 0,
                            y: 5,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 0px black'
                            }
                        },
                        tooltip:{
                            valueSuffix:'RMB'
                        }
                    },  {
                        type: 'spline',
                        name: '增长率(%)',
                        data: scope.profitRate,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: 'black',
                            align: 'right',
                            x: 4,
                            y: 0,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Consolas',
                                textShadow: '0 0 0px black'
                            }
                        },
                        yAxis: 1,
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        },
                        tooltip:{
                            valueSuffix:'%'
                        }
                    }]
                });

                //毛利率
                new Highcharts.Chart({
                    chart: {
                        renderTo:'pillar-ratio'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: scope.dateArray
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            formatter: function() {
                                return this.value +'%'
                            }
                        }
                    },
                    /*labels: {
                     items: [{
                     html: 'Total fruit consumption',
                     style: {
                     left: '40px',
                     top: '8px',
                     color: 'black'
                     }
                     }]
                     },          */
                    series: [
                        {
                            type: 'spline',
                            name: '毛利率(%)',
                            data: scope.grossRatio,
                            dataLabels: {					//显示数值
                                enabled: true,
                                rotation: 0,
                                color: '#415e71',
                                align: 'right',
                                x: 4,
                                y: 0,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif',
                                    textShadow: '0 0 0px black'
                                }
                            },
                            marker: {
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[3],
                                fillColor: 'white'
                            },
                            tooltip:{
                                valueSuffix:'%'
                            }
                        }, {
                            type: 'spline',
                            name: '净利率(%)',
                            data: scope.profitRatio,
                            dataLabels: {					//显示数值
                                enabled: true,
                                rotation: 0,
                                color: '#415e71',
                                align: 'right',
                                x: 4,
                                y: 0,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif',
                                    textShadow: '0 0 0px black'
                                }
                            },
                            marker: {
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[3],
                                fillColor: 'white'
                            }    ,
                            tooltip:{
                                valueSuffix:'%'
                            }
                        }]
                });


                //ROA ROE
                new Highcharts.Chart({
                    chart: {
                        type: 'spline',
                        renderTo:'line-roa'
                    },
                    title: {
                        text: ''
                    },
                    /*subtitle: {
                     text: ''
                     },*/
                    xAxis: {
                        categories: scope.dateArray
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            formatter: function() {
                                return this.value +'%'
                            }
                        }
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    series: [{
                        name: 'ROA(%)',
                        marker: {
                            symbol: 'square'
                        },
                        data: scope.roa,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 4,
                            y: 0,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 0px black'
                            }
                        },
                        tooltip:{
                            valueSuffix:'%'
                        }

                    }, {
                        name: 'ROE(%)',
                        marker: {
                            symbol: 'diamond'
                        },
                        data: scope.roe,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 4,
                            y: 0,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 0px black'
                            }
                        },
                        tooltip:{
                            valueSuffix:'%'
                        }
                    }]
                });

                //PE
                new Highcharts.Chart({
                    chart: {
                        zoomType: 'xy',
                        renderTo:'pillar-pe'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: scope.dateArray
                    },
                    yAxis: [{ // Primary yAxis
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        title: {
                            text: '每股收益',
                            style: {
                                color: '#5C5C61'
                            }
                        }
                    }, { // Secondary yAxis
                        min:0,
                        title: {
                            text: 'PE',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        opposite: true
                    }],

                    tooltip: {
                        shared:true
                    },
                    labels: {
                        items: [{
                            html: '',
                            style: {
                                left: '40px',
                                top: '8px',
                                color: 'black'
                            }
                        }]
                    },
                    series: [{
                        type: 'column',
                        name: '每股收益',
                        data: scope.eps,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 4,
                            y: 10,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 0px black'
                            }
                        },
                        tooltip:{
                            valueSuffix:''
                        }
                    },  {
                        type: 'spline',
                        name: 'PE',
                        data: scope.pe,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 4,
                            y: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Consolas',
                                textShadow: '0 0 0px black'
                            }
                        },
                        yAxis: 1,
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        },
                        tooltip:{
                            valueSuffix:''
                        }
                    }]
                });

                //每股净资产
                new Highcharts.Chart({
                    chart: {
                        zoomType: 'xy',
                        renderTo:'pillar-pb'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: scope.dateArray
                    },
                    yAxis: [{ // Primary yAxis
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        title: {
                            text: 'RMB',
                            style: {
                                color: '#5C5C61'
                            }
                        }
                    }, { // Secondary yAxis
                        min:0,
                        title: {
                            text: 'PB',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#5C5C61'
                            }
                        },
                        opposite: true
                    }],

                    tooltip: {
                        shared:true
                    },
                    labels: {
                        items: [{
                            html: '',
                            style: {
                                left: '40px',
                                top: '8px',
                                color: 'black'
                            }
                        }]
                    },
                    series: [{
                        type: 'column',
                        name: '每股净资产',
                        data: scope.nav,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 4,
                            y: 10,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 0px black'
                            }
                        },
                        tooltip:{
                            valueSuffix:''
                        }
                    },  {
                        type: 'spline',
                        name: 'PB',
                        data: scope.pb,
                        dataLabels: {					//显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 4,
                            y: 10,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Consolas',
                                textShadow: '0 0 0px black'
                            }
                        },
                        yAxis: 1,
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: 'white'
                        },
                        tooltip:{
                            valueSuffix:''
                        }
                    }]
                });



                //每股现金流
                var chartCash = new Highcharts.Chart({
                    chart: {
                        renderTo: 'pillar-cash',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: ''
                    },
                    yAxis:{
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#5C5C61'
                            }
                        },title: {
                            text: 'RMB',
                            style: {
                                color: '#5C5C61'
                            }
                        }
                    },
                    xAxis: {
                        categories: scope.dateArray
                    },

                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                formatter: function () {
                                    return '<b>' + 每股现金流 + '</b>: ' + this.y;
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'column',
                        name: '每股现金流',
                        data: scope.cashFlow,
                        dataLabels: {                   //显示数值
                            enabled: true,
                            rotation: 0,
                            color: '#415e71',
                            align: 'right',
                            x: 4,
                            y: 10,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 0px black'
                            }
                        },
                        tooltip:{
                            valueSuffix:''
                        }
                    }]
                });


            });//apiService 结束

            
        }
    }
}]);