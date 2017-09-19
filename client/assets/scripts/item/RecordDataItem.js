cc.Class({
    extends: cc.Component,

    properties: {
        playerNameLabels: [cc.Label],
        playerPointLabels: [cc.Label],
        dateLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        // // test
        // var data = {};
        // data.players = [
        //     {name: "小猫", point: 100},
        //     {name: "小王", point: -200},
        //     {name: "小狗", point: 200},
        //     {name: "小哈", point: -100}
        // ];
        // data.date = "2017-8-9 12:34";
        // this.updateShow(data);
    },

    updateShow: function (data) {
        for (var i = 0; i < 4; i ++) {
            this.playerNameLabels[i].string = data.players[i].name;
            this.playerPointLabels[i].string = data.players[i].point;
        }
        this.dateLabel.string = data.date;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
