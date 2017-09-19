cc.Class({
    extends: cc.Component,

    properties: {
        front_firstNode: cc.Node,
        front_secondNode: cc.Node,
        front_thirdNode: cc.Node,
        name_winLabel: cc.Node,
        name_loseLabel: cc.Node,
        point_winLabel: cc.Node,
        point_loseLabel: cc.Node,
        hongtaoNode: cc.Node,
        fangkuaiNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        
    },

    initData: function (data) {
        // rank
        if (data.rank == 1) {
            this.front_firstNode.active = true;
            this.front_secondNode.active = false; 
            this.front_thirdNode.active = false;   
        }
        else if (data.rank == 2) {
            this.front_secondNode.active = false;
            this.front_secondNode.active = true;
            this.front_thirdNode.active = false;
        }
        else if (data.rank == 3) {
            this.front_secondNode.active = false;
            this.front_secondNode.active = false;
            this.front_thirdNode.active = true;
        }
        else {
            this.front_firstNode.active = false;
            this.front_secondNode.active = false;
            this.front_thirdNode.active = false;
        }
        // pic
        // ...
        // name & point
        if (data.win == true) {
            this.name_winLabel.active = true;
            this.name_loseLabel.active = false;
            this.point_winLabel.active = true;
            this.point_loseLabel.active = false;
            this.name_winLabel.getComponent(cc.Label).string = data.name;
            var pointString = "";
            if (data.point > 0) pointString = "+";
            pointString += data.point + "分";
            this.point_winLabel.getComponent(cc.Label).string = pointString;
        }
        else {
            this.name_loseLabel.active = true;
            this.name_winLabel.active = false;
            this.point_winLabel.active = false;
            this.point_loseLabel.active = true;
            this.name_loseLabel.getComponent(cc.Label).string = data.name;
            var pointString = "" + data.point + "分";
            this.point_loseLabel.getComponent(cc.Label).string = pointString;
        }
        // flowers
        this.hongtaoNode.active = (data.redCards.indexOf(210) != -1);
        this.fangkuaiNode.active = (data.redCards.indexOf(410) != -1);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
