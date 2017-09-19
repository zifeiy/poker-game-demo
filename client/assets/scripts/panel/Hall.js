var hongshi = require('hongshi');
var ui = require("uicreator");
var audioPlayer = require('audioPlayer');
var nativeLoader = require('nativeLoader');

cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        idLabel: cc.Label,
        gemLabel: cc.Label,

        picSprite: cc.Sprite,

        bgMusic: {url: cc.AudioClip,default: null},
    },

    // use this for initialization
    onLoad: function () {
        this.initUserData();

        // 播放背景音乐
        audioPlayer.playerBgMusic(this.bgMusic);

        if (hongshi.playersInfo == null) {
            hongshi.playersInfo = {};
            hongshi.playersInfo[hongshi.userData.id] = hongshi.userData;
        }
        else if (hongshi.playersInfo[hongshi.userData.id] == null) {
            hongshi.playersInfo[hongshi.userData.id] = hongshi.userData;
        }

        // 获取网上得到的本地图片
        var url = hongshi.userData.avatarUrl;
        nativeLoader.loadNative(hongshi.userData.id, url, (spriteFrame)=>{
            this.picSprite.spriteFrame = spriteFrame;
        });
    },

    initUserData: function () {
        this.nameLabel.string = hongshi.userData.name;
        this.idLabel.string = "ID: " + hongshi.userData.id;
        this.gemLabel.string = hongshi.userData.gem;
    },

    onClickInviteCode: function () {
        ui.createInviteCodePanel();
    },

    onClickEnterRoom: function () {
        ui.createEnterRoomPanel();
    },

    onClickUserInfo: function () {
        var info = {};
        info.name = hongshi.userData.name;
        info.id = hongshi.userData.id;
        if (hongshi.userData.ip != null) {
            info.ip = hongshi.userData.ip;
        }
        ui.createUserInfoPanel(info);
    },

    onClickBroadcast: function () {
        // test
        var data = {};
        data.infos = [];
        var info1 = {}; info1.title = "第一天开服公告"; info1.content = "大家好，今天是第一天开服"; data.infos.push(info1);
        var info2 = {}; info2.title = "玩家数突破100"; info2.content = "今天玩家数突破100了，真是个好日子"; data.infos.push(info2);
        var info3 = {}; info3.title = "玩家数突破200"; info3.content = "今天玩家数突破200了，真是个好日子"; data.infos.push(info3);
        var info4 = {}; info4.title = "玩家数突破300"; info4.content = "今天玩家数突破300了，真是个好日子"; data.infos.push(info4);
        ui.createBroadcastPanel(data);
    },

    onClickHowToPlay: function () {
        ui.createHowToPlayPanel();
    },

    onClickSetting: function () {
        ui.createSettingPanel();
    },

    onClickShare: function () {
        ui.createSharePanel();
    },

    onClickShop: function () {
        ui.createShopPanel();
    },

    onClickCreateRoom: function () {
        ui.createCreateRoomPanel();
    },

    onClickRecord: function () {
        ui.createRecordMainPanel();
    },

    onClickAgent: function () {
        ui.createAgentPanel();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
