cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.node.opacity = 0;
    },
    
    showMessage: function (msg) {
        this.label.string = msg;

        var fadeIn = cc.fadeIn(0.3);
        var nothing = cc.moveBy(0.5, cc.p(0, 0));
        var fadeOut = cc.fadeOut(1);
        var callFunc = cc.callFunc(()=>{
            this.node.destroy();
        });
        this.node.runAction(cc.sequence(fadeIn, nothing, fadeOut, callFunc));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
