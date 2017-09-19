cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.node.opacity = 0;
        var moveTo1 = cc.moveTo(0, cc.p(this.node.width, 0));
        var moveTo2 = cc.moveTo(0.3, cc.p(0, 0));
        this.node.runAction(cc.sequence(moveTo1, moveTo2));
        this.scheduleOnce(()=>{
            this.node.opacity = 255;
        }, 0);
    },

    animateAndDestroy: function () {
        var moveTo = cc.moveTo(0.3, cc.p(this.node.width, 0));
        var callFunc = cc.callFunc(()=>{
            this.node.destroy();
        });
        this.node.runAction(cc.sequence(moveTo, callFunc));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
