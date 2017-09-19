cc.Class({
    extends: cc.Component,

    properties: {
        pointList: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var tmpDate = parseInt(Date.now() / 1000);
        if (this.time != null && this.time == tmpDate) {
            return;
        }
        this.time = tmpDate;
        if (this.pointNum == null) {
            this.pointNum = 2;
        }
        this.pointNum = (this.pointNum + 1) % 3;
        var num = this.pointNum + 1;
        for (var i = 0; i < num; i ++) {
            this.pointList[i].active = true;
        }
        for (var i = num; i < 3; i ++) {
            this.pointList[i].active = false;
        }
    },
});

