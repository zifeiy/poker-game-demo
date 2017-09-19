cc.Class({
    extends: cc.Component,

    properties: {
        wordLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    showWord: function (content) {
        this.node.stopAllActions();
        this.node.opacity = 0;
        this.wordLabel.string = content;
        this.node.width = this.wordLabel.node.width;
        var fadeIn = cc.fadeIn(0.8);
        var nothing = cc.moveBy(0.5, cc.p(0, 0));
        var fadeOut = cc.fadeOut(0.8);
        this.node.runAction(cc.sequence(fadeIn, nothing, fadeOut));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
