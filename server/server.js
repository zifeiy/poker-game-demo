const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.use(function (req, res) {
    res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log("ws connected");

    ws.on('message', function incoming(msg) {
        
        try {
            console.log('received: %s', msg);
            var receivedData = JSON.parse(msg);
            var identifier = receivedData.identifier;
            var type = receivedData.type;
            console.log("identifier is: " + identifier + " , type is: " + type + " , data is: " + JSON.stringify(receivedData.data));

            var theModule = require("./messages/" + identifier + ".js");
            if (theModule == null) {
                console.error("can not solve identifier: " + identifier);
            }
            else {
                if (type == 'send') {
                    console.log('solve sendData ' + identifier);
                    theModule.getReply(receivedData.id, receivedData.data, (data)=>{
                        var sendData = {
                            identifier: receivedData.identifier,
                            data: data,
                        };
                        var sendString = JSON.stringify(sendData);
                        if (ws.readyState == WebSocket.OPEN) {
                            ws.send(sendString);
                        }
                    });
                }
                else if (type == 'register') {
                    console.log('solve registerData ' + identifier);
                    theModule.handle(receivedData.id, receivedData.data, ws);
                }
            }
        } catch (e) {
            console.log('ERROR Happen: ' + e);
        }
            
    });

    ws.on('close', (msg)=>{
        console.log('ws closed');
    });
});

server.listen(8011, function listening() {
  console.log('Listening on %d', server.address().port);
});