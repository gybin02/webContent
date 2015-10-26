/**
 * Created by Administrator on 2015/3/24.
 */

ggtApp.controller('ggtController', ['$scope','ggtApiService', function ($scope,ggtApiService) {

        ggtApiService.get(ggtApiService.getApiUrl().flowDetail,null, function (response) {
              
            console.debug(response.result);
            $scope.hkMarketFlowDetail = response.result.hkMarketFlowDetail; 
            $scope.shMarketFlowDetail = response.result.shMarketFlowDetail;
                      
        }); 
  
        ggtApiService.get(ggtApiService.getApiUrl().flowList,null, function (response) {
                
            $scope.shData = response.result.shMarketList;
            $scope.hkData = response.result.hkMarketList;
  
            var inx = 0;
            $scope.shtimestamp = [];
            $scope.hktimestamp = [];
            $scope.timestamp = [];
            $scope.shBalance = [];
            $scope.hkBalance = [];


            $.each($scope.shData,function(index,item){
                $.each(item,function(ind,ele){
                    if(ind === 'timestamp'){
                        $scope.shtimestamp[inx] = ele;
                    }
                    if(ind ==='balance'){
                        $scope.shBalance[inx] = ele;
                    }
                });
                inx ++;
            });

            inx = 0;
            $.each($scope.hkData,function(index,item){
                $.each(item,function(ind,ele){
                    if(ind === 'timestamp'){
                        $scope.hktimestamp[inx] = ele;
                    }
                    if(ind ==='balance'){
                        $scope.hkBalance[inx] = ele;
                    }
                });
                inx ++;
            });

            if($scope.shtimestamp.length > $scope.hktimestamp.length){
                $scope.timestamp = $scope.shtimestamp;
            }else{
                $scope.timestamp = $scope.hktimestamp;
            }

            console.debug($scope.hkBalance);
            console.debug($scope.shBalance)

            //test
            /*new Highcharts.Chart({

                chart: {
                    type: 'area',
                    renderTo:'hgt-chart'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: $scope.timestamp,
                    labels:{ 
                        step:15 
                    } 
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
                plotOptions: {
                    area: {
                        marker: {
                            radius: 1,
                            lineColor: 'red',
                            lineWidth: 0
                        }
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                credits: {
                    enabled: false
                }, 
                series: [{
                    name: '沪股通资金流向',
                    marker : {
                        symbol: 'square',
                        radius: 0,
                            lineColor: '#1182ac',
                            lineWidth: 0
                    },
                    data: $scope.shBalance,
                    color:'#c9e7ed'
                }, {
                    name: '港股通资金流向',
                    data: $scope.hkBalance,
                    color:'#fbeadb',
                    marker : {
                        symbol: 'square',
                        radius: 0,
                            lineColor: '#ffa800',
                            lineWidth: 0
                    }
                }] 

            });*/

            $scope.step = 0;
            if( $scope.timestamp.length < 10){
                $scope.step = $scope.timestamp.length;
            }else if( $scope.timestamp.length>=10 && $scope.timestamp.length<50){
                $scope.step = 3;
            }else if( $scope.timestamp.length>=50 && $scope.timestamp.length<100 ){
                $scope.step = 10;
            }else if($scope.timestamp.length>=100 && $scope.timestamp.length<200){
                $scope.step = 20;
            }else{
                $scope.step = 30;
            }


            var chartGgt = new Highcharts.Chart({


                chart: {
                    type: 'spline',
                    renderTo:'hgt-chart'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
               /* xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: { // don't display the dummy year
                        month: '%e. %b',
                        year: '%b'
                    },
                    title: {
                        text: 'Date'
                    }
                },*/

                xAxis: {
                    categories: $scope.timestamp,
                    labels:{
                        step: $scope.step,
                        align: 'right',
                        x: 40,
                        y: 30
                    }                 
                },

                yAxis: {
                    rotation:90,
                    title: {
                        text: '单位(亿元)'
                    }
                   
                },
                /*tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
                },*/

                tooltip: {

                    crosshairs: true,
                    shared: true
                },

                plotOptions: {


                    spline: {
                        lineWidth: 2,
                        states: {
                            hover: {
                                //lineWidth: 2
                            }
                        },
                        marker: {
                            enabled: true
                        }
                    }
                },

                series: [{
                    name: "港股通资金流向",
                    data: $scope.hkBalance,
                    color:'#7cb5ec',
                    marker : {
                        symbol: 'square',
                        radius: 0,
                        lineColor: '#1182ac',
                        lineWidth: 0
                    }

                }, {
                    name: "沪股通资金流向",
                    color:'#f7a35c',
                    data: $scope.shBalance,
                    marker : {
                        symbol: 'square',
                        radius: 0,
                        lineColor: '#e08233',
                        lineWidth: 0
                    }

                }]


            });




        });
    
}]);

