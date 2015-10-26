/**
 * Created by Administrator on 2015/3/24.
 */

GLHApp.controller('HoverController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$MainService', '$UserService', 'CommService','ApiService','$interval','StockService','$anchorScroll',
    function ($scope, $rootScope, $http, $location, $routeParams, $MainService, $UserService, CommService,ApiService,$interval,StockService,$anchorScroll) {



        //悬浮框的几个基本事件
        $("#hoverImage").mouseenter(function(){

            $("#hover-qr").fadeIn(400);
            $("#hoverImage").attr("src","images/secondEdition/btn_code_2.png");
        });
        $("#hoverImage").mouseleave(function(){
            $("#hover-qr").fadeOut(100);
            $("#hoverImage").attr("src","images/secondEdition/btn_code_1.png");
        });
        $("#hoverTop").mouseenter(function(){
            $("#hoverTop").attr("src","images/secondEdition/btn_Top_2.png");
        });
        $("#hoverTop").mouseleave(function(){
            $("#hoverTop").attr("src","images/secondEdition/btn_Top_1.png");
        });

        $("#hoverTop").click(function(){ 
      		$('html,body').animate({ scrollTop: '0px' }, 300);
        });



}]);



