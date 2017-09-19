var testRigister = new Object();
var WebSocket = require('ws');

testRigister.handle = function (id, data, ws) {
    console.log('testRigister HAHA! ' + id);
    setInterval(()=>{
        var data = {
            word: "hohoho",
            id: id,
        };
        var sendData = JSON.stringify(data);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(sendData);
        }
    }, 2000);
};

module.exports = testRigister;