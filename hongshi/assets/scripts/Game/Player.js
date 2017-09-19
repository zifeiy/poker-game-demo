var pokerPutHelper = require('pokerPutHelper');
var audioPlayer = require('audioPlayer');
var ui = require('uicreator');
var audioPlayer = require('audioPlayer');

cc.Class({
    extends: cc.Component,

    properties: {
        cardStorePlace: require('CardStorePlace'),
        pokerLayout: cc.Node,
        pokerNodeList: [cc.Node],
        showRedClock: cc.Node,
        optionClock: cc.Node,

        putCardAudio:  {url: cc.AudioClip, default: null},

        faPaiAudio: {url: cc.AudioClip, default: null}, // 发牌的音乐，放两次

        // 开始游戏（刚进入ShowRed阶段）音效
        startAudio: {url: cc.AudioClip,default: null},
    },

    // use this for initialization
    onLoad: function () {
        this.pokerClickedList = [];
        this.pokerClickingList = [];
        for (var i = 0 ; i < 14; i ++) {
            this.pokerClickedList.push(false);
            this.pokerClickingList.push(false);
        }
        
        this.pokerLayout.on('touchstart', this.onTouchStart, this);
        this.pokerLayout.on('touchmove', this.onTouchMove, this);
        this.pokerLayout.on('touchend', this.onTouchEnd, this);
        this.pokerLayout.on('touchcancel', this.onTouchEnd, this);
    },

    // firstInit: function () {
    //     this.cardStorePlace.init();
    //     this.init();
    // },

    init: function () {
        for (var i = 0; i < 14; i ++) {
            // this.pokerNodeList[i].active = true;
            if (this.pokerClickedList[i] == true) {
                this._onClick(i);
            }
        }
    },

    onDestory: function () {
        this.pokerLayout.off('touchstart', this.onTouchStart, this);
        this.pokerLayout.off('touchmove', this.onTouchMove, this);
        this.pokerLayout.off('touchend', this.onTouchEnd, this);
        this.pokerLayout.off('touchcancel', this.onTouchEnd, this);
    },

    onTouchStart: function (event) {
        var x = this.pokerLayout.convertTouchToNodeSpaceAR(event).x;
        this.startX = x;
    },
    onTouchMove: function (event) {
        var x = this.pokerLayout.convertTouchToNodeSpaceAR(event).x;
    },
    onTouchEnd: function (event) {
        var x = this.pokerLayout.convertTouchToNodeSpaceAR(event).x;
        this.endX = x;
        this.updateCardStateInDeltaX(this.startX, this.endX);
    },

    updateCardStateInDeltaX: function (x1, x2) {
        var atLeastOneCardUp = false;
        if (x1 > x2) {
            var t = x1;
            x1 = x2;
            x2 = t;
        }
        var len = this.pokerNodeList.length;
        var trueLen = 0;
        for (;trueLen < len && this.pokerNodeList[trueLen].active == true; trueLen ++);
        for (var i = 0; i < trueLen-1; i ++) {
            var startX = this.pokerNodeList[i].x - this.pokerNodeList[i].width / 2;
            var endX = this.pokerNodeList[i+1].x - this.pokerNodeList[i+1].width / 2;
            if (startX < x2 && endX > x1) {
                if (this.pokerClickedList[i] == false) {
                    atLeastOneCardUp = true;
                }
                this._onClick(i);
            }
        }
        var startX = this.pokerNodeList[trueLen-1].x - this.pokerNodeList[trueLen-1].width / 2;
        var endX = this.pokerNodeList[trueLen-1].x + this.pokerNodeList[trueLen-1].width / 2;
        if (startX < x2 && endX > x1) {
            if (this.pokerClickedList[trueLen-1] == false) {
                atLeastOneCardUp = true;
            }
            this._onClick(trueLen-1);
        }
        if (atLeastOneCardUp) { // 如果至少有一张牌是从下面到上面的，则播放音效
            audioPlayer.playYinXiao(this.putCardAudio);
        }
    },

    showCardList: function (arr, force) {
        arr.sort(this.cardCmp);
        var cardDifferent = false;
        if (this.pokerList == null || this.pokerList.length != arr.length) {
            cardDifferent = true;
        }
        else {
            this.pokerList.sort(this.cardCmp);
            for (var i = 0; i < arr.length; i ++) {
                if (this.pokerList[i] != arr[i]) {
                    cardDifferent = true;
                    break;
                }
            }
        }
        if (!cardDifferent && force != true) {
            return;
        }
        this.pokerList = arr;
        for (var i = 0; i < arr.length; i ++) {
            this.pokerNodeList[i].active = true;
            this.pokerNodeList[i].y = 0;
            
            var node = this.cardStorePlace["card_" + arr[i]];
            node.parent = this.pokerNodeList[i];
            node.setPosition(cc.p(0, 0));
            node.width = this.pokerNodeList[i].width;
            node.height = this.pokerNodeList[i].height;
        }
        for (var i = arr.length; i < 14; i ++) {
            this.pokerNodeList[i].active = false;
        }
    },

    firstShowCardList: function (arr) {
        audioPlayer.playYinXiao(this.faPaiAudio);
        this.scheduleOnce(()=>{
            audioPlayer.playYinXiao(this.faPaiAudio);
        }, 1);
        audioPlayer.playYinXiao(this.startAudio);

        this.pokerList = arr;
        this.pokerNodeList.forEach((node)=>{
            node.active = false;
        });
        var i = 0;
        this.schedule(()=>{
            this.pokerNodeList[i].active = true;
            this.pokerNodeList[i].y = 0;
            
            var node = this.cardStorePlace["card_" + arr[i]];
            node.parent = this.pokerNodeList[i];
            node.setPosition(cc.p(0, 0));
            node.width = this.pokerNodeList[i].width;
            node.height = this.pokerNodeList[i].height;
            i ++;
        }, 0.14, arr.length - 1, 0);
        this.scheduleOnce(()=>{
            this.showCardList(arr, true);
        }, 2);
    },

    _onClick: function (idx) {
        if (this.pokerClickedList[idx] == false) {
            this.pokerClickedList[idx] = true;
            this.pokerNodeList[idx].y = 30;
        }
        else {
            this.pokerClickedList[idx] = false;
            this.pokerNodeList[idx].y = 0;
        }
        this.game.canPutCardCheck();
    },

    showTip: function (putCards) {
        var different = false;
        if (this.lastShowTipPokerList == null || this.lastShowTipPokerList.length != this.pokerList.length) {
            different = true;
        }
        else {
            this.lastShowTipPokerList.sort(this.cardCmp);
            this.pokerList.sort(this.cardCmp);
            var len = this.pokerList.length;
            for (var i = 0; i < len; i ++) {
                if (this.lastShowTipPokerList[i] != this.pokerList[i]) {
                    different = true;
                    break;
                }
            }
        }
        if (different) {
            this.lastShowTipPokerList = this.pokerList;
            this.showTipAllCardList = pokerPutHelper.getAllTipCards(putCards, this.pokerList);
            this.showTipIdx = -1;
        }
        if (this.showTipAllCardList.length == 0) {
            return false;
        }
        this.showTipIdx = (this.showTipIdx + 1) % this.showTipAllCardList.length;
        var cardList = this.showTipAllCardList[this.showTipIdx];
        this.showTipCardList(cardList);
        return true;
    },

    showTipCardList: function (cardList) {
        this.pokerList.sort(this.cardCmp);
        for (var i = 0; i < this.pokerList.length; i ++) {
            var up = (cardList.indexOf(this.pokerList[i]) != -1);
            if (up) {
                this.pokerClickedList[i] = true;
                this.pokerNodeList[i].y = 30;
            } 
            else {
                this.pokerClickedList[i] = false;
                this.pokerNodeList[i].y = 0;
            }
        }
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

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        for (var i = 0; i < 14; i ++) {
            if (this.pokerClickedList[i] == true && this.pokerNodeList[i].y != 30) {
                this.pokerNodeList[i].y = 30;
            }
            if (this.pokerClickedList[i] == false && this.pokerNodeList[i].y != 0) {
                this.pokerNodeList[i].y = 0;
            }
        }
    },
});
