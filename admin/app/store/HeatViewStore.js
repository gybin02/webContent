/*
 * File: app/store/HeatViewStore.js
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

Ext.define('GURUAdmin.store.HeatViewStore', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.field.Field'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            pageSize: 30,
            storeId: 'HeatViewStore',
            proxy: {
                type: 'ajax',
                url: '../api/heatview/get',
                reader: {
                    type: 'json',
                    rootProperty: 'result',
                    totalProperty: 'totalCount'
                }
            },
            fields: [
                {
                    name: 'id'
                },
                {
                    name: 'author'
                },
                {
                    name: 'type'
                },
                {
                    name: 'remark'
                },
                {
                    name: 'postId'
                },
                {
                    name: 'sortCode'
                },
                {
                    name: 'showFlag'
                },
                {
                    name: 'createDate'
                }
            ]
        }, cfg)]);
    }
});