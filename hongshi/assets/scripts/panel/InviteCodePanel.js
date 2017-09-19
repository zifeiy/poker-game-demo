var hongshi = require('hongshi');
var ui = require("uicreator");

cc.Class({
    extends: cc.Component,

    properties: {
        numLabelList: [cc.Label],
        promptNode: cc.Node,
        promptLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.numList = [];
        this.showNum();
        this.updateShowInviteCode();
    },

    updateShowInviteCode: function () {
        if (hongshi.userData.inviteCode != null) {
            this.promptNode.active = true;
            this.promptLabel.string = hongshi.userData.inviteCode;
        }
        else {
            this.promptNode.active = false;
        }
    },

    showNum: function () {
        var len = this.numList.length;
        if (len > 6) len = 6;
        for (var i = 0; i < len; i ++) {
            this.numLabelList[i].string = this.numList[i];
        }
        for (var i = len; i < 6; i ++) {
            this.numLabelList[i].string = ""; 
        }
    },

    onClickNum: function (num) {
        if (this.numList.length < 6) {
            this.numList.push(num);
            this.showNum();
        }
        if (this.numList.length >= 6) {
            this.confirm();
        }
    },

    onClick_0: function () { this.onClickNum(0); },
    onClick_1: function () { this.onClickNum(1); },
    onClick_2: function () { this.onClickNum(2); },
    onClick_3: function () { this.onClickNum(3); },
    onClick_4: function () { this.onClickNum(4); },
    onClick_5: function () { this.onClickNum(5); },
    onClick_6: function () { this.onClickNum(6); },
    onClick_7: function () { this.onClickNum(7); },
    onClick_8: function () { this.onClickNum(8); },
    onClick_9: function () { this.onClickNum(9); },

    onClickClear: function () {
        this.numList = [];
        this.showNum();
    },

    onClickDelete: function () {
        this.numList.pop();
        this.showNum();
    },

    confirm: function () {
        if (this._checkNum()) {
            ui.createScreenMsg("激活码已绑定");
            // test
            var code = this._getInviteCode();
            hongshi.userData.inviteCode = code;
            this.updateShowInviteCode();
        }
        else {
            ui.createScreenMsg("激活码错误");
            this.onClickClear();
        }
    },

    _checkNum: function () {
        if (this.numList.length != 6) return false;
        // test
        for (var i = 0; i < 6; i ++) {
            if (this.numList[i] != i+1) 
                return false;
        }
        return true;
    },

    _getInviteCode: function () {
        var res = 0;
        for (var i = 0; i < 6; i ++) {
            res = res * 10 + this.numList[i];
        }
        return res;
    },

    onClickDestroy: function () {
        this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
