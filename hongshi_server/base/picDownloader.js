var http = require('http');
var fs = require('fs');

var picDownloader = new Object();

picDownloader.downLoad = function (id, url) {
	try {
		http.get(url, function (res) {
			res.setEncoding('binary');//转成二进制
			var content = '';
			res.on('data', function (data) {
			   content+=data;
			}).on('end', function () {
			   fs.writeFile('../img/' + id + '.png',content,'binary', function (err) {
				   if (err) throw err;
				   console.log('保存完成');
			   });
			});
		});
	}
	catch (e) {
		console.log('picDownloader:err: ' + e);
	}
};

module.exports = picDownloader;

// test
var url = 'http://wx.qlogo.cn/mmopen/jibo4f5YQVLAYjdIBXh6FBV75NE8NfmicROAZ5zib6IYVAaabTTibwSTt0Ht9icz3HQxOVSgBOOiczSe4YvWN7esIgLgfxfwG1n2DW/0';
picDownloader.downLoad(123456, url);
