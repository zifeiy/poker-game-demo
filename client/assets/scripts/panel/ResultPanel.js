var hongshi = require('hongshi');
var netEngine = require('netEngine');
var audioPlayer = require('audioPlayer');
var nativeLoader = require('nativeLoader');

cc.Class({
    extends: cc.Component,

    properties: {
        WinOutBack: cc.Node,
        LoseOutBack: cc.Node,
        TieOutBack: cc.Node,
        WinTitle: cc.Node,
        LoseTitle: cc.Node,
        TieTitle: cc.Node,
        resultItemList: [require('ResultItem')],
        nowDoubleNode: cc.Node,
        nowDoubleLabel: cc.Label,
        nowTotPointLabel: cc.Label,
        liangshiNode: cc.Node,

        winAudio: {url: cc.AudioClip, default: null},       // 获胜时播放的音效
        loseAudio: {url: cc.AudioClip, default: null},      // 失败时播放的音效

        myPic: cc.Sprite,       // 左边的我的大图
        picList: [cc.Sprite],   // 右边四列的角色图片
    },

    // use this for initialization
    onLoad: function () {
    },

    initPanel: function (data) {
        var win = data.win;
        if (win == true) {  // true: 获胜
            this.WinOutBack.active = true;
            this.WinTitle.active = true;
            this.LoseOutBack.active = false;
            this.LoseTitle.active = false;
            this.TieOutBack.active = false;
            this.TieTitle.active = false;
        }
        else if (win == false) {    // false: 失败
            this.WinOutBack.active = false;
            this.WinTitle.active = false;
            this.LoseOutBack.active = true;
            this.LoseTitle.active = true;
            this.TieOutBack.active = false;
            this.TieTitle.active = false;
        }
        else {          // null: 平局
            this.WinOutBack.active = false;
            this.WinTitle.active = false;
            this.LoseOutBack.active = false;
            this.LoseTitle.active = false;
            this.TieOutBack.active = true;
            this.TieTitle.active = true;
        }
        // 播放音效
        if (win != false) {
            audioPlayer.playYinXiao(this.winAudio);
        }
        else {
            audioPlayer.playYinXiao(this.loseAudio);
        }

        for (var i = 0; i < 4; i ++) {
            this.resultItemList[i].initData(data.itemData[i]);
        }
        this.scheduleOnce(()=>{
            this.node.getComponent('AnimInAndOut').animateAndDestroy();
        }, 10);
        if (data.double == 1) {
            this.nowDoubleNode.active = false;
        }
        else {
            this.nowDoubleNode.active = true;
            this.nowDoubleLabel.string = data.double;
        }
        this.nowTotPointLabel.string = data.nowTotPoint;
        this.liangshiNode.active = (data.allShowRed == true);

        // 加载本地图片
        nativeLoader.loadNative(hongshi.userData.id, hongshi.userData.avatarUrl, (spriteFrame)=>{
            this.myPic.spriteFrame = spriteFrame;
        });
        for (var i = 0; i < 4; i ++) {
            let idx = i;
            var id = data.ids[idx];
            var url = hongshi.playersInfo[id].avatarUrl;
            if (url == null) {
                cc.log('can not get id = ' + id + ' info...');
                return;
            }
            nativeLoader.loadNative(id, url, (spriteFrame)=>{
                this.picList[idx].spriteFrame = spriteFrame;
            });
        }
    },

    onClick: function () {
        netEngine.send('roomPrepare', {roomId: hongshi.userData.roomId, prepare: true});
    },

    onDestroy: function () {
        this.unscheduleAllCallbacks();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
