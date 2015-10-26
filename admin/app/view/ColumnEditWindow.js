/*
 * File: app/view/ColumnEditWindow.js
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

Ext.define('GURUAdmin.view.ColumnEditWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.columneditwindow',

    requires: [
        'GURUAdmin.view.ColumnEditWindowViewModel',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.RadioGroup',
        'Ext.form.field.Radio',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    viewModel: {
        type: 'columneditwindow'
    },
    height: '',
    itemId: 'ColumnEditWindow',
    width: 413,
    title: '栏目编辑界面',

    items: [
        {
            xtype: 'form',
            itemId: 'columnEidtForm',
            bodyPadding: 10,
            header: false,
            title: 'My Form',
            items: [
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    id: 'columnEditCode',
                    fieldLabel: '栏目编号',
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    id: 'columnEditName',
                    fieldLabel: '栏目名称'
                },
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    id: 'columnEditSequence',
                    fieldLabel: '显示顺序'
                },
                {
                    xtype: 'radiogroup',
                    id: 'columnEditWinStatus',
                    itemId: 'columnEditWinStatus',
                    fieldLabel: '状态',
                    items: [
                        {
                            xtype: 'radiofield',
                            name: 'columnEditWinStatus',
                            boxLabel: '不显示',
                            inputValue: '0'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'columnEditWinStatus',
                            boxLabel: '显示',
                            inputValue: '1'
                        }
                    ]
                },
                {
                    xtype: 'radiogroup',
                    id: 'columnEditWinType',
                    fieldLabel: '类型',
                    items: [
                        {
                            xtype: 'radiofield',
                            name: 'columnEditWinType',
                            boxLabel: '普通类型',
                            inputValue: '0'
                        },
                        {
                            xtype: 'radiofield',
                            name: 'columnEditWinType',
                            boxLabel: '媒体类型',
                            inputValue: '1'
                        }
                    ]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    height: 34,
                    itemId: 'columnEditWinToolbar',
                    ui: 'footer',
                    layout: {
                        type: 'hbox',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'columnEditSubmit',
                            text: '提交'
                        }
                    ]
                }
            ]
        }
    ]

});