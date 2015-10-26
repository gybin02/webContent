/*
 * File: app/controller/Ga100Controller.js
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

Ext.define('GURUAdmin.controller.Ga100Controller', {
    extend: 'Ext.app.Controller',
    alias: 'controller.Ga100Controller',

    refs: {
        ga100FormPanel: '#Ga100FormPanel',
        ga100UploadImageBt: '#ga100UploadImageBt',
        ga100SumitBt: '#ga100SumitBt',
        ga100UploadForm: '#ga100UploadForm',
        ga100Image: '#ga100Image'
    },

    control: {
        "#ga100UploadImageBt": {
            click: 'onGa100UploadImageBtClick'
        },
        "#ga100SumitBt": {
            click: 'onGa100SumitBtClick'
        }
    },

    /* 港A100设置页面的上传事件 */
    onGa100UploadImageBtClick: function(button, e, eOpts) {
        var me = this;
        var ga100UploadForm = this.getGa100FormPanel().getForm();
        var picForm = this.getGa100UploadForm().getForm();
        picForm.submit({
            url: '../api/file/cms/GA100KMap',
            method:'POST',
            waitMsg: 'Uploading your file...',
            //返回的结果没有success:true,所以为失败
            failure: function(form, action) {
                var result = Ext.util.JSON.decode(action.response.responseText);
                if(result.statusCode == 200){
                    Ext.Msg.alert('成功', '你的文件已经成功上传');
                    ga100UploadForm.findField('image').setValue(result.result);
                    var uploadImage = me.getGa100Image();
                    uploadImage.setSrc(result.result);
                    Ext.Msg.alert('成功', '图片上传成功');
                }else{
                    Ext.Msg.alert('失败', '你的文件已经上传失败，失败的原因是:'+result.message);
                }

            }
        });
    },

    onGa100SumitBtClick: function(button, e, eOpts) {

        var me = this;
        var form = me.getGa100FormPanel().getForm();
        var index = form.findField('index').getValue();
        var change = form.findField('change').getValue();
        var netChange = form.findField('netChange').getValue();
        var image = form.findField('image').getValue();
        if(index!=''&&change!=''&&netChange!=''&&image!=''){
            me.sendField('GLH_GA100_INDEX',index);
            me.sendField('GLH_GA100_CHANGE',change);
            me.sendField('GLH_GA100_NET_CHANG',netChange);
            me.sendField('GLH_GA100_KMAP',image);
            Ext.Msg.alert('成功', '数据提交成功!');
        }else{
            Ext.Msg.alert('失败', '输入数据不完整!');
        }


    },

    /* 发送请求修改设置值 */
    sendField: function(configKey,configValue) {

        var params={};
        params.key=configKey;
        params.value=configValue;


        Ext.Ajax.request({
            url: '../api/config/set',
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            params: Ext.encode(params),
            success: function(response){
                var result=Ext.util.JSON.decode(response.responseText);
                if(result.statusCode==200){
                    return true;
                }else{
                    Ext.Msg.alert('失败', '发送'+params.key+'='+params.value+'失败了');
                    return false;
                }
            }
        });
    }

});