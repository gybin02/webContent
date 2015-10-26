/*
 * File: app/view/MyContainer.js
 *
 * This file was generated by Sencha Architect version 3.2.0.
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

Ext.define('PagerDemo.view.MyContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.mycontainer',

    requires: [
        'PagerDemo.view.MyContainerViewModel',
        'Ext.grid.Panel',
        'Ext.grid.column.Number',
        'Ext.toolbar.Paging'
    ],

    viewModel: {
        type: 'mycontainer'
    },
    height: 380,
    width: 560,
    layout: 'fit',

    items: [
        {
            xtype: 'gridpanel',
            title: 'My Grid Panel',
            store: 'UserStore',
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'name',
                    text: 'Name'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'mail',
                    text: 'Mail'
                },
                {
                    xtype: 'numbercolumn',
                    dataIndex: 'age',
                    text: 'Age'
                }
            ],
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    width: 360,
                    displayInfo: true,
                    store: 'UserStore'
                }
            ]
        }
    ]

});