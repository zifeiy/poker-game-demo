var gameManager = require('../base/gameManager.js');

var showRed = new Object();
showRed.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var showRed = data.showRed;
    gameManager.showRed(id, roomId, showRed);
    callBack();
};
module.exports = showRed;