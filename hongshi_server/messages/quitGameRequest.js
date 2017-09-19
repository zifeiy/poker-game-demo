var gameManager = require('../base/gameManager.js');

var quitGameRequest = new Object();
quitGameRequest.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var request = data.request;
    var isInitiator = data.isInitiator;
    gameManager.tryQuitGame(id, roomId, request, isInitiator);
    callBack();
};
module.exports = quitGameRequest;