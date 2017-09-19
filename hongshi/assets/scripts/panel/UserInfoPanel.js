var hongshi = require('hongshi');
var nativeLoader = require('nativeLoader');

cc.Class({
    extends: cc.Component,

    properties: {
        pictureNode: cc.Node,
        usernameLabel: cc.Label,
        idLabel: cc.Label,
        ipLabel: cc.Label,
        addressLabel: cc.Label,
        userPicSprite: cc.Sprite,
        ipNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        // 获取网上得到的本地图片
        var url = hongshi.userData.avatarUrl;
        nativeLoader.loadNative(hongshi.userData.id, url, (spriteFrame)=>{
            this.userPicSprite.spriteFrame = spriteFrame;
        });
    },

    updateInfo: function (info) {
        this.usernameLabel.string = info.name;
        this.idLabel.string = info.id;
        this.ipLabel.string = info.ip;
        this.addressLabel.string = info.address;
        if (info.ip != null && info.ip.length > 4) {
            var ipS = info.ip;
            if (ipS.substring(0, 7) == '::ffff:') {
                ipS = ipS.substring(7);
            }
            this.ipNode.active = true;
            this.ipLabel.string = ipS;
        }
        else {
            this.ipNode.active = false;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
