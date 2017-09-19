var netEngine = require('netEngine');
var ui = require('uicreator');

cc.Class({
    extends: cc.Component,

    properties: {
        describeNode: cc.Node,
        registerNode: cc.Node,
        nameEditBox: cc.EditBox,
        phoneEditBox: cc.EditBox,
        wechatEditBox: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {
        this.describeNode.active = true;
        this.registerNode.active = false;
    },

    onClickShowRegister: function () {
        this.describeNode.active = false;
        this.registerNode.active = true;
    },

    onClickConfirmRegister: function () {
        cc.log('AgentPanel: onClick confirm register');
        var name = this.nameEditBox.string;
        var phone = this.phoneEditBox.string;
        var wechat = this.wechatEditBox.string;
        if (name.length == 0) {
            ui.createScreenMsg('姓名不能为空');
            return;
        }
        if (phone.length == 0) {
            ui.createScreenMsg('手机号不能为空');
            return;
        }
        if (wechat.length == 0) {
            ui.createScreenMsg('微信号不能为空');
            return;
        }
        var sendData = {
            name: name,
            phone: phone,
            wechat: wechat
        };
        netEngine.send('agentRegister', sendData, (resData)=>{
            if (resData.result == true) {
                ui.createScreenMsg('提交成功，等待官方审核...');
                this.node.getComponent('AnimInAndOut').animateAndDestroy();
            }
            else {
                ui.createScreenMsg('提交失败，请重新输入');
            }
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
