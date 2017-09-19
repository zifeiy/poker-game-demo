# 客户端开发者文档
## 主要场景
主要场景文件位于assets/scenes/目录下，包括
- Login.fire    游戏的登陆界面
- Hall.fire     游戏的大厅界面
- Game.fire     正式玩游戏的界面

## 预制资源
预制资源为主要的弹出界面，保存在assets/panel/目录下包括但不限于以下：  
- AgentPanel    代理界面
- BroadcastPanel    广播界面
- ChatPanel     聊天界面
- CreateRoomPanel   创建房间界面
- EnterRoomPanel    进入房间界面
- FinalResultPanel  进行完所有比赛的比赛结算界面
- HowToPlayPanel    玩法界面
- InviteCodePanel   邀请码界面
- RecordDetailPanel 一场房间的比赛里面每一局的数据界面
- RecordMainPanel   一场房间的比赛的总的数据界面
- ResultPanel   一局结束时候的结算界面
- ScreenMessage     弹出系统消息的界面
- SettingPanel  设置界面
- SharePanel    分享界面
- ShopPanel     商城界面
- UserInfoPanel 用户信息界面

上述预制资源军通过uicreator.js中的函数来调用。  

### 其余预制资源
因为一个界面下可能有多个相同item组件，所以将这些item组件作为预制资源存放在assets/item/目录下。

### 辅助脚本
辅助脚本均放在assets/scripts/assist/目录下，主要脚本和功能如下：
- AnimInAndOut:调用该脚本的节点在onLoad的时候会自动进行一个渐现的同时放大的动作，同时脚本中包含关闭的时候渐隐的同时缩小的动作
- AnimMoveInAndOut:调用该脚本的节点在onLoad的时候会从屏幕的右侧进入，在消失前会进行右移出屏幕的动作
- SDKManager:该脚本用于实现AnySDK中接入的SDK的一些通用功能，如：登陆，分享，支付等
- ScreenShoter：该脚本用于截屏，并将截屏后的图片保存在本地

### 基础脚本
- audioPlayer：该脚本封装了cocos creator的音频接口，用于播放音效和音乐，并且可以通过该脚本提供的接口控制音效和音乐的大小
- hongshi: 基础的脚本，用户信息以及游戏运行中获得的其他用户的数据都会作为hongshi的成员变量保存在整个游戏运行过程中
- nativeLoader: 该脚本用于下载远程url对应的图片到本地并保存
- netEngine: 该脚本用于以WebSocket的方式与服务器端进行网络通信
- pokerPutHelper：出牌的所有逻辑，包括判断牌的类型，判断几张牌能否跟得上另外几张牌，根据别人出的牌获得我所有的可以出的牌等
- uicreator：为所有通过cc.loader.loadRes提供的通用的接口



## 网络通信
客户端主要通过WebSocket和服务器进行通信，有关WebSocket通信的细节见netENgine.js脚本，其中主要以短连接为主（netEngine.send函数），即客户端发送一条消息给服务器，服务器处理之后会返回消息给客户端，客户端接收到服务器返回的消息后便会断开这个WebSocket连接。  

另外的一个就是长链接（通过netEngine.register），目前只有一个长链接（即'enterroom'消息），用户进入房间（即Game场景）后即与服务器进行一个长连接，即一直不断开WebSocket通信，这个时候客户端通过接受服务器端返回的房间数据来更新当前房间的消息，通过继续通过出牌、聊天等向服务器发送聊天消息。

### 注意事项：
* 目前的长连接只有一个，后续还需至少增加一个，用于监听网络，当网络断开时自动跳回到Login场景
* 目前服务器返回的数据为没有经过处理的房间数据，所以客户端也是按照这种数据来进行处理的；后期服务端需要更改返回的数据，所以客户端也需要做相应调整。

## Game.js
Game.js是Game场景中的主要脚本，游戏场景中主要有四个状态：
- 'Waiting'状态：房间等待的状态
- 'ShowRed'状态：亮红状态
- 'Gaming'状态：打牌阶段的状态
- 'SomeoneOffline'状态：有人离线的时候的状态

客户端会根据接收到的数据的type类型来进行判断，并更新当前客户端的状态。
关于如何处理见Game.js脚本中的handle函数。

## 学习资料
cocos creator官网：http://www.cocos.com/  
cocos creator官方教程：http://www.cocos.com/docs/creator/  
cocos creator论坛：http://forum.cocos.com/  
cocos creator api:http://www.cocos.com/docs/creator/api/  
