cc.Class({
    extends: cc.Component,

    properties: {
        positionList: [cc.Node],
        waitTime: 1,
        deltaTime: 0.2,
    },

    // use this for initialization
    onLoad: function () {
        this.tot = this.positionList.length;
        this.id = 0;
        this.timer = 1;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var tmpTime = parseInt(Date.now() / (1000 * this.deltaTime));
        if (this.recordTime != null && this.recordTime == tmpTime) {
            return;
        }
        this.recordTime = tmpTime;

        if (this.timer > 0) {
            this.timer -= this.deltaTime;
            this.node.opacity = 0;
        }
        else {
            this.node.opacity = 255;
            if (this.idx == null) {
                this.idx = 0;
            }
            else {
                this.idx ++;
            }
            if (this.idx >= this.tot) {
                this.timer = 1;
                this.idx = null;
            }
            else {
                this.node.x = this.positionList[this.idx].x;
                this.node.y = this.positionList[this.idx].y;
            }
        }
    },
});
