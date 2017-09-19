var gameManager = require('../base/gameManager.js');

var roomPrepare = new Object();
roomPrepare.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var prepare = data.prepare;
    gameManager.prepare(id, roomId, prepare);
    callBack();
};
module.exports = roomPrepare;