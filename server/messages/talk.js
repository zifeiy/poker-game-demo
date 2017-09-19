/**
 * talk: 聊天内容
 *  -- roomId: 房间编号
 *  --  content: 聊天内容
 */
var gameManager = require('../base/gameManager.js');

var talk = new Object();

talk.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var content = data.content;
    gameManager.talk(id, roomId, content);
    callBack();
};

module.exports = talk;