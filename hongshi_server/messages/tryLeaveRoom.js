var gameManager = require('../base/gameManager.js');

var tryLeaveRoom = new Object();

tryLeaveRoom.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    if (gameManager.checkCanLeave(id, roomId) == true) {
        callBack({canLeave: true});
    }
    else {
        callBack({canLeave: false});
    }
};

module.exports = tryLeaveRoom;