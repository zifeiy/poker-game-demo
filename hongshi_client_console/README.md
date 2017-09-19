# 客户端命令行开发者文档
写这几个程序的原因主要是为了方便进行测试。  
因为需要做的是四个人玩的红十，所以需要开三个机器人进入房间一起玩。  
目前的功能是：  
输入
`node game_console.js 123456 100001`就能使id为100001的用户进入roomId为123456的房间。  
输入
`node assist.js 123456 100001 roomPrepare roomId:123 prepare:true`就能让在roomId为123456的id为100001的玩家进入准备状态

输入
`node assist.js 123456 100001 roomPrepare roomId:123 prepare:false`就能让在roomId为123456的id为100001的玩家取消准备状态