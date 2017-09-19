var hongshi = require('hongshi');
var netEngine = require('netEngine');
var audioPlayer = require('audioPlayer');
var ScreenShoter = require('ScreenShoter');
var SDKManager = require('SDKManager');

cc.Class({
    extends: cc.Component,

    properties: {
        roomInfoLabel: cc.Label,
        timeLabel: cc.Label,
        items: [require('FinalResultItem')],

        winAudio: {url: cc.AudioClip, default: null},       // 获胜时播放的音效
        loseAudio: {url: cc.AudioClip, default: null},      // 失败时播放的音效
    },

    // use this for initialization
    onLoad: function () {
    },

    initPanel: function (data) {
        if (data.turn > data.totTurn) {
            data.turn = data.totTurn;
        }
        this.roomInfoLabel.string = "房号" + data.roomId + '  局数' + data.turn + '/' + data.totTurn;
        this.timeLabel.string = data.time;
        for (var i = 0; i < 4; i ++) {
            this.items[i].initItem(data.items[i]);
        }
        var myPoint = 0;
        data.items.forEach((item)=>{
            if (item.id == hongshi.userData.id) {
                myPoint = item.point;
            }
        });
        if (myPoint >= 0) {
            audioPlayer.playYinXiao(this.winAudio);
        }
        else {
            audioPlayer.playYinXiao(this.loseAudio);
        }
    },

    onClickClose: function () {
        netEngine.unRegister('enterroom');
        cc.director.loadScene('scenes/Hall', ()=>{
            hongshi.userData.roomId = null;
        });
    },

    onClick_share_friend: function () {
        // 截屏 & 分享网页信息
        ScreenShoter.screenShot((filepath)=>{
            console.log('share:filepath=' + filepath);
            if (filepath == null) {
                cc.log('share error: filepath is null!!');
                netEngine.send('test', {a: 'begin error & return'});
                return;
            }
            var info = {
                shareTo: "0",
                mediaType: "2",
                imagePath: "" + filepath,
                thumbSize: "120",
                url: "http://huaban.com/",
                title: "我在欢乐红十打牌，赶快来啊",
                text: "房间号:" + hongshi.userData.roomId
            };
            SDKManager.share(info);
        });
    },

    onClick_share_pengyouquan: function () {
        // 截屏 & 分享网页信息
        ScreenShoter.screenShot((filepath)=>{
            console.log('share:filepath=' + filepath);
            if (filepath == null) {
                cc.log('share error: filepath is null!!');
                netEngine.send('test', {a: 'begin error & return'});
                return;
            }
            var info = {
                shareTo: "1",
                mediaType: "2",
                imagePath: "" + filepath,
                thumbSize: "120",
                url: "http://huaban.com/",
                title: "我在欢乐红十打牌，赶快来啊",
                text: "房间号:" + hongshi.userData.roomId
            };
            SDKManager.share(info);
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
