var enterroom = new Object();
var gameManager = require('../base/gameManager.js');
var WebSocket = require('ws');

enterroom.handle = function (id, data, ws) {
    console.log('enterroom id=' + id + ", data=" + data);
    
    var id = id;
    var roomId = data.roomId;
    gameManager.enterRoom(id, roomId, ws);

};

module.exports = enterroom;