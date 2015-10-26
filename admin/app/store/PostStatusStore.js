/*
 * File: app/store/PostStatusStore.js
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

Ext.define('GURUAdmin.store.PostStatusStore', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.field.Integer',
        'Ext.data.field.String'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'PostStatusStore',
            data: [
                {
                    id: 0,
                    statusName: '已删除'
                },
                {
                    id: 1,
                    statusName: '正常'
                },
                {
                    id: -1,
                    statusName: '全部'
                }
            ],
            fields: [
                {
                    type: 'int',
                    name: 'id'
                },
                {
                    type: 'string',
                    name: 'statusName'
                }
            ]
        }, cfg)]);
    }
});