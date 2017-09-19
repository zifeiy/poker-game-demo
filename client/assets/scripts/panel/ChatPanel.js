var hongshi = require('hongshi');
var netEngine = require('netEngine');
var ui = require('uicreator');

cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {

    },

    convenientTalk: function (talkId) {
        netEngine.send('convenientTalk', {roomId: hongshi.userData.roomId, talkId: talkId});
        this.node.active = false;
    },

    faceTalk: function (picId) {
        netEngine.send('faceTalk', {roomId: hongshi.userData.roomId, picId: picId});
        this.node.active = false;
    },

    onClickTalk: function () {
        var content = this.editBox.string;
        if (content == null || content.length <= 0) {
            ui.createScreenMsg('请输入聊天内容');
        }
        else {
            netEngine.send('talk', {roomId: hongshi.userData.roomId, content: content});
            this.editBox.string = "";
            this.node.active = false;
        }
    },

    onClickDisable: function () {
        this.node.active = false;
    },

    onDestroy: function () {
        if (this.game) {
            this.game.chatPanel = null;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
