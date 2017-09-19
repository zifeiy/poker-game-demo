var WebSocket = require('ws');
var dbManager = require('./dbManager.js');

var TimeInterval = 1;

var gameManager = new Object();

gameManager.createRoom = function (roomId, configData) {
    if (this.room == null) {
        this.room = {};
    }
    if (this.room[roomId] != null) {
        return false;
    }
    this.initWaitingData(roomId, configData);
    return true;
};

gameManager.getRoomId = function (id) {     // 获得 id 对应的房间号，方便断线用户重新连进之前的房间
    if (this.roomId_of_id == null) {
        this.roomId_of_id = {};
    }
    return this.roomId_of_id[id];
}

gameManager.setRoomId = function (id, roomId) {
    if (this.roomId_of_id == null) {
        this.roomId_of_id = {};
    }
    this.roomId_of_id[id] = roomId;
};

gameManager.enterRoom = function (id, roomId, ws) {
    // 第一次运行，需要setInterval
    if (this.intervalSet == null) {
        this.intervalSet = true;
        console.log('gameManager: begin handle');
        setInterval(()=>{
            this.handle();
        }, 1000 * TimeInterval);
    }

    console.log('gameManager:enterRoom.id=' + id + ",roomId=" + roomId);
    if (this.room == null) {
        this.room = {};
    }
    if (this.room[roomId] == null) {    // 正常情况下不会通过该途径进入
        this.initWaitingData(roomId);
        if (ws.readyState == WebSocket.OPEN) {
            ws.close();
        }
        console.log('gameManager:first enter room:' + roomId + ': ' + JSON.stringify(this.room[roomId]));
        return;
    }
    else {
        if (this.room[roomId].personNum >= 4) {  // 房间已满
            var idIndex = this.room[roomId].ids.indexOf(id);
            if (idIndex != -1 && this.room[roomId].readyStates[idIndex] == 'offline') { // 说明是该用户之前在这个房间玩，结果断线了，现在重连
                var oldState = this.room[roomId].stateBeforeOffline;
                
                if (oldState == 'Waiting') {
                    this.room[roomId].readyStates[idIndex] = 'ready';
                }
                else {
                    // 默认 从Waiting状态断线后重新回到房间需要再点击一下准备
                    this.room[roomId].readyStates[idIndex] = 'not';
                }
                var allReady = true;
                this.room[roomId].readyStates.forEach((s)=>{
                    if (s == 'offline') {
                        allReady = false;
                    }
                });
                if (allReady == true) {
                    
                    if (oldState == 'ShowRed') {    // oldState == 'ShowRed'
                        this.room[roomId].timer = 10;
                    }
                    else if (oldState == 'Gaming') {      // oldState == 'Gaming'
                        this.room[roomId].timer = 15;
                    }
                    else {  // oldState == 'Waiting'
                        this.room[roomId].timer = 0;
                    }
                    this.room[roomId].state = oldState;
                    this.room[roomId].stateBeforeOffline = null;
                    this.updateNewestDataToUsers(roomId);
                    this.handleRoom(roomId);
                }
            }
            else {  // 说明该用户是第5+个进来的人
                var sendData = {
                    type: 'roomFull',
                };
                ws.send(JSON.stringify(sendData));
                console.log('gameManager:room ' + roomId + ': Full!' + JSON.stringify(this.room[roomId].ids));
            }
        }
        // 否则的话，是在第1局 的 Waiting阶段 新进来了一个人
        else {
            this.room[roomId].personNum ++;
            var idx = 0;
            for (;idx<4;idx++) {
                if (this.room[roomId].ids[idx] == null) {
                    break;
                }
            }
            this.room[roomId].ids[idx] = id;
            if (this.room[roomId].personNum == 1) {     // personNum == 1，则说明是第一个进来的人，第一个进来的人不准备
                this.room[roomId].readyStates[idx] = 'not';
            }
            else {
                this.room[roomId].readyStates[idx] = 'ready';
            }
            console.log('gameManager:join room:' + roomId + ': ' + JSON.stringify(this.room[roomId]));
        }
    }
    if (this.wsMap == null) {
        this.wsMap = {};
    }
    this.wsMap[id] = ws;
    this.setRoomId(id, roomId);
    
    this.updateNewestDataToUsers(roomId);
    ws.on('close', (msg)=>{
        this.leaveRoom(id, roomId);
    });
};


gameManager.handle = function () {
    // console.log('gameManager.handle begin ----------------------------------------');
    var nowHandleTime = parseInt(Date.now() / 1000);
    if (this.lastHandleTime == null) {
        this.lastHandleTime = nowHandleTime;
    }
    this.deltaHandleTime = nowHandleTime - this.lastHandleTime;
    this.lastHandleTime = nowHandleTime;

    Object.keys(this.room).forEach((roomId)=>{
        this.handleRoom(roomId);
    });

    // console.log('gameManager.handle end ----------------------------------------');
};

gameManager.handleRoom = function (roomId) {
    if (this.room[roomId] == null) {
        return;
    }
    // test log
    this.testLog(roomId);
    var state = this.room[roomId].state;
    if (["Waiting", "ShowRed", "Gaming", "SomeoneOffline"].indexOf(state) == -1) {
        console.log("gameManager:ERROR! state(" + state + ") not existed!");
        return;
    }
    this["handleRoom_" + state](roomId);
};

// Waiting 状态下 的 处理
gameManager.handleRoom_Waiting = function (roomId) {
    console.log('gameManager handleRoom_Waiting ' + roomId);

    var allPrepared = this.check_Waiting_To_ShowRed(roomId);
    if (!allPrepared) {
        console.log('not ready yet!');
        // console.log("ids: " + this.room[roomId].ids + " , readyStates: " + this.room[roomId].readyStates);
    }
    else {
        console.log('ready! go to ShowRed');
        this.createDataForRoom(roomId);
        this.updateNewestDataToUsers(roomId);
    }
};

// ShowRed 状态下的处理
gameManager.handleRoom_ShowRed = function (roomId) {
    console.log('gameManager handleRoom_ShowRed ' + roomId);
    this.room[roomId].timer -= this.deltaHandleTime;
    var canGo = this.check_ShowRed_To_Gaming(roomId);
    if (!canGo) {
        console.log("ShowRed not ready because timer > 0. timer = " + this.room[roomId].timer);
    }
    else {
        console.log("ShowRed ready to go to Gaming!");
        this.initGamingData(roomId);
        this.updateNewestDataToUsers(roomId);
    }
};

// Gaming 状态下的处理
gameManager.handleRoom_Gaming = function (roomId) {
    console.log('gameManager handleRoom_Gaming ' + roomId);
    // 首先判断比赛是否可以结束了,
    // 比赛结束的判断条件：红十方全出完 或 非红十方全出完
    var oneGameEnd = this.check_Gaming_Win_To_Waiting(roomId);
    if (oneGameEnd > 0) {
        if (this.room[roomId].turn >= this.room[roomId].config.totTurn) {   // 总局数完成
            this.generateNextTurnGameData(roomId);
            this.updateNewestDataToUsers(roomId);
            var data = {
                type: "AllTurnFinish",
                ids: this.room[roomId].ids,
                points: this.room[roomId].points,
                pointRecords: this.room[roomId].pointRecords,
                winTime: this.room[roomId].winTime,
                loseTime: this.room[roomId].loseTime,
                tieTime: this.room[roomId].tieTime,
                turn: this.room[roomId].turn,
                totTurn: this.room[roomId].config.totTurn
            };
            this.room[roomId].ids.forEach((id)=>{
                var ws = this.wsMap[id];
                if (ws != null && ws.readyState == WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            });
            this.room[roomId].allTurnFinish = true;
            setTimeout(()=>{
                this.clearRoom(roomId);
            }, 1000 * 1);  // 游戏结束后1秒
        }
        else {                                      // 还有剩余的局数没有完成
            var roomData = this.room[roomId];
            var addData = this.getOneTurnResult(roomData.rank, roomData.redCards, roomData.double);                                                      
            var data = {
                type: "OneTurnFinish",
                data: {
                    redCards: roomData.redCards,
                    showRed: roomData.showRed,
                    ids: roomData.ids,
                    rank: roomData.rank,
                    record: addData.addPoints,
                    double: roomData.double,
                    points: roomData.points
                }
            };  
            data.addWinTime = addData.addWinTime;
            data.addLoseTime = addData.addLoseTime;
            data.addTieTime = addData.addTieTime;
            for (var i = 0; i < 4; i ++) {
                data.data.points[i] += this.room[roomId].points[i];
            }
            this.room[roomId].ids.forEach((id)=>{
                var ws = this.wsMap[id];
                if (ws != null && ws.readyState == WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            });
            this.generateNextTurnGameData(roomId);
            this.updateNewestDataToUsers(roomId);
        }
    }
    else {  // 游戏还没有结束
        this.room[roomId].timer -= this.deltaHandleTime;
        if (this.room[roomId].timer <= 0) {
            var idx = this.room[roomId].nowPlayerId;
            var id = this.room[roomId].ids[idx];

            // 判断是必须出一张牌 还是 可以跳过
            var putCards = this.room[roomId].putCards;
            var otherPut = false;
            for (var i = 0; i < 4; i ++) {
                if (i == idx) continue;
                if (putCards[i].length > 0) {
                    otherPut = true;
                    break;
                }
            }
            var selfPut = (putCards[idx].length > 0);

            if (otherPut == false) {    // 没人出牌，出最小的一张
                var minCard = this.getMinCard(this.room[roomId].cards[idx]);
                var cardList = [];
                if (minCard != null) {
                    cardList.push(minCard);
                }
                this.putCard(id, roomId, cardList);
            }
            else {                      // 有人出牌，可以跳过
                this.putCard(id, roomId, []);
            }
        }
    }
};

// SomeoneOffline 状态下的处理
gameManager.handleRoom_SomeoneOffline = function (roomId) {
    console.log('gameManager handleRoom_SomeoneOffline ' + roomId);
    this.room[roomId].timer -= this.deltaHandleTime;
    if (this.room[roomId].timer <= 0) {
        this.room[roomId].ids.forEach((id)=>{
            var ws = this.wsMap[id];
            if (ws != null && ws.readyState == WebSocket.OPEN) {
                var sendData = {
                    type: 'gameEnd',
                };
                ws.send(JSON.stringify(sendData));
            }
        });
        setTimeout(()=>{
            this.clearRoom(roomId);
        }, 1000 * 1);
    }
};

// 从一个状态到另一个状态的判断
gameManager.check_Waiting_To_ShowRed = function (roomId) {
    if (this.room[roomId] == null || this.room[roomId].state != 'Waiting') {
        return false;
    }
    var allPrepared = true;
    for (var i = 0; i < 4; i ++) {
        if (this.room[roomId].ids[i] == null || this.room[roomId].readyStates[i] != 'ready') {
            allPrepared = false;
            break;
        }
    }
    return allPrepared;
};

gameManager.check_ShowRed_To_Gaming = function (roomId) {
    if (this.room[roomId] == null || this.room[roomId].state != 'ShowRed') {
        return false;
    }
    // 第一种方式是计时器倒时间到了，计时器时间的改动在 handleRoom_Waiting 中进行
    if (this.room[roomId].timer <= 0) {
        console.log('ShowRed Can Go! timer = ' + this.room[roomId].timer);
        return true;
    }

    // 第二种方式是判断是不是该红的都红了
    var canGo = true;
    for (var i = 0; i < 4; i ++) {
        if (this.room[roomId].hasRed[i] == true && this.room[roomId].showRed[i] == null) {
            canGo = false;
            break;
        }
    }
    return canGo;
};

/**
 * 判断是否在 Gaming 阶段 获胜了
 * return 2: 红十方获胜
 * retun 1: 非红十方获胜
 * return 0: 游戏没有结束
 */
gameManager.check_Gaming_Win_To_Waiting = function (roomId) {
    if (this.room[roomId] == null || this.room[roomId].state != 'Gaming') {
        return 0;
    }
    var hasRed = this.room[roomId].hasRed;
    var cards = this.room[roomId].cards;
    var redWin = 2;
    var blackWin = 1;
    for (var i = 0; i < 4; i ++) {
        if (hasRed[i] == true) {
            if (cards[i].length > 0) 
                redWin = 0;
        }
        else {
            if (cards[i].length > 0)
                blackWin = 0;
        }
    }    
    return redWin + blackWin;
},

gameManager.prepare = function (id, roomId, prepared) {
    var readyState = 'not';
    if (prepared == true) {
        readyState = 'ready';
    }
    if (this.room[roomId] != null) {
        var idx = this.room[roomId].ids.indexOf(id);
        if (idx == -1) {
            console.log("ERROR prepare! id " + id + " not exist in room " + roomId + " " + JSON.stringify(this.room[roomId].ids));
            return;
        }
        // 如果角色之前的准备状态和现在的准备状态不一样，则发送一个播放准备音效的消息
        if (this.room[roomId].readyStates[idx] != readyState) {
            var sendData = {type: 'playPrepareAudio'};
            var sendString = JSON.stringify(sendData);
            this.room[roomId].ids.forEach((id)=>{
                var ws = this.wsMap[id];
                if (ws != null && ws.readyState == WebSocket.OPEN) {
                    ws.send(sendString);
                }
            });
        }

        this.room[roomId].readyStates[idx] = readyState;
        this.room[roomId].cards[idx] = [];
        this.updateNewestDataToUsers(roomId);
    }
};

// gameManager.startGame = function (roomId) {
//     console.log('gameManager:startGame.roomId=' + roomId);
// };

gameManager.showRed = function (id, roomId, showRed) {
    console.log('gameManager:showRed.id=' + id + ",roomId=" + roomId + ", showRed=" + showRed);
    if (this.room[roomId] == null || this.room[roomId].state != 'ShowRed') {
        return;
    }
    var idx = this.room[roomId].ids.indexOf(id);
    if (idx == -1) {
        return;
    }
    if (this.room[roomId].hasRed[idx] == true && this.room[roomId].showRed[idx] == null) {
        this.room[roomId].showRed[idx] = showRed;
        console.log('papa: showRed of room ' + roomId + ' to ' + JSON.stringify(this.room[roomId].showRed));
        // 亮红了之后需要判断是否都亮红了，如果都亮红了，则进入Gaming阶段
        var canGo = this.check_ShowRed_To_Gaming(roomId);
        if (!canGo) {
            console.log(id + " red, but still someone unRed!");
        }
        else {
            console.log(id + " red, going to gaming");
            this.initGamingData(roomId);
        }
        this.updateNewestDataToUsers(roomId);
    }
};

gameManager.putCard = function (id, roomId, cardList) {
    console.log('gameManager:putCard.id=' + id + ",roomId=" + roomId + ",cardList=" + cardList);
    var idx = this.room[roomId].ids.indexOf(id);
    if (idx == -1) {
        console.log('ERROR!! ' + id + ' not in ' + this.room[roomId].ids);
        return;
    }
    var leftCards = [];
    this.room[roomId].cards[idx].forEach((card)=>{
        if (cardList.indexOf(card) == -1) {
            leftCards.push(card);
        }
    });
    if (cardList.length + leftCards.length != this.room[roomId].cards[idx].length) {
        console.log('ERROR!! cardList.len(' + cardList.length + ') + leftCards.len(' + leftCards.length + ') != cards.len(' + this.room[roomId].cards[idx].length + ')' );
        return;
    }
    if (this.room[roomId].nowPlayerId != idx) {
        console.log('ERROR!! nowPlayerId = ' + this.room[roomId].nowPlayerId + ', but the control idx is ' + idx);
        return;
    }
    // this.room[roomId].timer = 15; // 初始化计时器
    // test
    this.room[roomId].timer = 3;

    var plusIdx = 1;
    for (var i = 1; i <= 3; i ++) {
        var tmpIdx = (this.room[roomId].nowPlayerId + i) % 4;
        if (this.room[roomId].cards[tmpIdx].length <= 0) {
            this.room[roomId].putCards[tmpIdx] = [];
        }
        else {
            plusIdx = i;
            break;
        }
    }

    this.room[roomId].nowPlayerId = (this.room[roomId].nowPlayerId + plusIdx) % 4;
    this.room[roomId].putCards[idx] = cardList;
    this.room[roomId].cards[idx] = leftCards;

    // 出完牌后向客户端发送播放出牌音效的消息
    var sendMusicData = {
        type: 'soundAfterPutCard',
        id: id,
        putCards: cardList,
        leftCardsLen: leftCards.length,
    };
    var sendMusicString = JSON.stringify(sendMusicData);
    this.room[roomId].ids.forEach((id)=>{
        var ws = this.wsMap[id];
        if (ws != null && ws.readyState == WebSocket.OPEN) {
            ws.send(sendMusicString);
        }
    });
    // 牌首次小于等于5张时播放音乐
    if (cardList.length + leftCards.length > 5 && leftCards.length <= 5) {
        var less5Data = {
            type: 'lessThan5Card',
            id: id
        };
        var lessString = JSON.stringify(less5Data);
        this.room[roomId].ids.forEach((id)=>{
            var ws = this.wsMap[id];
            if (ws != null && ws.readyState == WebSocket.OPEN) {
                ws.send(lessString);
            }
        });
    }

    if (leftCards.length <= 0 && this.room[roomId].rank[idx] == -1) {   // 说明这个人刚刚出完牌
        var rank = 0;
        for (var i = 0; i < 4; i ++) {
            if (this.room[roomId].cards[i].length <= 0) {
                rank ++;
            }
        }
        this.room[roomId].rank[idx] = rank;
    }

    this.updateNewestDataToUsers(roomId);

    // 加入gameRecord中
    var addData = [idx, cardList];
    this.room[roomId].gameRecord.putCardRecords[this.room[roomId].gameRecord.putCardRecords.length-1].push(addData);
};

gameManager.leaveRoom = function (id, roomId) {
    console.log('gameManager:leaveRoom.id=' + id + ",roomId=" + roomId);
    if (this.room == null || this.room[roomId] == null) {
        return;
    }
    var idx = this.room[roomId].ids.indexOf(id);
    if (idx == -1) {
        return;
    }

    if (this.room[roomId].state == 'Waiting') { // Waiting状态下断线
        if (this.room[roomId].turn == 1) {     // 如果是第1局的Waiting状态断线
            this.room[roomId].ids[idx] = null;
            this.room[roomId].readyStates[idx] = 'not';

            this.room[roomId].personNum --;     // 第1局还没有开始，Waiting状态下断线，则personNum--
            if (this.room[roomId].personNum <= 0) {
                this.clearRoom(roomId);
            }
        }
        else {      // 如果不是第1局的Waiting状态断线
            this.room[roomId].timer = 60 * 5;   // 5分钟
            this.room[roomId].state = 'SomeoneOffline';
            this.room[roomId].readyStates[idx] = 'offline';

            var allOffline = true;
            this.room[roomId].readyStates.forEach((state)=>{
                if (state != 'offline') {
                    allOffline = false;
                }
            });
            if (allOffline) {
                this.clearRoom(roomId);
            }
        }
    }
    else {      // ShowRed 或 Gaming 阶段断线
        this.room[roomId].stateBeforeOffline = this.room[roomId].state;
        // this.room[roomId].timer = 5 * 60;   // 5 分钟
        // test 
        this.room[roomId].timer = 20;
        this.room[roomId].state = 'SomeoneOffline';
        this.room[roomId].readyStates[idx] = 'offline';

        var allOffline = true;
        this.room[roomId].readyStates.forEach((s)=>{    // 如果房间中有人的状态为 'ready'， 则说明有人
            if (s == 'ready') {
                allOffline = false;
            }
        });
        if (allOffline) {
            this.clearRoom(roomId);
        }
    }
    
    if (this.wsMap[id] != null && this.wsMap[id].readyState == WebSocket.OPEN) {
        this.wsMap[id].close();
        this.wsMap[id] = null;
    }

    // leaveRoom后需要发送最新数据
   this.updateNewestDataToUsers(roomId);
};

gameManager.clearRoom = function (roomId) {
    console.log('game manager: clear room ' + roomId);
    // 清空房间数据前先存储房间数据到数据库
    this.saveGameRecord(roomId);

    if (this.room[roomId] != null) {
        var ids = this.room[roomId].ids;
        ids.forEach((id)=>{
            var ws = this.wsMap[id];
            if (ws && ws.readyState == WebSocket.OPEN) {
                ws.close();
            }
            this.wsMap[id] = null;
            this.roomId_of_id[id] = null;
        });
        this.room[roomId] = null;
    }
};

gameManager.saveGameRecord = function (roomId) {
    if (this.room[roomId] == null || this.room[roomId].gameRecord == null) {
        return;
    }
    var gameRecord = this.room[roomId].gameRecord;
    var putCardRecords = [];
    var len = gameRecord.putCardRecords.length - 1;
    if (this.room[roomId].allTurnFinish) {
        len ++;
    }
    for (var i = 0; i < len; i ++) {
        putCardRecords.push(gameRecord.putCardRecords[i]);
    }
    this.room[roomId].gameRecord.putCardRecords = putCardRecords;
    this.room[roomId].gameRecord.pointRecords = this.room[roomId].pointRecords;
    
    var data = {
        roomId: roomId,
        id1: this.room[roomId].ids[0],
        id2: this.room[roomId].ids[1],
        id3: this.room[roomId].ids[2],
        id4: this.room[roomId].ids[3],
        data: JSON.stringify(this.room[roomId].gameRecord)
    };
    dbManager.insert('insert into room_competition set ?', data, ()=>{
        console.log('record room data ' + roomId + ' ok!');
    }, (err)=>{
        console.log('record room data ' + roomId + ' fail!: ' + err);
    });
};

gameManager.updateNewestDataToUsers = function (roomId) {
    if (this.room[roomId] != null) {
        this.room[roomId].ids.forEach((id)=>{
            var ws = this.wsMap[id];
            if (ws != null && ws.readyState == WebSocket.OPEN) {
                var sendString = JSON.stringify(this.room[roomId]);
                ws.send(sendString);
            }
        });
    }
};

gameManager.getOneTurnResult = function (rank, redCards, double) {
    var resData = {
        double: 1,
    };
    var addPoints = [0, 0, 0, 0];
    var addWinTime = [0, 0, 0, 0];
    var addLoseTime = [0, 0, 0, 0];
    var addTieTime = [0, 0, 0, 0];

    var redIds = [];
    var blackIds = [];
    for (var i = 0; i < 4; i ++) {
        if (redCards[i].length > 0) {
            redIds.push(i);
        }
        else {
            blackIds.push(i);
        }
    }
    
    if (redIds.length == 1) {   // 说明有一个人拿了两张红十
        var redId = redIds[0];
        switch (rank[redId]) {
            case 1:
                for (var i = 0; i < 4; i ++) {
                    if (i == redId) {
                        addPoints[i] = 9 * double;
                        addWinTime[i] = 1;
                    }
                    else {
                        addPoints[i] = -3 * double; 
                        addLoseTime[i] = 1;
                    }
                }
                break;
            case 2:
            case 3:
                resData.double = double * 2;
                addTieTime = [1, 1, 1, 1];
                break;
            default:    // -1
                for (var i = 0; i < 4; i ++) {
                    if (i == redId) {
                        addPoints[i] = -9 * double;
                        addLoseTime[i] = 1;
                    }
                    else {
                        addPoints[i] = 3 * double;
                        addLoseTime[i] = 1;
                    }
                }
                break;
        }
    }
    else {  // 说明有两个人拿到了红十
        var redId1 = redIds[0];
        var redId2 = redIds[1];
        var rank1 = rank[redId1];
        var rank2 = rank[redId2];
        if (rank1 > rank2) {
            var t = rank1;
            rank1 = rank2;
            rank2 = t;
        }
        if (rank1 == -1 && rank2 == -1) {     // 红方3,4
            redIds.forEach((id)=>{
                addPoints[id] = -2 * double;
                addLoseTime[id] = 1;
            });
            blackIds.forEach((id)=>{
                addPoints[id] = 2 * double;
                addWinTime[id] = 1;
            });
        }
        else if (rank1 == -1 && rank2 == 2) {     // 红方2,4
            redIds.forEach((id)=>{
                addPoints[id] = -1 * double;
                addLoseTime[id] = 1;
            });
            blackIds.forEach((id)=>{
                addPoints[id] = 1 * double;
                addWinTime[id] = 1;
            });
        }
        else if (rank1 == -1 && fank2 == 1 || rank1 == 2 && rank2 == 3) {     // 红方1,4  或 红方2,3
            resData.double = double * 2;
            addTieTime = [1, 1, 1, 1];
        }
        else if (rank1 == 1 && rank2 == 2) {    // 红方1,2
            redIds.forEach((id)=>{
                addPoints[id] = 2 * double;
                addWinTime[id] = 1;
            });
            blackIds.forEach((id)=>{
                addPoints[id] = -2 * double;
                addLoseTime[id] = 1;
            });
        }
        else if (rank1 == 1 && rank2 == 3) {    // 红方1,3
            redIds.forEach((id)=>{
                addPoints[id] = 1 * double;
                addWinTime[id] = 1;
            });
            blackIds.forEach((id)=>{
                addPoints[id] = -1 * double;
                addLoseTime[id] = 1;
            });
        }
    }
    resData.addPoints = addPoints;
    resData.addWinTime = addWinTime;
    resData.addLoseTime = addLoseTime;
    resData.addTieTime = addTieTime;
    return resData;
};

gameManager.generateNextTurnGameData = function (roomId) {
    var roomData = this.room[roomId];
    roomData.state = 'Waiting';
    roomData.turn += 1;
    roomData.personNum = 4;
    roomData.readyStates = ['not', 'not', 'not', 'not'];

    var addData = this.getOneTurnResult(roomData.rank, roomData.redCards, roomData.double);
    for (var i = 0; i < 4; i ++) {
        roomData.winTime[i] += addData.addWinTime[i];
        roomData.loseTime[i] += addData.addLoseTime[i];
        roomData.tieTime[i] += addData.addTieTime[i];
        roomData.points[i] += addData.addPoints[i];
    }
    roomData.pointRecords.push(addData.addPoints);
    roomData.double = addData.double;

    roomData.rank = [-1, -1, -1, -1];

    this.room[roomId] = roomData;
};

// 初始化Gaming阶段的数据
gameManager.initGamingData = function (roomId) {
    var roomData = this.room[roomId];
    roomData.state = 'Gaming';
    roomData.timer = 15;
    roomData.gameRecord.showRedList.push(roomData.showRed);
    this.room[roomId] = roomData;

};

// 生成打牌阶段（ShowRed）的初始数据
gameManager.createDataForRoom = function (roomId) {
    var roomData = this.room[roomId];
    roomData.state = 'ShowRed';
    roomData.timer = 17;    // 2秒出现牌 + 15秒选择亮不亮牌
    roomData.cards = this.generateInitCards();
    roomData.hasRed = roomData.cards.map((cardList)=>{
        return cardList.indexOf(210) != -1 || cardList.indexOf(410) != -1;
    });
    roomData.showRed = [null, null, null, null];
    var firstPlayerIndex = 0;
    for (var i = 0; i < 4; i ++) {
        if (roomData.cards[i].indexOf(203) != -1) {
            firstPlayerIndex = i;
            break;
        }
    }
    roomData.nowPlayerId = firstPlayerIndex;
    roomData.redCards = roomData.cards.map((cardList)=>{
        var redCards = [];
        [210, 410].forEach((c)=>{
            if (cardList.indexOf(c) != -1) {
                redCards.push(c);
            }
        });
        return redCards;
    });
    roomData.putCards = [[], [], [], []];
    roomData.gameRecord.ids = roomData.ids;
    roomData.gameRecord.putCardRecords.push([]);
    roomData.gameRecord.timeList.push(Date.now());
    roomData.gameRecord.initCardList.push(JSON.parse(JSON.stringify(roomData.cards)));
    roomData.gameRecord.redCardsList.push(JSON.parse(JSON.stringify(roomData.redCards)));
    this.room[roomId] = roomData;
};

// 初始化Waiting阶段的数据
gameManager.initWaitingData = function (roomId, configData) {
    if (configData == null) {
        configData = {
            totTurn: 2,             // 总局数
            youliangbigen: false,   // 有亮必跟
            pingjufanbei: true,      // 平局翻倍
        };
    }
    this.room[roomId] = {
        config: configData,
        roomId: roomId,
        turn: 1,
        personNum: 0,
        state: 'Waiting',
        ids: [null, null, null, null],
        readyStates: ['not', 'not', 'not', 'not'],
        points: [0, 0, 0, 0],
        cards: [[], [], [], []],
        pointRecords: [],
        double: 1,
        rank: [-1, -1, -1, -1],
        winTime: [0, 0, 0, 0],
        loseTime: [0, 0, 0, 0],
        tieTime: [0, 0, 0, 0],
        gameRecord: {   // // 用于记录比赛数据
            config: configData,
            ids: [null, null, null, null],
            timeList: [],
            putCardRecords: [],
            date: Date.now(),
            initCardList: [],
            showRedList: [],
            redCardsList: [],
        },
    };
},

// // 产生随机的扑克牌
// gameManager.generateInitCards = function (startIdx) {
//     if (startIdx == null) {
//         startIdx = 0;
//     }

//     var cards = [];
//     for (var i = 0; i < 4; i ++) cards.push([]);

//     var arr = [];
//     for (var i = 1; i <= 4; i ++) {
//         var len = 13;
//         if (i <= 2) len = 14;
//         for (var j = 1; j <= len; j ++) {
//             var num = i * 100 + j;
//             arr.push(num);
//         }
//     }

//     arr.forEach((num)=>{
//         var idx = Math.floor(Math.random() * 4);
//         for (var k = 0; k < 4; k ++) {
//             var p = (idx+k) % 4;
//             var maxLen = 13;
//             if (p == startIdx || p == (startIdx+1)%4) maxLen = 14;
//             if (cards[p].length < maxLen) {
//                 cards[p].push(num);
//                 break;
//             }
//         }
//     });

//     return cards;
// };
// test 
gameManager.generateInitCards = function (startIdx) {
    return [[211, 210], [212,410], [313, 302], [401, 402, 111, 112, 113, 214, 114]];
}

gameManager.cardCmp = function (x, y) {
    var xx = x % 100;
    var yy = y % 100;
    if (yy == 10) return -1;
    if (xx == 10) return 1;
    if (y == 214) return -1;
    if (x == 214) return 1;
    if (y == 114) return -1;
    if (x == 114) return 1;
    if (yy == 2) return -1;
    if (xx == 2) return 1;
    if (yy == 1) return -1;
    if (xx == 1) return 1;
    if (xx == yy) {
        return x - y;
    }
    return xx - yy;
};

gameManager.getMinCard = function (cards) {
    if (cards.length <= 0) {
        return null;
    }
    var card = cards[0];
    for (var i = 1; i < cards.length; i ++) {
        var tmpCard = cards[i];
        if (this.cardCmp(card, tmpCard) > 0) {
            card = tmpCard;
        }
    }
    return card;
};

gameManager.testLog = function (roomId) {
    if (this.room == null || this.room[roomId] == null)
        return;
    console.log('\n\n\n\n\n');
    Object.keys(this.room[roomId]).forEach((key)=>{
        if (key == 'cards') {
            console.log('| ' + roomId + ': ' + key + ': ' + JSON.stringify(this.room[roomId][key].map((x)=>{return x.length})));
        }
        else {
            console.log('| ' + roomId + ': ' + key + ': ' + JSON.stringify(this.room[roomId][key]));
        }
    });
    console.log('gameRecord:' + JSON.stringify(this.room[roomId].gameRecord));
};

// 辅助功能
gameManager.faceTalk = function (id, roomId, picId) {
    if (this.room[roomId] != null) {
        var data = {
            id: id,
            type: 'talk',
            talkType: 'face',
            picId: picId
        };
        this.room[roomId].ids.forEach((_id)=>{
            var ws = this.wsMap[_id];
            if (ws != null && ws.readyState == WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        });
    }
};

gameManager.convenientTalk = function (id, roomId, talkId) {
    if (this.room[roomId] != null) {
        var data = {
            id: id,
            type: 'talk',
            talkType: 'convenient',
            talkId: talkId
        };
        this.room[roomId].ids.forEach((_id)=>{
            var ws = this.wsMap[_id];
            if (ws != null && ws.readyState == WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        });
    }
};

gameManager.talk = function (id, roomId, content) {
    if (this.room[roomId] != null) {
        var data = {
            id: id,
            type: 'talk',
            talkType: 'normal',
            content: content
        };
        this.room[roomId].ids.forEach((_id)=>{
            var ws = this.wsMap[_id];
            if (ws != null && ws.readyState == WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        });
    }
};

gameManager.checkCanLeave = function (id, roomId) {
    if (this.room[roomId] == null) {
        return true;
    }
    if (this.room[roomId].state == 'Waiting' && this.room[roomId].turn == 1) {
        return true;
    }
    else {
        return false;
    }
};

/**
 * 尝试退出房间的请求，包括 申请推出房间，同意退出房间，以及不同意退出房间
 */
gameManager.tryQuitGame = function (id, roomId, request, isInitiator) {
    if (this.room == null || this.room[roomId] == null) {
        return;
    }
    if (this.room[roomId].state == 'Waiting' && this.room[roomId].turn == 1) {  // 开局之前可以直接离场
        return;
    }
    if (this.room[roomId].quitGameRequestList == null && !isInitiator) {    // 如果现在没有申请 & 我不是请求发起者，return
        return;
    }
    if (this.room[roomId].quitGameRequestList != null && isInitiator) {     // 如果现在有申请，此时我也发起了申请，return
        return;
    }
    var idx = this.room[roomId].ids.indexOf(id);
    if (idx == -1) {
        return;
    }
    if (isInitiator) {
        this.room[roomId].quitGameRequestList = [null, null, null, null];
        this.room[roomId].quitGameRequestList[idx] = true;
        this._quitGameCheck(roomId);
    }
    else {
        if (request == true) {
            this.room[roomId].quitGameRequestList[idx] = true;
            this._quitGameCheck(roomId);
        }
        else {
            this.room[roomId].quitGameRequestList = null;
            this._quitGameCheck(roomId);
        }
    }
};

gameManager._quitGameCheck = function (roomId) {
    if (this.room[roomId] == null) {
        return;
    }
    if (this.room[roomId].quitGameRequestList == null) {
        var data = {
            type: 'quitGameRequest',
            result: 'cancel',   // 有玩家不同意，则取消
        };
        this.room[roomId].ids.forEach((id)=>{
            var ws = this.wsMap[id];
            if (ws != null && ws.readyState == WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        });
    }
    else {
        var allOk = true;
        for (var i = 0; i < 4; i ++) {
            if (this.room[roomId].readyStates[i] != 'offline' && this.room[roomId].quitGameRequestList[i] != 'true') {
                allOk = false;
                break;
            }
        }
        if (allOk) {
            var data = {
                type: 'quitGameRequest',
                result: 'quit',     // 全部玩家同意，则退出
            };
            this.room[roomId].ids.forEach((id)=>{
                var ws = this.wsMap[id];
                if (ws != null && ws.readyState == WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            });
            setTimeout(()=>{
                this.clearRoom(roomId);
            }, 1000 * 1);  // 游戏结束后1秒
        }
        else {
            var data = {
                type: 'quitGameRequest',
                result: 'wait',     // 仍有玩家没做决定，则等待
                quitGameRequestList: this.room[roomId].quitGameRequestList,
            };
            this.room[roomId].ids.forEach((id)=>{
                var ws = this.wsMap[id];
                if (ws != null && ws.readyState == WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            });
        }
    }
};


module.exports = gameManager;
