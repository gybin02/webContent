/*
 * File: app/store/ArticleStore.js
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

Ext.define('GURUAdmin.store.ArticleStore', {
    extend: 'Ext.data.Store',
    alias: 'store.ArticleStore',

    requires: [
        'GURUAdmin.model.ArticleModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            pageSize: 30,
            storeId: 'ArticleStore',
            autoLoad: false,
            model: 'GURUAdmin.model.ArticleModel',
            proxy: {
                type: 'ajax',
                url: '../api/article/adminList',
                reader: {
                    type: 'json',
                    rootProperty: 'result.articleList',
                    totalProperty: 'totalCount'
                }
            }
        }, cfg)]);
    },

    clearExtraParams: function() {
        this.on('beforeload', function(store, options) {
            var queryParams = {
                columnCode : '',
                articleTitle: '',
                author:'',
                display:'',
                showFlag:'',
                publishTime:''
            };
            Ext.apply(store.proxy.extraParams, queryParams);
        });
    }

});