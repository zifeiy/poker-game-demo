/**
 * faceTalk: 发送快捷聊天
 *  -- roomId: 房间编号
 *  --  talkId: 便捷聊天编号
 */
var gameManager = require('../base/gameManager.js');

var convenientTalk = new Object();

convenientTalk.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var talkId = data.talkId;
    gameManager.convenientTalk(id, roomId, talkId);
    callBack();
};

module.exports = convenientTalk;