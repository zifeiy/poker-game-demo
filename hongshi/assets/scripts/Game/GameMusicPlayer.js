var hongshi = require('hongshi');
var pokerPutHelper = require('pokerPutHelper');
var audioPlayer = require('audioPlayer');
var ui = require('uicreator');

cc.Class({
    extends: cc.Component,

    properties: {
        man_Left1: {url: cc.AudioClip, default: null},
        man_Left2: {url: cc.AudioClip, default: null},
        woman_Left1: {url: cc.AudioClip, default: null},
        woman_Left2: {url: cc.AudioClip, default: null},

        man_pass1: {url: cc.AudioClip, default: null},
        man_pass2: {url: cc.AudioClip, default: null},
        man_pass3: {url: cc.AudioClip, default: null},
        woman_pass1: {url: cc.AudioClip, default: null},
        woman_pass2: {url: cc.AudioClip, default: null},
        woman_pass3: {url: cc.AudioClip, default: null},

        man_1_1: {url: cc.AudioClip, default: null},        // 男人：1张牌，A
        man_1_2: {url: cc.AudioClip, default: null},        // 男人：1张牌，2
        man_1_3: {url: cc.AudioClip, default: null},        // 男人：1张牌，3
        man_1_4: {url: cc.AudioClip, default: null},        // 男人：1张牌，4
        man_1_5: {url: cc.AudioClip, default: null},        // 男人：1张牌，5
        man_1_6: {url: cc.AudioClip, default: null},        // 男人：1张牌，6
        man_1_7: {url: cc.AudioClip, default: null},        // 男人：1张牌，7
        man_1_8: {url: cc.AudioClip, default: null},        // 男人：1张牌，8
        man_1_9: {url: cc.AudioClip, default: null},        // 男人：1张牌，9
        man_1_10: {url: cc.AudioClip, default: null},       // 男人：1张牌，10
        man_1_11: {url: cc.AudioClip, default: null},       // 男人：1张牌，J
        man_1_12: {url: cc.AudioClip, default: null},       // 男人：1张牌，Q
        man_1_13: {url: cc.AudioClip, default: null},       // 男人：1张牌，K
        man_1_114: {url: cc.AudioClip, default: null},      // 男人：1张牌，小王
        man_1_214: {url: cc.AudioClip, default: null},      // 男人：1张牌，大王

        man_2_1: {url: cc.AudioClip, default: null},        // 男人：2张牌，对A
        man_2_2: {url: cc.AudioClip, default: null},        // 男人：2张牌，对2
        man_2_3: {url: cc.AudioClip, default: null},        // 男人：2张牌，对3
        man_2_4: {url: cc.AudioClip, default: null},        // 男人：2张牌，对4
        man_2_5: {url: cc.AudioClip, default: null},        // 男人：2张牌，对5
        man_2_6: {url: cc.AudioClip, default: null},        // 男人：2张牌，对6
        man_2_7: {url: cc.AudioClip, default: null},        // 男人：2张牌，对7
        man_2_8: {url: cc.AudioClip, default: null},        // 男人：2张牌，对8
        man_2_9: {url: cc.AudioClip, default: null},        // 男人：2张牌，对9
        man_2_10: {url: cc.AudioClip, default: null},       // 男人：2张牌，对10
        man_2_11: {url: cc.AudioClip, default: null},       // 男人：2张牌，对J
        man_2_12: {url: cc.AudioClip, default: null},       // 男人：2张牌，对Q
        man_2_13: {url: cc.AudioClip, default: null},       // 男人：2张牌，对K
        
        woman_1_1: {url: cc.AudioClip, default: null},        // 女人：1张牌，A
        woman_1_2: {url: cc.AudioClip, default: null},        // 女人：1张牌，2
        woman_1_3: {url: cc.AudioClip, default: null},        // 女人：1张牌，3
        woman_1_4: {url: cc.AudioClip, default: null},        // 女人：1张牌，4
        woman_1_5: {url: cc.AudioClip, default: null},        // 女人：1张牌，5
        woman_1_6: {url: cc.AudioClip, default: null},        // 女人：1张牌，6
        woman_1_7: {url: cc.AudioClip, default: null},        // 女人：1张牌，7
        woman_1_8: {url: cc.AudioClip, default: null},        // 女人：1张牌，8
        woman_1_9: {url: cc.AudioClip, default: null},        // 女人：1张牌，9
        woman_1_10: {url: cc.AudioClip, default: null},       // 女人：1张牌，10
        woman_1_11: {url: cc.AudioClip, default: null},       // 女人：1张牌，J
        woman_1_12: {url: cc.AudioClip, default: null},       // 女人：1张牌，Q
        woman_1_13: {url: cc.AudioClip, default: null},       // 女人：1张牌，K
        woman_1_114: {url: cc.AudioClip, default: null},      // 女人：1张牌，小王
        woman_1_214: {url: cc.AudioClip, default: null},      // 女人：1张牌，大王

        woman_2_1: {url: cc.AudioClip, default: null},        // 女人：2张牌，对A
        woman_2_2: {url: cc.AudioClip, default: null},        // 女人：2张牌，对2
        woman_2_3: {url: cc.AudioClip, default: null},        // 女人：2张牌，对3
        woman_2_4: {url: cc.AudioClip, default: null},        // 女人：2张牌，对4
        woman_2_5: {url: cc.AudioClip, default: null},        // 女人：2张牌，对5
        woman_2_6: {url: cc.AudioClip, default: null},        // 女人：2张牌，对6
        woman_2_7: {url: cc.AudioClip, default: null},        // 女人：2张牌，对7
        woman_2_8: {url: cc.AudioClip, default: null},        // 女人：2张牌，对8
        woman_2_9: {url: cc.AudioClip, default: null},        // 女人：2张牌，对9
        woman_2_10: {url: cc.AudioClip, default: null},       // 女人：2张牌，对10
        woman_2_11: {url: cc.AudioClip, default: null},       // 女人：2张牌，对J
        woman_2_12: {url: cc.AudioClip, default: null},       // 女人：2张牌，对Q
        woman_2_13: {url: cc.AudioClip, default: null},       // 女人：2张牌，对K

        red10Sound:  {url: cc.AudioClip, default: null},

        man_5: {url: cc.AudioClip, default: null},      // 男人顺子
        woman_5: {url: cc.AudioClip, default: null},    // 女人顺子
        
        man_6: {url: cc.AudioClip, default: null},          // 男人王炸
        woman_6: {url: cc.AudioClip, default: null},        // 女人王炸

        man_zhaDan: {url: cc.AudioClip, default: null},     // 男人“炸弹”声音
        woman_zhaDan: {url: cc.AudioClip, default: null},   // 女人“炸弹”声音

        zhaDan3Sound: {url: cc.AudioClip, default: null},   // 3张牌的炸弹
        zhaDan4Sound: {url: cc.AudioClip, default: null},   // 4张牌的炸弹
        zhaDan7Sound: {url: cc.AudioClip, default: null},   // 红十炸弹

        outSound: {url: cc.AudioClip, default: null},       // 出完牌时放的音效

        passAudio: {url: cc.AudioClip, default: null},      // 不出的时候播放的音效

        prepareAudio:  {url: cc.AudioClip, default: null},  // 玩家切换准备状态时的音效

    },

    // use this for initialization
    onLoad: function () {

    },

    init: function () {
        this.putCards = null;
        this.cards = null;
    },

    handleCards: function (putCards, leftCardsLen, sex) {
        var type = pokerPutHelper.judgeType(putCards);
        // 如果没有出牌
        if (putCards.length == 0) {
            var idx = parseInt(Math.random() * 3) + 1;
            if (sex <= 1) {
                audioPlayer.playYinXiao(this['man_pass' + idx]);
            }
            else {
                audioPlayer.playYinXiao(this['woman_pass' + idx]);
            }
            audioPlayer.playYinXiao(this.passAudio);
        }
        // 如果出完牌了
        else if (leftCardsLen == 0) {
            audioPlayer.playYinXiao(this.outSound);
        }
        // 如果只剩1张牌了
        else if (leftCardsLen == 1) {
            if (sex <= 1) {
                audioPlayer.playYinXiao(this.man_Left1);
            }
            else {
                audioPlayer.playYinXiao(this.woman_Left1);
            }
        }
        // 如果只剩2张牌了
        else if (leftCardsLen == 2) {
            if (sex <= 1) {
                audioPlayer.playYinXiao(this.man_Left2);
            }
            else {
                audioPlayer.playYinXiao(this.woman_Left2);
            }
            return;
        }
        // 剩余牌数 >= 3
        else {
            if (type == 1) {                    // 单张牌
                var audioName = 'man_1_';
                if (sex == 1) {
                    audioName = 'woman_1_';
                }
                var card = putCards[0];
                if (card == 210 || card == 410) {
                    audioPlayer.playYinXiao(this.red10Sound);
                }
                else {
                    var cardSuffix = card % 100;
                    audioPlayer.playYinXiao(this[audioName + cardSuffix]);
                }
            }
            else if (type == 2) {               // 双张牌
                var audioName = 'man_2_';
                if (sex == 1) {
                    audioName = 'woman_2_';
                }
                var cardSuffix = putCards[0] % 100;
                audioName += cardSuffix;
                audioPlayer.playYinXiao(this[audioName]);
            }
            else if (type == 5) {               // 顺子
                if (sex <= 1) {
                    audioPlayer.playYinXiao(this.man_5);
                }
                else {
                    audioPlayer.playYinXiao(this.woman_5);
                }
            }  
            else if (type == 6) {   // 王炸
                if (sex <= 1) {
                    audioPlayer.playYinXiao(this.man_6);
                }
                else {
                    audioPlayer.playYinXiao(this.woman_6);
                }
            }
            else if (type == 4 || type == 4 || type == 7) {
                // 根据性别选择人声
                if (sex <= 1) {
                    audioPlayer.playYinXiao(this.man_zhaDan);
                }
                else {
                    audioPlayer.playYinXiao(this.woman_zhaDan);
                }
                // 根据牌型选择炸弹声音
                if (type == 3) {
                    audioPlayer.playYinXiao(this.zhaDan3Sound);
                }
                else if (type == 4) {
                    audioPlayer.playYinXiao(this.zhaDan4Sound);
                }
                else if (type == 7) {
                    audioPlayer.playYinXiao(this.zhaDan7Sound);
                }
            }
        }
    },

    handlePrepare: function () {
        audioPlayer.playYinXiao(this.prepareAudio);
    },

    _checkDifferent: function (card1, card2) {
        if (card1.length != card2.length) {
            return true;
        }
        var arr1 = card1.map((x)=>{return x;});
        var arr2 = card2.map((x)=>{return x});
        arr1.sort(this.normalCmp);
        arr2.sort(this.normalCmp);
        for (var i = 0; i < arr1.length; i ++) {
            if (arr1[i] != arr2[i]) {
                return true;
            }
        }
        return falsee;
    },

    normalCmp: function (x, y) {
        return x - y;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
