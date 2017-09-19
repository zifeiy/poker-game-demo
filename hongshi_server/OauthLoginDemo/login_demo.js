var http = require('http');
var qs = require('querystring');
var oauth_host = "oauth.anysdk.com";
var oauth_path = "/api/User/LoginOauth/";
var resJson = null;
var checkLogin = function(postData, callback){
	var options={
	host:oauth_host,
	path:oauth_path,
	method:"post",
	headers:{
	     "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
	     "Content-Length":postData.length,
//	     "User-Agent":"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)"
	}
	};

	console.log("#post url:\n"+oauth_host+oauth_path)
	console.log("#post data:\n"+postData)
	var reqToAnysdk=require("http").request(options,function(resFromAnysdk){
			resFromAnysdk.setEncoding("utf8");
			resFromAnysdk.on("data",function(data){
				console.log("#return data:\n"+data);
				resJson = JSON.parse(data);
				if (resJson && (resJson.status=="ok")) {
					resJson.ext = "登陆验证成功";
					callback(JSON.stringify(resJson));
				}else{
					callback(JSON.stringify(resJson));
				}				
			});

	});

	reqToAnysdk.write(postData);
	reqToAnysdk.end();

}
var login = function(req, res){
    var info ='';
    req.addListener('data', function(chunk){
        info += chunk;
    });
    req.addListener('end', function(){
        checkLogin(info, function(msg){
		res.write(msg);
		res.end();
        });
    });
}
var server = http.createServer(login);
server.listen(8888);
