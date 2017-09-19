/**
 * faceTalk: 发送聊天图片
 *  -- roomId: 房间编号
 *  --  picId: 图片的编号
 */
var gameManager = require('../base/gameManager.js');

var faceTalk = new Object();

faceTalk.getReply = function (id, data, callBack) {
    var roomId = data.roomId;
    var picId = data.picId;
    gameManager.faceTalk(id, roomId, picId);
    callBack();
};

module.exports = faceTalk;