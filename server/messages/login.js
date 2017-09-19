var dbManager = require('../base/dbManager.js');

var login = new Object();
login.getReply = function (id, data, callBack) {
    var resData = null;
    dbManager.select('select * from users where uid="' + data.uid + '"', (rows)=>{
        if (rows.length > 0) {
            Object.keys(rows[0]).forEach((key)=>{
                console.log('login-getReply:' + key + " ; " + rows[0][key]);
            });
            resData = rows[0];
        }
        if (resData != null) {
            dbManager.update('update users set ip="' + data.ip + '" where uid="' + data.uid + '"');
        }
        callBack(resData);
    });
};
module.exports = login;