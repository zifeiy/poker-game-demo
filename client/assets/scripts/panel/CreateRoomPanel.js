var netEngine = require('netEngine');
var ui = require('uicreator');
var hongshi = require('hongshi');

cc.Class({
    extends: cc.Component,

    properties: {
        shopSelectItems: [cc.Node],
        shopShowNodes: [cc.Node],
        tipNodes: [cc.Node],
        question0Nodes: [cc.Node],
        question1Nodes: [cc.Node],

        turn5Toggle: cc.Toggle,
        turn8Toggle: cc.Toggle,
        bigenToggle: cc.Toggle,
        notBigenToggle: cc.Toggle,
        doubleToggle: cc.Toggle,
        noDoubleToggle: cc.Toggle,
        againstCheatToggle: cc.Toggle,
    },

    // use this for initialization
    onLoad: function () {
        this.shopSelectItems.forEach((node)=>{
            node.getComponent("ShopSelectedItem").shopPanel = this;
        });
        this.onClickSelect(0);

        this.question0Nodes.forEach((node)=>{
            node.on('touchstart', this.showTip0, this);
        });
        this.question1Nodes.forEach((node)=>{
            node.on('touchstart', this.showTip1, this);
        });
        this.question0Nodes.forEach((node)=>{
            node.on('touchend', this.hideTip, this);
        });
        this.question1Nodes.forEach((node)=>{
            node.on('touchend', this.hideTip, this);
        });
        this.question0Nodes.forEach((node)=>{
            node.on('touchcancel', this.hideTip, this);
        });
        this.question1Nodes.forEach((node)=>{
            node.on('touchcancel', this.hideTip, this);
        });
    },

    onDestroy: function () {
        this.question0Nodes.forEach((node)=>{
            node.off('touchstart', this.showTip0, this);
        });
        this.question1Nodes.forEach((node)=>{
            node.off('touchstart', this.showTip1, this);
        });
        this.question0Nodes.forEach((node)=>{
            node.off('touchend', this.hideTip, this);
        });
        this.question1Nodes.forEach((node)=>{
            node.off('touchend', this.hideTip, this);
        });
        this.question0Nodes.forEach((node)=>{
            node.off('touchcancel', this.hideTip, this);
        });
        this.question1Nodes.forEach((node)=>{
            node.off('touchcancel', this.hideTip, this);
        });
    },

    onClickSelect: function (idx) {
        this.chooseIdx = idx;
        for (var i = 0; i < this.shopShowNodes.length; i ++) {
            this.shopShowNodes[i].active = (idx == i);
        }
        for (var i = 0; i < this.shopSelectItems.length; i ++) {
            var clicked = (i == idx);
            this.shopSelectItems[i].getComponent("ShopSelectedItem").updateShow(clicked);
        }
    },

    showTip: function (idx) {
        this.tipNodes[idx].active = true;
        this.tipNodes[1-idx].active = false;
    },

    showTip0: function () {
        this.showTip(0);
    },
    showTip1: function () {
        this.showTip(1);
    },

    hideTip: function () {
        this.tipNodes.forEach((node)=>{
            node.active = false;
        });
    },

    onClickCreateRoom: function () {
        var configData = this.getConfigureData();
        netEngine.send('createNewRoom', configData, (data1)=>{
            var roomId = data1.roomId;
            if (roomId == -1) {
                ui.createScreenMsg('房间已满，创建失败');
                return;
            }
            hongshi.userData.roomId = roomId;
            cc.director.loadScene('scenes/Game');
        });
    },

    getConfigureData: function () {
        var configData = {};
        // 局数选择：5局 或 8局
        if (this.turn5Toggle.isChecked) {
            configData.totTurn = 5;
        }
        else if (this.turn8Toggle.isChecked) {
            configData.totTurn = 8;
        }
        // 有亮必跟 
        if (this.bigenToggle.isChecked) {
            configData.youliangbigen = true;
        }
        else if (this.notBigenToggle.isChecked) {
            configData.youliangbigen = false;
        }
        // 平局翻倍
        if (this.doubleToggle.isChecked) {
            configData.pingjufanbei = true;
        }
        else if (this.noDoubleToggle.isChecked) {
            configData.pingjufanbei = false;
        }
        // 防作弊模式
        if (this.againstCheatToggle.isChecked) {
            configData.againstCheat = true;
        }
        else {
            configData.againstCheat = false;
        }
        return configData;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
