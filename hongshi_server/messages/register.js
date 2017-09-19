var dbManager = require('../base/dbManager.js');

var register = new Object();
register.getReply = function (id, data, callBack) { 
    var queryData = data;
    queryData.gem = 0;
    dbManager.insert('insert into users set ?', queryData, (result)=>{
        dbManager.select('select * from users where uid="' + data.uid + '"',(rows)=>{
            if (rows.length > 0) {
                var resData = rows[0];
                callBack({result: true, userData: resData});
            }
            else {
                callBack({result: false});
            }
        });
    }, ()=>{
        callBack({result: false});
    });
};
module.exports = register;