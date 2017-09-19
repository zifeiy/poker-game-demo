var hongshi = require('hongshi');
var SDKManager = require('SDKManager');
var nativeLoader = require('nativeLoader');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {

    },

    onClick_share_friend: function () {
        // 截屏 & 分享网页信息
        var share_id = 'icon';
        var share_url = 'http://101.37.19.68/icon.png'; // icon图片地址
        nativeLoader.loadNativeWithCallbackFilePath(share_id, share_url, (filepath)=>{
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
        var share_id = 'icon';
        var share_url = 'http://101.37.19.68/icon.png'; // icon图片地址
        nativeLoader.loadNativeWithCallbackFilePath(share_id, share_url, (filepath)=>{
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
