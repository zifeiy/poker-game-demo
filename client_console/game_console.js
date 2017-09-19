var hongshi = require('./hongshi.js');
var netEngine = require('./netEngine.js');

var args = process.argv;
if (args.length < 4) {
	console.log('[usage]node game_console.js [roomId] [id]');
	return;
}
	
var roomId = args[2];
var id = parseInt(args[3]);
hongshi.userData = {
	id: id,
};

netEngine.register('enterroom', {roomId: roomId}, (data)=>{
    if (data.type == 'roomFull') {
    	console.log('room full. (' + roomId + ')');
    	netEngine.unRegister('enterroom');
    }
});