cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.node.opacity = 0;
        this.node.scale = 0;
        var fadeIn = cc.fadeIn(0.5);
        var fadeOut = cc.fadeOut(0.5);
        var scale1 = cc.scaleTo(0.5, 1);
        var scale0 = cc.scaleTo(0.5, 0);
        var nothing = cc.moveBy(2, 0, 0);
        this.node.runAction(cc.repeatForever(cc.sequence(cc.spawn(fadeIn,scale1), cc.spawn(fadeOut, scale0), nothing)));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
