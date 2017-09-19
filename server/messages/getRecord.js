var dbManager = require('../base/dbManager.js');

var getRecord = new Object();
getRecord.getReply = function (id, data, callBack) {
    var resData = null;
    dbManager.select('select * from room_competition where id1=' + id + ' or id2=' + id + ' or id3=' + id + ' or id4=' + id + ' limit 3', (rows)=>{
        if (rows.length > 0) {
            resData = {
                results: rows
            };
        }
        callBack(resData);
    });
};
module.exports = getRecord;