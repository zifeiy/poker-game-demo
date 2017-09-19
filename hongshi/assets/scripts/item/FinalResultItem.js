var hongshi = require('hongshi');
var nativeLoader = require('nativeLoader');

cc.Class({
    extends: cc.Component,

    properties: {
        picSprite: cc.Sprite,
        nameLabel: cc.Label,
        idLabel: cc.Label,
        topLabel: cc.Label, // 单局最高
        winTimeLabel: cc.Label,
        loseTimeLabel: cc.Label,
        tieTimeLabel: cc.Label,
        winFlagNode: cc.Node,
        loseFlagNode: cc.Node,
        tieFlagNode: cc.Node,
        winPointNode: cc.Node,
        losePointNode: cc.Node,
        tiePointNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    initItem: function (data) {
        this.nameLabel.string = data.name;
        this.idLabel.string = 'ID ' + data.id;
        this.topLabel.string = data.top;
        this.winTimeLabel.string = data.winTime,
        this.loseTimeLabel.string = data.loseTime;
        this.tieTimeLabel.string = data.tieTime;
        if (data.point > 0) {   // win
            this.winFlagNode.active = true;
            this.loseFlagNode.active = false;
            this.tieFlagNode.active = false;
            this.winPointNode.active = true;
            this.losePointNode.active = false;
            this.tiePointNode.active = false;
            this.winPointNode.getComponent(cc.Label).string = "+" + data.point;
        }
        else if (data.point < 0) {  // lose
            this.winFlagNode.active = false;
            this.loseFlagNode.active = true;
            this.tieFlagNode.active = false;
            this.winPointNode.active = false;
            this.losePointNode.active = true;
            this.tiePointNode.active = false;
            this.losePointNode.getComponent(cc.Label).string = data.point;
        }
        else {  // tie
            this.winFlagNode.active = false;
            this.loseFlagNode.active = false;
            this.tieFlagNode.active = true;
            this.winPointNode.active = false;
            this.losePointNode.active = false;
            this.tiePointNode.active = true;
            this.tiePointNode.getComponent(cc.Label).string = data.point;
        }

        // 头像
        var url = hongshi.playersInfo[data.id].avatarUrl;
        nativeLoader.loadNative(data.id, url, (spriteFrame)=>{
            this.picSprite.spriteFrame = spriteFrame;
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
