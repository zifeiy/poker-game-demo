var hongshi = require('hongshi');
var ui = require('uicreator');

cc.Class({
    extends: cc.Component,

    properties: {
        idLabel: cc.Label,
        roomIdLabel: cc.Label,
        dateLabel: cc.Label,
        playerLabels: [cc.Label],
    },

    // use this for initialization
    onLoad: function () {
    },

    updateInfo: function (data) {
        this.recordId = data.recordId;  // 用于进入 该场历史战斗的详细信息界面使用

        this.idLabel.string = data.id;
        this.roomIdLabel.string = "房号: " + data.roomId;
        this.dateLabel.string = data.date;
        for (var i = 0; i < this.playerLabels.length; i ++) {
            this.playerLabels[i].string = data.players[i].name + " " + data.players[i].point;
        }
    },

    onClickDetail: function () {
        if (hongshi.recordList == null || hongshi.recordList[this.recordId] == null) {
            return;
        }
        var data = hongshi.recordList[this.recordId];
        ui.createRecordDetailPanel(data);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
