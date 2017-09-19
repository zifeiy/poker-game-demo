var hongshi = require('hongshi');
var netEngine = require('netEngine');
var audioPlayer = require('audioPlayer');
var SDKManager = require('SDKManager');

cc.Class({
    extends: cc.Component,

    properties: {
        serverAddressEditBox: cc.EditBox,
        idEditBox: cc.EditBox,   

        bgMusic: {url: cc.AudioClip,default: null}, 
    },

    // use this for initialization
    onLoad: function () {
        // 随机一个id
        this.idEditBox.string = Math.floor(Math.random() * 1000000);

        // 获得IP地址
        this.getIpAddress();

        cc.director.preloadScene('scenes/Hall', ()=>{
            cc.log('Hall:xx:preLoaded');
        });
        cc.director.preloadScene('scenes/Game', ()=>{
            cc.log('Game:xx:preLoaded');
        });
        // 登陆界面 播放背景音乐
        audioPlayer.playerBgMusic(this.bgMusic);
    },

    onClickLogin: function () {
        if (this.serverAddressEditBox.string.length > 0) {
            hongshi.serverAddress = this.serverAddressEditBox.string;
        }
        var uid = this.idEditBox.string;
        hongshi.userData.id = uid;
        var sendData = {
            uid: uid,
            ip: hongshi.userData.ip
        };
        netEngine.send('login', sendData, (data)=>{
            if (data == null) {
                // 如果不存在这个用户，则系统随机生成一个用户信息
                var registerData = {
                    uid: uid,
                    name: '游客' + uid,
                    avatarUrl: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM6QaUUp10ojCU23hItZVZ1fFMWpTIo93Z1IBykhLka0xhDbOdic9ssyVdBvCF79ftibCaOJzyHmXEEwJa0AYwsKAFHacRKIjibAKM/0",
                    sex: Math.floor(Math.random() * 3),
                    city: '杭州',
                    language: '中文',
                    isVip: Math.floor(Math.random() * 2),
                    province: '浙江省',
                    country: '中国',
                    privilege: null,
                    unionid: '游客unionId-' + uid,
                    ip: hongshi.userData.ip
                };
                netEngine.send('register', registerData, (resData)=>{
                    if (resData.result == true) {
                        cc.log('register:get: ' + JSON.stringify(resData.userData));
                        hongshi.userData = resData.userData;
                        cc.director.loadScene('scenes/Hall');
                    }
                });
            }
            else {
                hongshi.userData = data;
                cc.director.loadScene('scenes/Hall');
            }
        });
    },

    onClickWeiXinLogin: function () {
        hongshi.serverAddress = 'ws://101.37.19.68:8011';
        SDKManager.login();
    },

    getIpAddress: function () {
        if (cc.sys.isNative) {
            window.io = SocketIO.connect;
        }
        else {
            require('socket.io');
        }
        var socket = io('http://101.37.19.68:8012');

        socket.on('connected', (msg)=>{
            if (msg != null && msg[0] == '"' && msg[msg.length-1] == '"') {
                var len = msg.length;
                msg = msg.substring(1, len-1);
            }
            hongshi.userData.ip = msg;
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
