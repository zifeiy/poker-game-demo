var hongshi = require('hongshi');
var netEngine = require('netEngine');
var ui = require('uicreator');
var pokerPutHelper = require('pokerPutHelper');
var audioPlayer = require('audioPlayer');
var SDKManager = require('SDKManager');
var ScreenShoter = require('ScreenShoter');
var nativeLoader = require('nativeLoader');

cc.Class({
    extends: cc.Component,

    properties: {
        otherPlayerList: [require('OtherPlayer')],
        player: require('Player'),
        liangHongNode: cc.Node,
        optionNode: cc.Node,
        toolStorePlace: require('ToolStorePlace'),
        prepareLayout: cc.Node,     // Waiting时 右下角 的准备按钮
        prepareLabel: cc.Label,     // Waiting时 右下角的准备按钮里面的内容（"准备" 或 "取消"）
        waitingShowRedLayout: cc.Node,
        waitingShowRedClock: cc.Node,
        passNodeList: [cc.Node],
        putCardButton: cc.Button,
        passButton: cc.Button,
        achievementPanel: cc.Node,
        ac_roomIdLabel: cc.Label,
        ac_basicPointLabel: cc.Label,
        ac_turnLabel: cc.Label,
        ac_biGenLabel: cc.Label,
        ac_doubleLabel: cc.Label,
        gameDataPanel: cc.Node,
        gd_turnLabel: cc.Label,
        gd_basePointLabel: cc.Label,
        gd_doubleLabel: cc.Label,
        offlinePanel: cc.Node,
        inviteFriendButton: cc.Node,
        prepareButton: cc.Node,
        beginButton: cc.Node,

        // 男人音效
        manAudio_0: {url: cc.AudioClip,default: null},
        manAudio_1: {url: cc.AudioClip,default: null},
        manAudio_2: {url: cc.AudioClip,default: null},
        manAudio_3: {url: cc.AudioClip,default: null},
        manAudio_4: {url: cc.AudioClip,default: null},
        manAudio_5: {url: cc.AudioClip,default: null},
        manAudio_6: {url: cc.AudioClip,default: null},
        manAudio_7: {url: cc.AudioClip,default: null},
        manAudio_8: {url: cc.AudioClip,default: null},
        // 女人音效
        womanAudio_0: {url: cc.AudioClip,default: null},
        womanAudio_1: {url: cc.AudioClip,default: null},
        womanAudio_2: {url: cc.AudioClip,default: null},
        womanAudio_3: {url: cc.AudioClip,default: null},
        womanAudio_4: {url: cc.AudioClip,default: null},
        womanAudio_5: {url: cc.AudioClip,default: null},
        womanAudio_6: {url: cc.AudioClip,default: null},
        womanAudio_7: {url: cc.AudioClip,default: null},
        womanAudio_8: {url: cc.AudioClip,default: null},

        // 背景音乐
        bgMusic: {url: cc.AudioClip,default: null},
        tipAudio: {url: cc.AudioClip,default: null},

        // 小于5张牌音效
        lessThan5CardsAudio: {url: cc.AudioClip,default: null},

        quitGameRequestPanel: require('quitGameRequestPanel'),

        starClick_leaveRoomNode: cc.Node,
        starClick_requestQuitGameNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.log('Game:xx:onLoad');

        this.taiCiList = [
            '你太牛了',
            '哈哈，手气真好',
            '快点出牌哟',
            '今天真高兴',
            '你家里是开银行的吧',
            '不好意思，我有事要先走一步了',
            '你的牌打得太好了',
            '你好，很高兴见到各位',
            '怎么又断线了，网络怎么这么差啊'
        ];

        // 播放背景音乐
        audioPlayer.playerBgMusic(this.bgMusic);

        var roomId = hongshi.userData.roomId;

        netEngine.register('enterroom', {roomId: roomId}, (data)=>{
            // 房间人数已满
            if (data.type == 'roomFull') {
                cc.log('gameGet: roomFull. (' + roomId + ')');
                netEngine.unRegister('enterroom');
                cc.director.loadScene('scenes/Hall', ()=>{
                    ui.createScreenMsg('该房间人数已满');
                });
                return;
            }
            // 游戏结束
            if (data.type == 'gameEnd') {
                if (this.isAllTurnFinish == true) {
                    return;
                }
                cc.log('gameGet: gameEnd. (' + roomId + ')');
                netEngine.unRegister('enterroom');
                cc.director.loadScene('scenes/Hall', ()=>{
                    ui.createScreenMsg('游戏结束:' + roomId);
                });
                return;
            }
            // 一局打完，此时还没有打完所有局
            if (data.type == 'OneTurnFinish') {
                cc.log('gameGet: OneTurnFinish. (' + roomId + ')');
                this.handle_OneTurnFinish(data.data);
                return;
            }
            // 一局打完，并且打完了所有局
            if (data.type == 'AllTurnFinish') {
                cc.log('gameGet: AllTurnFinish. （' + roomId + ')');
                this.isAllTurnFinish = true;
                netEngine.unRegister('enterroom');
                var data = this.getFinalResultData(data);
                ui.createFinalResultPanel(data);
                return;
            }
            // 聊天
            if (data.type == 'talk') {
                cc.log('gameGet: talk. (' + roomId + ')');
                this.handle_talk(data);
                return;
            }
            // 出完牌播放音效
            if (data.type == 'soundAfterPutCard') {
                cc.log('gameGet: soundAfterPutCard (' + roomId + ')');
                this.handle_soundAfterPutCard(data);
            }
            // 准备的音效
            if (data.type == 'playPrepareAudio') {
                cc.log('gameGet: playPrepareAudio (' + roomId + ')');
                this.gameMusicPlayer.handlePrepare();
            }
            if (data.type == 'lessThan5Card') {
                cc.log('gameGet: lessThan5Card (' + roomId + ')');
                if (data.id != hongshi.userData.id) {
                    audioPlayer.playYinXiao(this.lessThan5CardsAudio);
                }
            }
            // 解散房间请求
            if (data.type == 'quitGameRequest') {
                cc.log('gameGet: quitGameRequest (' + roomId + ')');
                if (data.result == 'quit') {
                    this.quitGameRequestPanel.node.active = false;
                    cc.director.loadScene('scenes/Hall', ()=>{
                        hongshi.userData.roomId = null;
                    });
                }
                else if (data.result == 'cancel') {
                    this.quitGameRequestPanel.node.active = false;
                    ui.createScreenMsg('有玩家不同意结束，游戏将继续');
                }
                else if (data.result == 'wait') {
                    this.quitGameRequestPanel.node.active = true;
                    this.quitGameRequestPanel.updateShow(data);
                }
            }
            // 游戏中的数据
            this.handle(data);
        });

        this.player.game = this;
         // GameMusicPlayer
        this.gameMusicPlayer = this.node.getComponent('GameMusicPlayer');

        this.quitGameRequestPanel.game = this;
    },
    onEnable: function () {
        cc.log('Game:xx:onEnable');
    },
    onDisable: function () {
        cc.log('Game:xx:onDisable');
    },
    onDestroy: function () {
        cc.log('Game:xx:onDestroy');
    },

    handle: function (data) {
        if (data.state != null) {
            // 将接收到的和游戏有关的数据保存在this.roomData中
            this.roomData = data;
            this["handle_" + data.state](data);
        }
    },

    handle_Waiting: function (data) {
        this.recordState = 'Waiting';
        this.liangHongNode.active = false;
        this.optionNode.active = false;
        this.prepareLayout.active = true;
        this.inviteFriendButton.active = (data.turn == 1);
        if (data.turn == 1 && data.ids[0] == hongshi.userData.id) { // 第一盘并且我是房主
            this.prepareButton.active = false;
            var otherReady = true;
            for (var i = 1; i < 4; i++) {
                if (data.readyStates[i] != 'ready') {
                    otherReady = false;
                    break;
                }
            }
            this.beginButton.active = otherReady;
        }
        else {
            this.prepareButton.active = true;
            this.beginButton.active = false;
        }
        this.waitingShowRedLayout.active = false;
        this.passNodeList.forEach((node)=>{
            node.active = false;
        });
        this.player.init();
        var startIdx = data.ids.indexOf(hongshi.userData.id);
        var otherReady = true;
        for (var i = 0; i < 4; i ++) {
            var idx = (startIdx + i) % 4;
            if (data.ids[idx] == null) {
                this.otherPlayerList[i].node.active = false;
            }
            else {
                this.otherPlayerList[i].node.active = true;
            }
            var innerData = {};
            innerData.id = data.ids[idx];
            innerData.point = data.points[idx];
            if (data.readyStates[idx] == 'ready') {
                innerData.prepared = true;
            }
            else {
                innerData.prepared = false;
            }
            if (data.turn == 1 && idx == 0) {
                innerData.prepared = true;
            }
            innerData.leftCards = data.cards[idx];
            this.otherPlayerList[i].updateWaitingState(innerData);
        }
        if (data.readyStates[startIdx] == 'ready') {    // 说明我已经准备好了，则按钮显示内容为"取消"
            this.prepareLabel.string = "取消";
        }
        else {                          // 说明还没有准备，则按钮显示内容为"准备"
            this.prepareLabel.string = "准备";
        }
        // Waiting阶段不需要时钟，移到toolStorePlace
        this.toolStorePlace.converToNodeWithTime(this.toolStorePlace.node, data.timer);

        // Achevement信息 
        this.achievementPanel.active = (data.turn == 1);
        var roomIdString = "";
        for (var i = 10; i < 1000000; i *= 10) {
            if (data.roomId < i) 
                roomIdString += "0";
        }
        roomIdString += data.roomId;
        this.ac_roomIdLabel.string = roomIdString;
        this.ac_basicPointLabel.string = "1";
        this.ac_turnLabel.string = data.config.totTurn;
        this.ac_biGenLabel.string = (data.config.youliangbigen ? "是" : "否");
        this.ac_doubleLabel.string = (data.config.pingjufanbei ? "是" : "否");
        // gameData信息
        this.gameDataShow(data);
        
        // 获得其他玩家的信息
        var startIdx = data.ids.indexOf(hongshi.userData.id);

        for (var i = 0; i < 4; i ++) {
            let ii = i;
            var idx = (startIdx + ii) % 4;
            var id = data.ids[idx];
            if (hongshi.playersInfo == null) {
                hongshi.playersInfo = {};
            }
            if (hongshi.playersInfo[id] == null) {
                netEngine.send('getPlayerInfo', {id: id}, (data)=>{
                    hongshi.playersInfo[id] = data;
                    cc.log('getPlayerInfo:' + JSON.stringify(data));
                    this.otherPlayerList[ii].updatePlayerInfo(data);
                });
            }
            else {
                this.otherPlayerList[ii].updatePlayerInfo(hongshi.playersInfo[id]);
            }
        }

        data.ids.forEach((id)=>{
            if (id != hongshi.userData.id) {
                if (hongshi.playersInfo == null) {
                    hongshi.playersInfo = {};
                }
                if (hongshi.playersInfo[id] == null) {
                    netEngine.send('getPlayerInfo', {id: id}, (data)=>{
                        hongshi.playersInfo[id] = data;
                    });
                }
            }
        });

        // OfflinePanel 
        this.offlinePanel.active = false;

        // starClick
        if (data.turn == 1) {
            this.starClick_leaveRoomNode.active = true;
            this.starClick_requestQuitGameNode.active = false;
        }
        else {
            this.starClick_leaveRoomNode.active = false;
            this.starClick_requestQuitGameNode.active = true;
        }
    },

    handle_ShowRed: function (data) {
        var justFromWaiting = false;
        if (this.recordState == 'Waiting') {
            justFromWaiting = true;
        }
        this.recordState = 'ShowRed';
        this.beginButton.active = false;
        this.optionNode.active = false;
        this.prepareLayout.active = false;
        this.passNodeList.forEach((node)=>{
            node.active = false;
        });
        var startIdx = data.ids.indexOf(hongshi.userData.id);
        for (var i = 0; i < 4; i ++) {
            var idx = (startIdx + i) % 4;
            var innerData = {leftNum: data.cards[idx].length};
            innerData.point = data.points[idx];
            // if (data.hasRed[idx] && data.showRed[idx] == true) {
            //     if (data.redCards[idx] != null && data.redCards[idx].length > 0) {
            //         innerData.redCards = data.redCards[idx];
            //     }
            // }
            if (data.showRed[idx] == true) {
                innerData.redCards = data.redCards[idx];
            }
            else if (data.hasRed[idx] == true) {
                var redCards = [];
                [210, 410].forEach((cardId)=>{
                    if (data.redCards[idx].indexOf(cardId) != -1 && data.cards[idx].indexOf(cardId) == -1) {
                        redCards.push(cardId);
                    }
                });
                if (redCards.length > 0) {
                    innerData.redCards = redCards;
                }
            }
            this.otherPlayerList[i].updateShowRedState(innerData);
        }
        var cards = data.cards[startIdx];
        if (justFromWaiting) {
            this.justFromWaitingHandling = true;
            this.liangHongNode.active = false;
            this.waitingShowRedLayout.active = false;

            this.player.firstShowCardList(cards);
            
            this.scheduleOnce(()=>{
                this.justFromWaitingHandling = null;
                // ShowRed阶段需要判断 角色是否有红十 并且 在有红十的情况下是否选择过了亮或者不亮红十
                if (data.hasRed[startIdx] == true && data.showRed[startIdx] == null) {
                    this.liangHongNode.active = true;
                    this.waitingShowRedLayout.active = false;
                    this.toolStorePlace.converToNodeWithTime(this.player.showRedClock, data.timer);
                }
                else {
                    this.liangHongNode.active = false;
                    this.waitingShowRedLayout.active = true;
                    this.toolStorePlace.converToNodeWithTime(this.waitingShowRedClock, data.timer);
                } 
            }, 2);
        }
        else {
            this.player.showCardList(cards);
        }

        if (this.justFromWaitingHandling != true) {
            // ShowRed阶段需要判断 角色是否有红十 并且 在有红十的情况下是否选择过了亮或者不亮红十
            if (data.hasRed[startIdx] == true && data.showRed[startIdx] == null) {
                this.liangHongNode.active = true;
                this.waitingShowRedLayout.active = false;
                this.toolStorePlace.converToNodeWithTime(this.player.showRedClock, data.timer);
            }
            else {
                this.liangHongNode.active = false;
                this.waitingShowRedLayout.active = true;
                this.toolStorePlace.converToNodeWithTime(this.waitingShowRedClock, data.timer);
            }
        }
        
        // 隐藏Achievement信息
        this.achievementPanel.active = false;
        // gameData信息
        this.gameDataShow(data);

        // OfflinePanel 
        this.offlinePanel.active = false;

        // starClick 
        this.starClick_leaveRoomNode.active = false;
        this.starClick_requestQuitGameNode.active = true;
    },

    handle_Gaming: function (data) {
        this.recordState = 'Gaming';
        this.beginButton.active = false;
        this.liangHongNode.active = false;
        this.prepareLayout.active = false;
        this.waitingShowRedLayout.active = false;
        var startIdx = data.ids.indexOf(hongshi.userData.id);
        var nowPlayIdx = (data.nowPlayerId - startIdx + 4) % 4;
        for (var i = 0; i < 4; i ++) {
            var idx = (startIdx + i) % 4;
            if ((idx+1) % 4 != data.nowPlayerId) {  // 只有现在出牌的上游会显示"不要"
                this.passNodeList[i].active = false;
            }
            else {
                var showPass = false;
                for (var j = 0; j < 4; j ++) {
                    if (i == j) continue;
                    var idx2 = (startIdx + j) % 4;
                    if (data.putCards[idx2].length > 0) {
                        showPass = true;
                        break;
                    }
                }
                if (data.putCards[idx].length > 0) {
                    showPass = false;
                }
                if (data.cards[idx].length <= 0) {
                    showPass = false;
                }
                this.passNodeList[i].active = showPass;
            }
        }
        var isMyTurn = (startIdx == data.nowPlayerId);
        this.optionNode.active = isMyTurn;
        for (var i = 0; i < 4; i ++) {
            var idx = (startIdx + i) % 4;
            var innerData = {};
            innerData.leftNum = data.cards[idx].length;
            innerData.putCards = data.putCards[idx];
            if (i == nowPlayIdx) {
                innerData.putCards = [];
            }
            innerData.point = data.points[idx];
            if (data.showRed[idx] == true) {
                innerData.redCards = data.redCards[idx];
            }
            this.otherPlayerList[i].updateGamingState(innerData);
        }
        var cards = data.cards[startIdx];
        this.player.showCardList(cards);
        // Gaming阶段需要判断当前在谁的局，以便放置Clock
        // 如果当前轮到我出牌，则显示在optionNode的clock中
        if (isMyTurn) {
            this.toolStorePlace.converToNodeWithTime(this.player.optionClock, data.timer);
        }
        // 不然显示在otherClock中
        else {
            this.toolStorePlace.converToNodeWithTime(this.otherPlayerList[nowPlayIdx].clockNode, data.timer);
        }
        this.canPutCardCheck();
        // 隐藏Achievement信息
        this.achievementPanel.active = false;
        // gameData信息
        this.gameDataShow(data);

        // OfflinePanel 
        this.offlinePanel.active = false;

        // starClick 
        this.starClick_leaveRoomNode.active = false;
        this.starClick_requestQuitGameNode.active = true;
    },

    handle_SomeoneOffline: function (data) {
        // // OfflinePanel 
        // this.offlinePanel.active = true;
        // this.offlinePanel.getComponent('OfflinePanel').initData(data);
        // OtherPlayer: OfflineLabel
        var startIdx = data.ids.indexOf(hongshi.userData.id);
        for (var i = 0; i < 4; i ++) {
            var idx = (startIdx + i) % 4;
            var innerData = {};
            innerData.offline = (data.readyStates[idx] == 'offline');
            this.otherPlayerList[i].updateSomeoneOfflineState(innerData);
        }
    },

    handle_OneTurnFinish: function (data) {
        var idx = data.ids.indexOf(hongshi.userData.id);
        if (idx == -1) {
            return;
        }
        var resData = {
            nowTotPoint: data.points[idx],
            win: null,
            ids: data.ids,
            itemData: []
        };
        if (data.record[idx] != 0) {
            resData.win = (data.record[idx] > 0);
        }
        for (var i = 0; i < 4; i ++) {
            var id = data.ids[i];
            var rank = data.rank[i];
            var point = data.record[i];
            var innerData = {
                win: (data.record[i] > 0),
                name: ((hongshi.playersInfo[id] != null) ? hongshi.playersInfo[id].name : id),
                point: data.record[i],
                rank: data.rank[i],
                redCards: data.redCards[i],
            };
            resData.itemData.push(innerData);
        }
        resData.allShowRed = true;
        for (var i = 0; i < 4; i ++) {
            if (data.redCards[i].length > 0 && data.showRed[i] != true) {
                resData.allShowRed = false;
                break;
            }
        }
        resData.itemData.sort((a, b)=>{
            if (a.rank == -1) return 1;
            if (b.rank == -1) return -1;
            return a.rank - b.rank;
        });
        ui.createResultPanel(resData);
    },

    handle_talk: function (data) {
        if (data.talkType == 'face') {  // 聊天表情
            var id = data.id;
            var picId = data.picId;
            var idx = this.roomData.ids.indexOf(id);
            if (idx == -1) {
                return;
            }
            this.otherPlayerList[idx].showFaceTalk(picId);
        }
        else if (data.talkType == 'convenient') {   // 快捷聊天
            var id = data.id;
            var talkId = data.talkId;
            var content = this.taiCiList[talkId];
            var idx = this.roomData.ids.indexOf(id);
            if (idx == -1) {
                return;
            }
            this.otherPlayerList[idx].showWordTalk(content);
            // 播放音效
            var sex = hongshi.playersInfo[id].sex;
            if (sex <= 1) {     // 男人
                audioPlayer.playYinXiao(this['manAudio_' + talkId]);
            }
            else {              // 女人
                audioPlayer.playYinXiao(this['womanAudio_' + talkId]);
            }
        }
        else if (data.talkType == 'normal') { // 一般聊天
            var id = data.id;
            var content = data.content;
            var idx = this.roomData.ids.indexOf(id);
            if (idx == -1) {
                return;
            }
            this.otherPlayerList[idx].showWordTalk(content);
        }
    },

    handle_soundAfterPutCard: function (data) {
        var id = data.id;
        var putCards = data.putCards;
        var leftCardsLen = data.leftCardsLen;
        var sex = hongshi.playersInfo[id].sex;
        this.gameMusicPlayer.handleCards(putCards, leftCardsLen, sex);
    },

    gameDataShow: function (data) { // 游戏时右上方的信息
        this.gameDataPanel.active = !(data.state == 'Waiting' && data.turn == 1);
        this.gd_turnLabel.string = data.turn + '/' + data.config.totTurn;
        this.gd_basePointLabel.string = '1';
        this.gd_doubleLabel.string = data.double;
    },

    canPutCardCheck: function () {
        
        var pokerList = this.player.pokerList;
        if (pokerList == null) {
            pokerList = [];
        }
        var pokerClickedList = this.player.pokerClickedList;
        var readyCards = [];
        for (var i = 0; i < pokerList.length; i ++) {
            if (pokerClickedList[i] == true) {
                readyCards.push(pokerList[i]);
            }
        }
        this.readyCards = readyCards;
        var data = this.roomData;
        var startIdx = data.ids.indexOf(hongshi.userData.id);   // startIdx 是 this.roomData 中 我对应的id
        var beforeIdx = -1;                                     // beforeIdx 将会对应我上一个出过牌的id
        for (var i = 3; i >= 1; i --) {
            var tIdx = (startIdx + i) % 4;
            if (data.putCards[tIdx].length != 0) {
                beforeIdx = tIdx;
                break;
            }
        }
        if (beforeIdx == -1) {  // 我可以随便出什么牌，则判断这个牌的type是否!=-1
            var canPut = (pokerPutHelper.judgeType(readyCards) != -1);
            cc.log('canPutCardCheck: putCards:NO,readyCards:'+JSON.stringify(readyCards)+',result:'+canPut);
            this.putCardButton.interactable = canPut;
            this.passButton.interactable = false;   // 因为我必须出牌，所以不能pass
            return canPut;
        }
        else {
            var putCards = data.putCards[beforeIdx];
            var canPut = pokerPutHelper.checkCanFollow(putCards, readyCards);
            cc.log('canPutCardCheck: putCards:'+JSON.stringify(putCards)+',readyCards:'+JSON.stringify(readyCards)+',result:'+canPut);
            this.putCardButton.interactable = canPut;
            this.passButton.interactable = true;    // 因为我前面三个人里面有人出牌了，所以我可以出牌
            return canPut;
        }
    },

    getFinalResultData: function (data) {
        var ids = data.ids;
        var points = data.points;
        var pointRecords = data.pointRecords;
        var winTime = data.winTime;
        var loseTime = data.loseTime;
        var tieTime = data.tieTime;

        var date = new Date();

        var resData = {
            roomId: 123,
            turn: data.turn,
            totTurn: data.totTurn,
            time: date.getFullYear()+'-'+date.getMonth()+'-'+date.getDay()  + '  ' + date.toLocaleTimeString(),
            items: []
        };
        for (var i = 0; i < 4; i ++) {
            var id = ids[i];
            var top = pointRecords[0][i];
            for (var j = 1; j < pointRecords.length; j ++) {
                if (top < pointRecords[j][i]) {
                    top = pointRecords[j][i];
                }
            }
            var tmpData = {
                name: ((hongshi.playersInfo[id] != null) ? hongshi.playersInfo[id].name : id),
                id: id,
                top: top,
                winTime: winTime[i],
                loseTime: loseTime[i],
                tieTime: tieTime[i],
                point: points[i]
            };
            resData.items.push(tmpData);
        }
        return resData;
    },

    onClickPrepare: function () {   // Waiting状态下点击右下角的准备按钮以准备或取消准备
        var data = this.roomData;
        var myIdx = data.ids.indexOf(hongshi.userData.id);
        var readyState = data.readyStates[myIdx];
        var toPrepare = true;
        if (readyState == 'ready') {
            toPrepare = false;
        }
        netEngine.send('roomPrepare', {roomId: data.roomId, prepare: toPrepare});
    },

    _showRedOrNot: function (showRed) {
        netEngine.send('showRed', {roomId: this.roomData.roomId, showRed: showRed});
    },
    onClickShowRed: function () {   // ShowRed状态下点击 亮红 按钮
        this._showRedOrNot(true);
    },
    onClickNotShowRed: function () {    // ShowRed状态下点击 不亮红 按钮
        this._showRedOrNot(false);
    },

    onClickPutCard: function () {   // Gaming状态下出牌
        var canPut = this.canPutCardCheck();
        if (!canPut) {
            return;
        }
        var data = this.roomData;
        var cards = this.readyCards;
        netEngine.send('putCard', {roomId: data.roomId, cards: cards});
        this.player.init();
    },

    onClickPass: function () {  // Gaming状态下Pass
        var data = this.roomData;
        var startIdx = this.roomData.ids.indexOf(hongshi.userData.id);
        if (startIdx == -1) {
            return;
        }
        
        this.player.init();
        var canNotPut = false;
        for (var i = 1; i < 4; i ++) {
            var idx = (startIdx + i) % 4;
            if (this.roomData.putCards[idx].length > 0) {
                canNotPut = true;
                break;
            }
        }
        if (!canNotPut) {
            ui.createScreenMsg('您必须出至少一张牌');
        }
        else {
            netEngine.send('putCard', {roomId: data.roomId, cards: []});
        }
    },

    onClickTip: function () {
        audioPlayer.playYinXiao(this.tipAudio);
        var startIdx = this.roomData.ids.indexOf(hongshi.userData.id);
        var putCards = [];
        for (var i = 3; i >= 1; i --) {
            var idx = (startIdx + i) % 4;
            if (this.roomData.putCards[idx].length > 0) {
                putCards = this.roomData.putCards[idx];
                break;
            }
        }
        var hasTip = this.player.showTip(putCards);
        if (!hasTip) {
            this.onClickPass();
        }
        else {
            this.canPutCardCheck();
        }
    },

    onClickTalk: function () {
        if (this.isLoadingChatPanel) {
            return;
        }
        if (this.chatPanel == null) {
            this.isLoadingChatPanel = true;
            ui.createChatPanel((node)=>{
                this.chatPanel = node;
                node.getComponent('ChatPanel').game = this;
                this.isLoadingChatPanel = null;
            });
        }
        else {
            this.chatPanel.active = true;
        }
    },

    onClickLeaveRoom: function () {
        netEngine.unRegister('enterroom');
        cc.director.loadScene('scenes/Hall', ()=>{
            hongshi.userData.roomId = null;
        });
    },

    onClickShare: function () {
        // 分享文字信息
        // var info = {
        //     shareTo: "0",
        //     mediaType: "0",
        //     text: '我在欢乐红十' + hongshi.userData.roomId + '玩游戏，赶快来啊！'
        // };
        // SDKManager.share(info);

        // // 截屏 & 分享网页信息
        // ScreenShoter.screenShot((filepath)=>{
        //     console.log('share:filepath=' + filepath);
        //     netEngine.send('test', {a: 'begin'});
        //     if (filepath == null) {
        //         cc.log('share error: filepath is null!!');
        //         netEngine.send('test', {a: 'begin error & return'});
        //         return;
        //     }
        //     var info = {
        //         shareTo: "0",
        //         mediaType: "2",
        //         imagePath: "" + filepath,
        //         thumbSize: "120",
        //         url: "http://huaban.com/",
        //         title: "我在欢乐红十打牌，赶快来啊",
        //         text: "房间号:" + hongshi.userData.roomId
        //     };
        //     netEngine.send('test', info);
        //     SDKManager.share(info);
        // });

        // icon & 分享网页信息
        var share_id = 'icon';
        var share_url = 'http://101.37.19.68/icon.png'; // icon图片地址
        nativeLoader.loadNativeWithCallbackFilePath(share_id, share_url, (filepath)=>{
            console.log('share:filepath=' + filepath);
            netEngine.send('test', {a: 'begin'});
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
                text:   "房间号:" + hongshi.userData.roomId + "," +
                        "游戏局数:" + this.roomData.config.totTurn + "," + 
                        "有亮必跟:" + (this.roomData.config.youliangbigen ? "是" : "否") + "," +
                        "平局翻倍:" + (this.roomData.config.pingjufanbei ? "是" : "否")
            };
            netEngine.send('test', info);
            SDKManager.share(info);
        });
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
    // update: function (dt) {
    //     cc.log('liab: ' + this.player);
    // },
});
