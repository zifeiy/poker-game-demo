var gameManager = require('../base/gameManager.js');

var putCard = new Object();
putCard.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var cards = data.cards;
    gameManager.putCard(id, roomId, cards);
    callBack();
};
module.exports = putCard;