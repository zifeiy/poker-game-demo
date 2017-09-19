var hongshi = require('hongshi');
var nativeLoader = require('nativeLoader');

cc.Class({
    extends: cc.Component,

    properties: {
        cardStorePlace: require('CardStorePlace'),
        toolStorePlace: require('ToolStorePlace'),
        cardNodeList: [cc.Node],
        leftNumBack: cc.Node,
        leftNumLabel: cc.Label,
        picNode: cc.Node,
        nameLabel: cc.Label,
        pointLabel: cc.Label,
        clockNode: cc.Node,
        prepareNode: cc.Node,
        hongtaoNode: cc.Node,
        fangkuaiNode: cc.Node,
        offlineLabel: cc.Node,
        chatWordItem: require('ChatWordItem'),
        faceShakeItem: require('FaceShakeItem'),
        picSprite: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {

    },

    setTimer: function (time) {
        this.toolStorePlace.converToNodeWithTime(this.clockNode, time);
    },

    updatePlayerInfo: function (data) {
        if (data == null) {
            return;
        }
        if (this.updatedPlayerInfo != null && this.updatedPlayerInfo.name == data.name && this.updatedPlayerInfo.avatarUrl == data.avatarUrl) {
            return;
        }
        this.updatedPlayerInfo = data;

        var url = data.avatarUrl;
        nativeLoader.loadNative(data.id, url, (spriteFrame)=>{
            this.picSprite.spriteFrame = spriteFrame;
        });
        this.nameLabel.string = ((data.name != null) ? data.name : data.id);
    },

    updateWaitingState: function (data) {
        // this.nameLabel.string = data.id;
        this.leftNumBack.active = false;
        this.leftNumLabel.string = "";
        this.prepareNode.active = data.prepared;
        this.pointLabel.string = data.point;
        if (data.prepared) {
            this._showCardList(data.leftCards);
        }
        else {
            this._showCardList([]);
        }
        this.hongtaoNode.active = this.fangkuaiNode.active = false;
        this.offlineLabel.active = false;
    },

    updateShowRedState: function (data) {
        this.leftNumBack.active = true;
        if (data.leftNum > 5) {
            this.leftNumLabel.string = "";
        }
        else {
            this.leftNumLabel.string = data.leftNum;
        }
        this.prepareNode.active = false;
        this.pointLabel.string = data.point;
        if (data.redCards != null) {
            // 显示 或 不显示 红桃
            this.hongtaoNode.active = (data.redCards.indexOf(210) != -1);
            // 显示 或 不显示 方块
            this.fangkuaiNode.active = (data.redCards.indexOf(410) != -1);
        }
        else {
            this.hongtaoNode.active = this.fangkuaiNode.active = false;
        }
        this._showCardList([]);
        this.offlineLabel.active = false;
    },

    updateGamingState: function (data) {
        this.leftNumBack.active = true;
        if (data.leftNum > 5) {
            this.leftNumLabel.string = "";
        }
        else {
            this.leftNumLabel.string = data.leftNum;
        }
        this.prepareNode.active = false;
        this._showCardList(data.putCards);
        this.pointLabel.string = data.point;
        if (data.redCards != null) {
            // 显示 或 不显示 红桃
            this.hongtaoNode.active = (data.redCards.indexOf(210) != -1);
            // 显示 或 不显示 方块
            this.fangkuaiNode.active = (data.redCards.indexOf(410) != -1);

            cc.log('otherlia 1: ' + this.hongtaoNode.active + ' , ' + this.fangkuaiNode.active + ' : ' + JSON.stringify(data.redCards));
        }
        else {
            this.hongtaoNode.active = this.fangkuaiNode.active = false;
            cc.log('otherlia 2: ' + this.hongtaoNode.active + ' , ' + this.fangkuaiNode.active + ' : ' + JSON.stringify(data.redCards));
        }
        this.offlineLabel.active = false;
    },

    updateSomeoneOfflineState: function (data) {
        this.offlineLabel.active = data.offline;
    }, 

    updateData: function (data) {
        this._showCardList(data.pokers);
        this._showLeftNum(data.num);
    },

    _showCardList: function (arr) {
        // 判断是否是一样的牌，如果是一样的牌，则不用进行此操作
        var different = true;
        if (this.showCardList != null) {
            different = false;
            if (this.showCardList.length != arr.length) {
                different = true;
            }
            else {
                this.showCardList.sort(this.normalCmp);
                arr.sort(this.normalCmp);
                var len = arr.length;
                for (var i = 0; i < len; i ++) {
                    if (this.showCardList[i] != arr[i]) {
                        different = true;
                        break;
                    }
                }
            }
        }
        this.showCardList = arr;
        if (different == false) {
            return;
        }

        // 处理一开始有抖动的问题
        this.cardNodeList.forEach((node)=>{
            node.opacity = 0;
        });
        this.scheduleOnce(()=>{
            this.cardNodeList.forEach((node)=>{
                node.opacity = 255;
            });
        }, 0);

        arr.sort(this.cardCmp);
        for (var i = 0; i < arr.length; i ++) {
            this.cardNodeList[i].active = true;
            
            var node = this.cardStorePlace["card_" + arr[i]];
            node.parent = this.cardNodeList[i];
            node.setPosition(cc.p(0, 0));
            node.width = this.cardNodeList[i].width;
            node.height = this.cardNodeList[i].height;
        }
        for (var i = arr.length; i < 14; i ++) {
            this.cardNodeList[i].active = false;
        }
    },

    _showLeftNum: function (leftNum) {
        this.leftNumLabel.string = leftNum;
    },

    test: function () {
        var data = {};
        data.pokers = [];
        for (var i = 1; i <= 4; i ++) {
            for (var j = 1; j <= 13; j ++) {
                var id = 100 * i + j;
                var flag = (Math.random() < 0.13);
                if (flag) {
                    data.pokers.push(id);
                }
            }
        }
        data.num = Math.floor(Math.random() * 100);
        this.updateData(data);
    },

    cardCmp: function (x, y) {      // 从大到小排序
        var xx = x % 100;
        var yy = y % 100;
        if (y == 210 || y == 410) return 1;
        if (x == 210 || x == 410) return -1;
        if (y == 214) return 1;
        if (x == 214) return -1;
        if (y == 114) return 1;
        if (x == 114) return -1;
        if (yy == 2) return 1;
        if (xx == 2) return -1;
        if (yy == 1) return 1;
        if (xx == 1) return -1;
        if (xx == yy) {
            return y - x;   // return x -y; 则为 黑桃在红桃左边
        }
        return yy - xx;
    },

    normalCmp: function (a, b) {
        return a - b;
    },

    // 聊天
    showFaceTalk: function (picId) {
        this.faceShakeItem.showPic(picId);
    },

    showWordTalk: function (content) {
        this.chatWordItem.showWord(content);
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
