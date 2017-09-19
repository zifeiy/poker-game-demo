cc.Class({
    extends: cc.Component,

    properties: {
        startRotation: 0,
        endRotation: 20,
        deltaTime: 1,
    },

    // use this for initialization
    onLoad: function () {
        this.node.rotation = this.startRotation;
        var rotateTo1 = cc.rotateTo(this.deltaTime, this.endRotation);
        var rotateTo2 = cc.rotateTo(this.deltaTime, this.startRotation);
        this.node.runAction(cc.repeatForever(cc.sequence(rotateTo1, rotateTo2)));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
