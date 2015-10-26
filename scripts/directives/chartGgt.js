/**
 * Created by liaozhida
 *2015-7-8
 */
ggtApp.directive('chartGgt',  ['ggtApiService', function (ggtApiService) {
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

            ggtApiService.get(ggtApiService.getApiUrl().flowList,null, function (response) {

                scope.shData = response.result.shMarketList;
                scope.hkData = response.result.hkMarketList;
                
                var inx = 0; 
                scope.shtimestamp = [];
                scope.hktimestamp = [];
                scope.timestamp = [];
                scope.shBalance = [];
                scope.hkBalance = [];


                $.each(scope.shData,function(index,item){
                   $.each(item,function(ind,ele){
                        if(ind === 'timestamp'){
                           scope.shtimestamp[inx] = ele;
                        }
                        if(ind ==='balance'){
                           scope.shBalance[inx] = ele;
                        }
                   });      
                   inx ++;   
                });

                inx = 0;
                $.each(scope.hkData,function(index,item){
                   $.each(item,function(ind,ele){
                        if(ind === 'timestamp'){
                           scope.hktimestamp[inx] = ele;
                        }
                        if(ind ==='balance'){
                           scope.hkBalance[inx] = ele;
                        }
                   });      
                   inx ++;   
                });
                        
                if(scope.shtimestamp.length > scope.hktimestamp.length){
                    scope.timestamp = scope.shtimestamp;
                }else{
                    scope.timestamp = scope.hktimestamp;        
                }        

                //test
                new Highcharts.Chart({
                    
                    chart: {
                        type: 'area',
                        renderTo:'hgt-chart'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: scope.timestamp
                    },
                    yAxis:{
                        title: {
                            rotation:90,
                            text: '单位:（亿元）',
                            style: {
                                color: '#5C5C61'
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: '沪股通资金流向',
                        data: scope.shBalance,
                        color:'#c9e7ed'
                    }, {
                        name: '港股通资金流向',
                        data: scope.hkBalance,
                        color:'#fbeadb'
                    }]

                });

            });



        }
    }
}]);