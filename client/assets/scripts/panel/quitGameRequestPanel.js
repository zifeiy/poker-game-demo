var hongshi = require('hongshi');
var netEngine = require('netEngine');

cc.Class({
    extends: cc.Component,

    properties: {
        describeLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    updateShow: function (data) {
        var idx = -1;
        if (this.game != null) {
            idx = this.game.roomData.ids.indexOf(hongshi.userData.id);
        }
        if (idx == -1) {
            this.describeLabel.string = '有错误';
        }
        else if (data.quitGameRequestList[idx] != null) {
            this.describeLabel.string = '等待其他玩家响应请求';
        }
        else {
            this.describeLabel.string = '有玩家发出了退房请求，是否退出比赛？';
        }
    },

    onClickConfirm: function () {
        if (this.game == null) {
            cc.log('quitGameRequestPanel.onClickConfirm:error:no game!');
            return;
        }
        var roomData = this.game.roomData;
        var data = {
            roomId: roomData.roomId,
            request: true,
            isInitiator: false
        };
        netEngine.send('quitGameRequest', data);
    },

    onClickCancel: function () {
        if (this.game == null) {
            cc.log('quitGameRequestPanel.onClickCancel:error:no game!');
            return;
        }
        var roomData = this.game.roomData;
        var data = {
            roomId: roomData.roomId,
            request: false,
            isInitiator: false
        };
        netEngine.send('quitGameRequest', data);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
