var hongshi = require('hongshi');
var ui = require('uicreator');
var netEngine = require('netEngine');

cc.Class({
    extends: cc.Component,

    properties: {
        leaveRoomNode: cc.Node,
        requestQuitGameNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.isDowned = false;
    },

    onClickStar: function () {
        if (this.isRunningAnim == true) {
            return;
        }
        this.isRunningAnim = true;
        if (this.isDowned == false) { // 上往下
            var moveBy1 = cc.moveBy(0.6, cc.p(0, -110));
            var moveBy2 = cc.moveBy(0.15, cc.p(0, 10));
            var callFunc = cc.callFunc(()=>{
                this.isRunningAnim = null;
            });
            this.node.runAction(cc.sequence(moveBy1, moveBy2, callFunc));
        }
        else {                      // 下往上
            var moveBy1 = cc.moveBy(0.15, cc.p(0, -10));
            var moveBy2 = cc.moveBy(0.6, cc.p(0, 110));
            var callFunc = cc.callFunc(()=>{
                this.isRunningAnim = null;
            });
            this.node.runAction(cc.sequence(moveBy1, moveBy2, callFunc));
        }
        this.isDowned = !this.isDowned;
    },

    onClickHelp: function () {
        ui.createHowToPlayPanel();
    },

    onClickSetting: function () {
        ui.createSettingPanel();
    },

    onClickLeaveRoom: function () {
        cc.log('onClick LeaveRoom');
        netEngine.send('tryLeaveRoom', {roomId: hongshi.userData.roomId}, (data)=>{
            if (data.canLeave == true) {
                netEngine.unRegister('enterroom');
                cc.director.loadScene('scenes/Hall', ()=>{
                    hongshi.userData.roomId = null;
                });
            }
        });
    },

    onClickRequestQuitGame: function () {
        cc.log('onClick RequestQuitGame');
        var data = {
            roomId: hongshi.userData.roomId,
            request: true,
            isInitiator: true
        };
        netEngine.send('quitGameRequest', data);
    },    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
