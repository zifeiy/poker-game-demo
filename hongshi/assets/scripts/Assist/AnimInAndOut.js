cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        // onLoad要执行的全都在onEnable中进行了
    },

    onEnable: function () {
        this.node.opacity = 0;
        this.node.setScale(0);
        var fadeIn = cc.fadeIn(0.2);
        var scaleTo = cc.scaleTo(0.2, 1);
        this.node.runAction(cc.spawn(fadeIn, scaleTo));
    },

    animateAndDestroy: function () {
        if (this.isDestroying) {
            return;
        }
        this.isDestroying = true;
        
        var fadeOut = cc.fadeOut(0.2);
        var scaleTo = cc.scaleTo(0.2, 0);
        var callFunc = cc.callFunc(()=>{
            if (this.node) {
                this.node.destroy();
            }
        });
        this.node.runAction(cc.sequence(cc.spawn(fadeOut, scaleTo), callFunc));
    },

    animateAndDisable: function () {
        if (this.isDestroying) {
            return;
        }
        this.isDestroying = true;
        
        var fadeOut = cc.fadeOut(0.2);
        var scaleTo = cc.scaleTo(0.2, 0);
        var callFunc = cc.callFunc(()=>{
            this.node.active = false;
        });
        this.node.runAction(cc.sequence(cc.spawn(fadeOut, scaleTo), callFunc));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
