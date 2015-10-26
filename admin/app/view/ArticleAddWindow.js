/*
 * File: app/view/ArticleAddWindow.js
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

Ext.define('GURUAdmin.view.ArticleAddWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.ArticleAddWindow',

    requires: [
        'GURUAdmin.view.ArticleAddWindowViewModel',
        'Ext.form.Panel',
        'Ext.button.Button',
        'Ext.form.field.TextArea',
        'Ext.form.RadioGroup',
        'Ext.form.field.Radio',
        'Ext.form.field.File',
        'Ext.Img',
        'Ext.toolbar.Toolbar'
    ],

    viewModel: {
        type: 'articleaddwindow'
    },
    shadow: true,
    height: 635,
    itemId: 'AddArticleWindow',
    resizable: 'true;',
    weight: 15,
    width: 650,
    bodyStyle: 'overflow-x:hidden;overflow-y:auto;',
    title: '升级为文章操作',
    modal: true,

    items: [
        {
            xtype: 'form',
            hidden: true,
            itemId: 'channelPiostInfoForm',
            layout: 'table',
            bodyPadding: 10,
            header: false,
            title: 'My Form',
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'articleAddWinPostId',
                    fieldLabel: '帖子ID',
                    labelWidth: 60
                },
                {
                    xtype: 'button',
                    itemId: 'channelPostInfoBt',
                    margin: '0 0 0 20px',
                    text: '导入帖子信息'
                }
            ]
        },
        {
            xtype: 'form',
            height: 600,
            id: 'articleAddWinForm',
            itemId: 'articleAddWinForm',
            width: 600,
            bodyPadding: 10,
            header: false,
            title: 'My Form',
            items: [
                {
                    xtype: 'checkboxgroup',
                    itemId: 'articleAddWindowColumn',
                    width: 570,
                    fieldLabel: '栏目',
                    labelWidth: 60
                },
                {
                    xtype: 'textfield',
                    height: 26,
                    id: 'ArticleTitile',
                    width: 573,
                    fieldLabel: '标题',
                    labelWidth: 60,
                    allowBlank: false,
                    maxLength: 25,
                    maxLengthText: '最大长度为25'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    id: 'ArticlePostId',
                    width: 573,
                    fieldLabel: '帖子id',
                    labelWidth: 60
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    id: 'articleAuthorUserId',
                    width: 573,
                    fieldLabel: '帖子id',
                    labelWidth: 60
                },
                {
                    xtype: 'textareafield',
                    id: 'ArticleSummary',
                    width: 573,
                    fieldLabel: '摘要',
                    labelWidth: 60,
                    allowBlank: false,
                    maxLength: 45,
                    maxLengthText: '摘要最大长度为{0}'
                },
                {
                    xtype: 'textfield',
                    id: 'ArticleAuthor',
                    width: 573,
                    fieldLabel: '作者',
                    labelWidth: 60,
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    id: 'ArticleShowflag',
                    width: 573,
                    fieldLabel: '标记位',
                    labelWidth: 60
                },
                {
                    xtype: 'radiogroup',
                    id: 'Display',
                    width: 436,
                    fieldLabel: '显示',
                    labelWidth: 60,
                    items: [
                        {
                            xtype: 'radiofield',
                            margin: '0 60;',
                            name: 'Display',
                            boxLabel: '不显示',
                            inputValue: 'n'
                        },
                        {
                            xtype: 'radiofield',
                            margin: '0 20;',
                            name: 'Display',
                            boxLabel: '显示',
                            checked: true,
                            inputValue: 'y'
                        }
                    ]
                },
                {
                    xtype: 'form',
                    height: 259,
                    itemId: 'ArticlePicUploadForm',
                    width: 537,
                    bodyPadding: '',
                    items: [
                        {
                            xtype: 'filefield',
                            width: 550,
                            fieldLabel: '文章图片',
                            labelWidth: 60,
                            name: 'file',
                            buttonText: '选择图片'
                        },
                        {
                            xtype: 'form',
                            height: 244,
                            itemId: 'articleAddWinUploadForm',
                            layout: 'table',
                            bodyPadding: 10,
                            items: [
                                {
                                    xtype: 'image',
                                    height: 200,
                                    id: 'AticlePIc',
                                    itemId: 'AticlePIc',
                                    width: 420
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'PicUploadButton',
                                    margin: 20,
                                    text: '上传'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    id: 'articleAddWinImage',
                    itemId: 'articleAddWinImage',
                    fieldLabel: '图片地址',
                    labelWidth: 90
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
                            height: '',
                            itemId: 'addAricleButton',
                            style: 'background:#22aee6;border:none;',
                            text: '提交'
                        }
                    ]
                }
            ]
        }
    ]

});