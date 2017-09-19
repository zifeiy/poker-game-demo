var hongshi = require('hongshi');

var netEngine = new Object();

netEngine.send = function (identifier, data, callBack) {
    var ws = new WebSocket(hongshi.serverAddress);
    ws.onopen = function (msg) {
        var sendData = {
            "identifier": identifier,
            'type': 'send',
            "data": data,
        };
        if (hongshi.userData != null && hongshi.userData.id != null) {
            sendData.id = hongshi.userData.id;
        }
        var sendString = JSON.stringify(sendData);
        ws.send(sendString);
    };
    ws.onmessage = function(msg) {
        cc.log('net:receive:before: ' + msg.data);
        var data = JSON.parse(msg.data);
        if (data.identifier == identifier) {
            if (callBack != null) {
                callBack(data.data);
            }
            ws.close();
        }
        else {
            cc.log('net:receive: ' + msg);
        }
    };
};

netEngine.register = function (identifier, data, callBack) {
    var ws = new WebSocket(hongshi.serverAddress);
    if (this.registeredList == null) {
        this.registeredList = {};
    }
    this.registeredList[identifier] = ws;
    ws.onopen = function (msg) {
        var sendData = {
            "identifier": identifier,
            'type': 'register',
            data: data,
        };
        if (hongshi.userData != null && hongshi.userData.id != null) {
            sendData.id = hongshi.userData.id;
        }
        var sendString = JSON.stringify(sendData);
        ws.send(sendString);
    };
    ws.onmessage = function(msg) {
        cc.log('net:receive:before: ' + msg.data);
        var data = JSON.parse(msg.data);
        if (callBack != null) {
            callBack(data);
        }
    };
    ws.onclose = ()=>{
        this.registeredList[identifier] = null;
    };
};

netEngine.unRegister = function (identifier) {
    if (this.registeredList == null) return;
    if (this.registeredList[identifier] != null) {
        if (this.registeredList[identifier].readyState == WebSocket.OPEN)
            this.registeredList[identifier].close();
        this.registeredList[identifier] = null;
    }
}

netEngine.unRegisterAll = function () {
    if (this.registeredList == null) return;
    Object.keys(this.registeredList).forEach((identifier)=>{
        if (this.registeredList[identifier] != null) {
            if (this.registeredList[identifier].readyState == WebSocket.OPEN)
                this.registeredList[identifier].close();
            this.registeredList[identifier] = null;
        }
    });
}


module.exports = netEngine;