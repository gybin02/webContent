/*
 * File: app/controller/StockSelectController.js
 *
 * This file was generated by Sencha Architect
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 5.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 5.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('GURUAdmin.controller.StockSelectController', {
    extend: 'Ext.app.Controller',

    refs: {
        stockSelectCancelBt: '#stockSelectCancelBt',
        stockSelectConfirmBt: '#stockSelectConfirmBt',
        stockSelectWindow: '#StockSelectWindow',
        stockSelectGrid: '#StockSelectGrid'
    },

    control: {
        "#stockSelectConfirmBt": {
            click: 'onStockSelectConfirmBtClick'
        },
        "#stockSelectCancelBt": {
            click: 'onStockSelectCancelBtClick'
        }
    },

    /* 股票选择确认按钮事件 */
    onStockSelectConfirmBtClick: function(button, e, eOpts) {
        this.getStockSelectWindow().hide();
    },

    /* 股票选择取消事件 */
    onStockSelectCancelBtClick: function(button, e, eOpts) {
        var grid = this.getStockSelectGrid();
        //取消选中
        grid.getSelectionModel().clearSelections();
        this.getStockSelectWindow().hide();
    }

});
