var gameManager = require('../base/gameManager.js');

var joinRoom = new Object();

joinRoom.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var roomExist = true;
    if (gameManager.room == null || gameManager.room[roomId] == null) {
        roomExist = false;
    }
    callBack({roomExist: roomExist});
};

module.exports = joinRoom;