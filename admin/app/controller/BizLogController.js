/*
 * File: app/controller/BizLogController.js
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

Ext.define('GURUAdmin.controller.BizLogController', {
    extend: 'Ext.app.Controller',

    refs: {
        bizlogGridQueryBt: '#bizlogGridQueryBt',
        bizLogGridQueryResetBt: '#bizLogGridQueryResetBt',
        bizLogQueryFormOperatorField: '#bizLogQueryFormOperatorField',
        bizLogQueryFormTypeField: '#bizLogQueryFormTypeField',
        bizLogQueryFormPanel: '#BizLogQueryFormPanel',
        bizLogGrid: '#BizLogGrid'
    },

    control: {
        "#bizlogGridQueryBt": {
            click: 'onBizlogGridQueryBtClick'
        },
        "#bizLogGridQueryResetBt": {
            click: 'onBizLogGridQueryResetBtClick'
        },
        "#BizLogGrid": {
            beforehide: 'onBizLogGridBeforeHide'
        }
    },

    /* 查询按钮事件 */
    onBizlogGridQueryBtClick: function(button, e, eOpts) {
        var me = this;
        var form = me.getBizLogQueryFormPanel().getForm();

        var bizLogStore = Ext.data.StoreManager.lookup("BizLogStore");

        bizLogStore.on('beforeload', function(store, options) {
            var operator = form.findField("bizLogQueryFormOperatorField").getValue();
            var type = form.findField("bizLogQueryFormTypeField").getValue();
            var queryParams = {
                "nick": operator,
                "typeId": type
            };
            Ext.apply(store.proxy.extraParams, queryParams);
        });
        bizLogStore.loadPage(1);
    },

    /* 重置按钮的事件 */
    onBizLogGridQueryResetBtClick: function(button, e, eOpts) {
        this.getBizLogQueryFormPanel().reset();
    },

    /* 隐藏前的促发事件 */
    onBizLogGridBeforeHide: function(component, eOpts) {
        this.getBizLogQueryFormPanel().reset();
    }

});
