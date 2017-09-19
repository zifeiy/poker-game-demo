/**
nodejs 接收anysdk支付通知demo
注意：根据自己游戏及代码要求进行代码优化调整
*/

var http = require('http');
var querystring = require('querystring');
var util = require('util');
var crypto = require('crypto');

//anysdk privatekey
var private_key = 'EDFD9E563A3D9639BDBD1D1FA5E6E603';
//anysdk 增强密钥
var enhanced_key = 'N2VlYzQ1MWQ3ZDhhOTYyYmE5YTk';

//md5
var my_md5 = function(data){
	//中文字符处理
	data = new Buffer(data).toString("binary");
	return crypto.createHash('md5').update(data).digest('hex').toLowerCase();
}

//通用验签
var check_sign = function(post,private_key){	
	var source_sign = post.sign;
	delete post.sign;
	var new_sign = get_sign(post,private_key);	
	
	if(source_sign == new_sign){
		return true;
	}
	return false;
}

//增强验签
var check_enhanced_sign = function(post,enhanced_key){
	var source_enhanced_sign = post.enhanced_sign;
	delete post.enhanced_sign;
	delete post.sign;
	var new_sign = get_sign(post,enhanced_key);

	if(source_enhanced_sign == new_sign){
		return true;
	}
	return false;	
}

//获取签名
var get_sign = function(post,sign_key){
	var keys = [];

	for(key in post){
		console.log("Key:"+key+"\tVaule:"+post[key]);
		keys.push(key);
		
	}
	keys = keys.sort();
	var paramString = '';
	for(i in keys){
		paramString += post[keys[i]];
	}
	console.log("拼接的字符串:"+paramString);
	console.log("第一次md5:"+my_md5(paramString));
	console.log("加入密钥:"+my_md5(paramString)+sign_key);
	console.log("第二次md5:"+my_md5(my_md5(paramString)+sign_key));
	
	return  my_md5(my_md5(paramString)+sign_key);
}

//接收支付通知
var notice = function(req, res){
    var post ='';
    req.addListener('data', function(chunk){
        post += chunk;
    });
    req.addListener('end', function(){
	console.log(post+"\n");
	post = querystring.parse(post);
	if(check_sign(post,private_key) && check_enhanced_sign(post,enhanced_key)){		
	//if(check_enhanced_sign(post,enhanced_key)){		
		//异步处理游戏支付发放道具逻辑
		res.end('ok');
	}else{
		res.end(util.inspect(post));        
	}

    });
}


var server = http.createServer(notice);
server.listen(8889);

