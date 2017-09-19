cc.Class({
    extends: cc.Component,

    properties: {
        labelNode: cc.Node,
        talkId: 0,
        panel: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var w1 = this.node.width;
        var w2 = this.labelNode.width;
        if (w2 > w1) {
            var moveTo1 = cc.moveTo(2, cc.p((w2-w1)/2+20, 0));
            var moveTo2 = cc.moveTo(2, cc.p((w1-w2)/2-20));
            var nothing = cc.moveBy(2, cc.p(0, 0));
            this.labelNode.x = (w2-w1)/2+20;
            this.labelNode.runAction(cc.repeatForever(cc.sequence(moveTo1, nothing, moveTo2, nothing)));
        }
        else {
            this.labelNode.x = (w2-w1)/2+20;
        }
    },

    onClickTalk: function () {
        cc.log('Chat onClick Talk begin');
        this.panel.getComponent('ChatPanel').convenientTalk(this.talkId);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
