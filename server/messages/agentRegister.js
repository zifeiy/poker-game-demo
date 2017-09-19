var dbManager = require('../base/dbManager.js');

var agentRegister = new Object();
agentRegister.getReply = function (id, queryData, callBack) {
    // var name = data.name;
    // var phone = data.phone;
    // var wechat = data.wechat;
    dbManager.insert('insert into agent set ?', queryData, (result)=>{
        callBack({result: true});
    }, ()=>{
        callBack({result: false});
    });
};
module.exports = agentRegister;