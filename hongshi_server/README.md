# 服务器开发者文档

## 服务器程序列表
运行服务其时需要启动四个服务器程序，分别为：
游戏服务器（用于和客户端进行WebSocket连接的主要服务器）：server.js  
socket.io服务器（因为游戏服务器不知道怎么获得连接的客户端的ip，所以单开了这个服务器用于获取客户端的ip）：IpGet/socket_io_ip_server.js  
AnySDK登陆验证服务器：OauthLoginDemo/login.js  
AnySDK支付服务器：PayNotifyDemo/paynotice.js  
开启服务器的方式为直接使用node，如：开启服务器的指令为：
`node server.js`

## 游戏服务器主要逻辑
游戏服务器需结合客户端代码中的netEngine.js脚本一起来理解。  
客户端每次发送一个请求，服务器都会判断请求数据中的type类型，并相应地调用type对应的脚本，这些脚本都保存在messages目录下。  
比如，客户端发送了一个'login'请求，服务器就会根据发送的数据相应地调用message/login.js脚本。  

具体如何处理见server.js，代码非常清晰。  

# gameManager.js
gameManager.js是服务器端主要的逻辑代码，用于处理Game阶段的所有逻辑。
gameManager一开始是没有设置定时任务的，一旦有第一个人创建房间进入了Game场景，gameManager的定时任务就被出发了，gameManager会每一秒中判断一下当前房间中的所有玩家和房间的动态，并处理游戏逻辑。如果房间状态发生了变化，则相应地调整状态并向客户端发送变更的数据。  
注：目前服务器向客户端发送的诗句还是没有经过处理的所有的数据，后续需要在发送数据前对数据进行处理，比如：不能让别人收到自己的牌的数据，只发送变更的数据以减轻网络压力等（这些均需与客户端协调）。

gameManager还包括处理有人离线了的时候的情况，以及离线了之后又重新回到房间的处理。  
除此之外，玩家在房间里的任何的操作都加在gameManager.js中进行了处理。  
注：因为开发的比较快，其实我对很多逻辑加在gameManager.js中进行并不是很满意，后续如果要修改的话需要拆分成不同的模块，然后由gameManager进行调用，这样比较方便以后的代码维护。  

## 数据库表
users表：包含用户登录的一些基本信息  
http://docs.anysdk.com/faq/sdk-params/#_60  
除此之外还有gem表示钻石金额，ip表示ip地址  

room_competition表：包含房间比赛的信息  
roomId为房间号,id1至id4表示参与比赛的四个玩家的id，data用于存储房间比赛数据  
关于data中的数据详见gameManager.js中的this.room[roomId].gameRecord数据  

agent表：包含代理信息  
包括姓名、电话 和 微信号。  


