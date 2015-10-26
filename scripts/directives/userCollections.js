/**
 * Created by liaozhida on 3/26/2015.
 */
GLHApp.directive('userCollections', function(){
    return {
        restrict: 'AE',
        replace: true,
        scope: {

        },
        templateUrl: "templates/user-collections.html",
        controller:function(){

            this.tab = 1;

            this.stock_tab = 1;

            this.setSelect = function(value){
                this.tab = value;
            }

            this.isSelect = function(value){
                return this.tab == value;
            }

            this.setStockSelect = function(value){
                this.stock_tab = value;
            }

            this.isStockSelect = function(value){
                return this.stock_tab == value;
            }

            var datas = ['1','2','3','4','5','6'];

            this.press = function(){
                alert("plus");
            }

        },
        controllerAs:'collections'
    }
});
