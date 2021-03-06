/*
 * File: app/store/BizLogTypeStore.js
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

Ext.define('GURUAdmin.store.BizLogTypeStore', {
    extend: 'Ext.data.Store',

    requires: [
        'GURUAdmin.model.BizLogTypeModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'BizLogTypeStore',
            model: 'GURUAdmin.model.BizLogTypeModel',
            proxy: {
                type: 'ajax',
                url: '/api/biz/log/type',
                reader: {
                    type: 'json',
                    rootProperty: 'result'
                }
            }
        }, cfg)]);
    }
});