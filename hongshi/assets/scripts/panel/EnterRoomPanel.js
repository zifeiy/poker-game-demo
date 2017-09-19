var hongshi = require('hongshi');
var ui = require("uicreator");
var netEngine = require('netEngine');

cc.Class({
    extends: cc.Component,

    properties: {
        numLabelList: [cc.Label],
    },

    // use this for initialization
    onLoad: function () {
        this.numList = [];
        this.showNum();

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
        this.confirm();
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
            var roomId = this._getNum();
            netEngine.send('joinRoom', {roomId: roomId}, (data)=>{
                cc.log('EnterRoom afterClick: ' + JSON.stringify(data));
                if (data.roomExist) {
                    hongshi.userData.roomId = this._getNum();
                    cc.director.loadScene('scenes/Game'); 
                }
                else {
                    ui.createScreenMsg('房间号不存在，请重新输入');
                    this.numList = [];
                    this.showNum();
                }
            });
        }
    },

    _checkNum: function () {
        if (this.numList.length != 6) return false;
        
        return true;
    },

    _getNum: function () {
        var res = 0;
        for (var i = 0; i < this.numList.length; i ++) {
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
