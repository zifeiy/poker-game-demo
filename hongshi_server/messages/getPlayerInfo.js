var dbManager = require('../base/dbManager.js');

var getPlayerInfo = new Object();
getPlayerInfo.getReply = function (id, data, callBack) {
    var resData = null;
    dbManager.select('select * from users where id="' + data.id + '"', (rows)=>{
        if (rows.length > 0) {
            resData = {
                id:     rows[0].id,
                name:   rows[0].name,
                sex:    rows[0].sex,
                avatarUrl:  rows[0].avatarUrl,
                city:   rows[0].city,
                province:   rows[0].province,
                country:    rows[0].country,
                ip:     rows[0].country
            };
        }
        callBack(resData);
    });
};
module.exports = getPlayerInfo;