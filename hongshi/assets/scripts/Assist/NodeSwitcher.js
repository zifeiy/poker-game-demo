cc.Class({
    extends: cc.Component,

    properties: {
        nodeList: [cc.Node],
        deltaTime: 0.5,
    },

    // use this for initialization
    onLoad: function () {
        this.nodeList.forEach((node)=>{
            node.active = false;
        });
        this.id = this.nodeList.length - 1;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var tmpTime = parseInt(Date.now() / (1000 * this.deltaTime));
        if (this.recordTime != null && this.recordTime == tmpTime) {
            return;
        }
        this.recordTime = tmpTime;
        this.nodeList[this.id].active = false;
        this.id = (this.id + 1) % this.nodeList.length;
        this.nodeList[this.id].active = true;
    },
});
