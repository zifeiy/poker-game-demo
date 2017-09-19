// http://www.cnblogs.com/kongxianghai/p/5335632.html

var dbManager = new Object();

var config = require('../config.js');
var mysql = require('mysql');

var connection = mysql.createConnection(config.mysql);

dbManager.insert = function (query, parameter, callBack, failCallBack) {
    // connection.connect();
    connection.query(query, parameter, (err, result)=>{
        if (err) {
            console.error("error insert " + err);
            if (failCallBack != null) {
                failCallBack(err);
            }
            return;
        }
        if (callBack != null) {
            callBack(result);
        }
    });
    // connection.end();
};

dbManager.select = function (query, callBack, failCallBack) {
    // connection.connect();
    connection.query(query, (err, rows, fields)=>{
        if (err) {
            console.error("error select");
            if (failCallBack != null) {
                failCallBack(err);
            }
            return;
        }
        if (callBack != null) {
            callBack(rows);
        }
    });
    // connection.end();
};

dbManager.update = function (query , callBack, failCallBack) {
    // connection.connect();
    connection.query(query, (err, result)=>{
        if (err) {
            console.error("error update");
            if (failCallBack != null) {
                failCallBack(err);
            }
            return;
        }
        if (callBack != null) {
            callBack(result);
        }
    });
    // connection.end();
};

dbManager.delete = function (query, callBack, failCallBack) {
    // connection.connect();
    connection.query(query, (err, result)=>{
        if (err) {
            console.error("error delete");
            if (failCallBack != null) {
                failCallBack(err);
            }
            return;
        }
        if (callBack != null) {
            callBack(result);
        }
    });
    // connection.end();
};

module.exports = dbManager;