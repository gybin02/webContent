/*
 * File: app/view/PushWindow.js
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

Ext.define('GURUAdmin.view.PushWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.PushWindow',

    requires: [
        'GURUAdmin.view.PushWindowViewModel',
        'Ext.form.Panel',
        'Ext.form.field.TextArea',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    viewModel: {
        type: 'pushwindow'
    },
    height: 393,
    width: 499,
    title: '推送编辑',

    items: [
        {
            xtype: 'form',
            height: 338,
            itemId: 'pushWinForm',
            bodyPadding: 10,
            items: [
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    id: 'pushPostId',
                    margin: '5 5;',
                    fieldLabel: '帖子id',
                    labelWidth: 60
                },
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    id: 'pushAuthor',
                    margin: '5 5;',
                    fieldLabel: '文章作者',
                    labelWidth: 60
                },
                {
                    xtype: 'textareafield',
                    anchor: '100%',
                    height: 223,
                    id: 'pushContent',
                    margin: '5 5;',
                    fieldLabel: '推送内容',
                    labelWidth: 60
                }
            ]
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'button',
                    itemId: 'pushSendBt',
                    text: '发送'
                }
            ]
        }
    ]

});