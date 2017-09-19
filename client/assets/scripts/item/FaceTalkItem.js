cc.Class({
    extends: cc.Component,

    properties: {
        picId: 0,
        panel: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onClickTalk: function () {
        this.panel.getComponent('ChatPanel').faceTalk(this.picId);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
