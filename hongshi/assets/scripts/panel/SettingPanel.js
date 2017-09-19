var audioPlayer = require('audioPlayer');

cc.Class({
    extends: cc.Component,

    properties: {
        settingItemList: [require('SettingItem')],
    },

    // use this for initialization
    onLoad: function () {
        this.yinXiao = audioPlayer.getYinXiao();
        this.yinLiang = audioPlayer.getYinLiang();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var yinXiao = this.settingItemList[0].value;
        var yinLiang = this.settingItemList[1].value;
        if (yinXiao == null || yinLiang == null) {
            return;
        }
        if (parseInt(yinXiao * 10) != parseInt(this.yinXiao * 10)) {
            audioPlayer.setYinXiao(yinXiao);
        }
        if (parseInt(yinLiang * 10) != parseInt(this.yinLiang * 10)) {
            audioPlayer.setYinLiang(yinLiang);
        }
    },
});
