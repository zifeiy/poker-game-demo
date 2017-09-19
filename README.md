项目地址：[https://github.com/zifeiy/poker-game-demo](https://github.com/zifeiy/poker-game-demo)  

#### 文件组成
- client：客户端，使用Cocos Creator打开即可
- sever：服务器端。使用node.js编写，是一个极简的服务器，只是做了一下简单的封装，仅供学习使用。
- client_console：客户端测试程序，可以模拟登陆，进房间。

#### 服务器server配置
用的是mysql，所以得先运行在mysql中创建一个名为hongshi的database，然后导入hongshi.sql。  
然后npm安装一下需要的包，主要是ws，express，别的你运行`node server.js`提示缺什么就npm install什么。  
我没有写配置文件，所以你有时间可以写一下配置文件，然后直接`npm install`就可以了。  
`node server.js`运行服务器程序。  
进入IpGet目录，然后`node socket_io_ip_server.js`（这一步不是必需的），它主要用来获取客户端的ip地址，因为ws库没有找到获取ip地址的方法。  
理论上我可以获得你的IP地址甚至MAC地址。  
其他见server/目录下的README.md  

#### 客户端client配置
见client/目录下的README.md  

#### 客户端命令行client_console配置
见client_console/目录下的README.md  

写这个有很多bug的项目花费了我整整12天的时间，希望这套资源能够给大家带来帮助。  
有很多bug，仅供学习使用。  
可以完整的玩游戏。