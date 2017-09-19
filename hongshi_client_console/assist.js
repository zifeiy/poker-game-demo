var hongshi = require('./hongshi.js');
var netEngine = require('./netEngine.js');

var args = process.argv;
if (args.length < 5) {
	console.log('[usage]node assist.js [roomId] [id] [order] [data:optional]');
	return;
}

	
var roomId = args[2];
var id = parseInt(args[3]);
hongshi.userData = {
	id: id,
};
var order = args[4];
var data = {};
for (var i = 5; i < args.length; i ++) {
	var arr = args[i].split(':');
	if (arr.length != 2) {
		console.log('arg[' + i + ']: ' + args[i] + ' can not be split by ":"');
		return;
	}
	var key = arr[0];
	var value = arr[1];
	if (value == 'true') {
		value = true;
	}
	else if (value == 'false') {
		value = false;
	}
	else {
		try {
			value = parseInt(value);
		}
		catch (e) {}
	}
	data[key] = value;
}


netEngine.send(order, data);

/*
【示例】
房间准备:
node assist.js 123 100001 roomPrepare roomId:123 prepare:true
房间取消准备:
node assist.js 123 100001 roomPrepare roomId:123 prepare:false

*/