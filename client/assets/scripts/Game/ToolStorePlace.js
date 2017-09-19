var audioPlayer = require('audioPlayer');

cc.Class({
    extends: cc.Component,

    properties: {
        clock: cc.Node,
        timeLabel: cc.Label,

        timeOutAudio: {url: cc.AudioClip,default: null},
    },

    // use this for initialization
    onLoad: function () {
        this.schedule(()=>{
            var num = parseInt(this.timeLabel.string);
            if (num > 0) num -= 1;
            this.timeLabel.string = num;
            if (num >= 1 && num <= 5) {
                audioPlayer.playYinXiao(this.timeOutAudio);
            }
        }, 1);
    },

    converToNodeWithTime: function (node, time) {
        this.clock.parent = node;
        this.clock.setPosition(0, 0);
        this.clock.width = node.width;
        this.clock.height = node.height;
        this.timeLabel.string = time;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
