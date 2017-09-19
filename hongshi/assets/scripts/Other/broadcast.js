cc.Class({
    extends: cc.Component,

    properties: {
        wordNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        // test
        var date = new Date();
        var s = "当前时间：" + date.toLocaleString();
        this.showString(s);
        
        
        var deltaX = - this.node.width * 2;
        var moveBy = cc.moveBy(20, cc.p(deltaX, 0));
        var callFunc = cc.callFunc(()=>{
            this.wordNode.setPosition(cc.p(0, 0));
        })
        this.wordNode.runAction(cc.repeatForever(cc.sequence(moveBy, callFunc)));
    },

    showString: function (s) {
        this.wordNode.getComponent(cc.Label).string = s;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
