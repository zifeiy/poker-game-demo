var gameManager = require('../base/gameManager.js');

var createNewRoom = new Object();
createNewRoom.getReply = function (id, data, callBack) {
    var startRoomId = Math.floor(Math.random() * 1e6);
    var roomId = -1;
    for (var i = 0; i < 999999; i ++) {
    	var tmpRoomId = (startRoomId + i) % 1000000;
    	if (gameManager.room == null || gameManager.room[tmpRoomId] == null) {
    		roomId = tmpRoomId;
    		break;
    	}
    }
    if (roomId != -1) {
    	gameManager.createRoom(roomId, data);
    }
    var sendData = {
    	roomId: roomId,
    };
    callBack(sendData);
};
module.exports = createNewRoom;