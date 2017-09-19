var hongshi = require('hongshi');
var ui = require('uicreator');
var netEngine = require('netEngine');

var SDKManager = new Object();

SDKManager.oauthLoginServer = 'http://101.37.19.68:8888/';
SDKManager.appKey = 'AC69D4BA-8D3D-A803-AC63-7AF59492B8E5';
SDKManager.appSecret = '4a1bf56812cce2daf60fb3a4beb9b004';
SDKManager.privateKey = '6AAAC471C1E8EB8F10E1DD4DDA574D49';

SDKManager.init = function () {
    if (this.agentManager != null) {
        return;
    }
    if(cc.sys.isMobile){
        this.agentManager = anysdk.agentManager;
        this.agentManager.init(this.appKey, this.appSecret, this.privateKey, this.oauthLoginServer);
        this.userPlugin = this.agentManager.getUserPlugin();
        this.iapPlugin = this.agentManager.getIAPPlugin();
        this.sharePlugin = this.agentManager.getSharePlugin();
        if(this.userPlugin){
            this.userPlugin.setListener(this.onUserResult, this);
        }
        if(this.iapPlugin){
            this.iapPlugin.setListener(this.onPayResult, this);
        }
        if(this.sharePlugin){
            this.sharePlugin.setListener(this.onShareResult, this);
        }
    }
};

SDKManager.login = function () {
    cc.log('SDKManager login...');
    this.init();
    if(this.userPlugin){
        this.userPlugin.login();
    }
};

SDKManager.pay = function (gem) {
    cc.log('SDKManager pay...');
    this.init();
    if(this.iapPlugin){
        var info = {
            'Product_Id': '1000' + gem,                    //商品唯一标示符
            'Product_Name': gem + '颗钻石',            //商品名称
            'Product_Price': '' + gem,                    //商品单价
            'Product_Count': '1',                      //商品数量
            'Product_Desc': gem + '颗钻石',            //商品描述 
            'Coin_Name': 'zuanshi',                      //虚拟币名称
            'Coin_Rate': '1',                          //虚拟币兑换率
            'Role_Id': '' + hongshi.userData.id,    //角色唯一标示符
            'Role_Name': '' + hongshi.userData.name,                      //角色名称
            'Role_Grade': '1',                         //角色等级
            'Role_Balance': '' + hongshi.userData.gem,  //虚拟币余额
            'Vip_Level': '0',                          //VIP等级
            'Party_Name': 'null',                      //工会名称
            'Server_Id': '1',                          //服务器唯一标示符
            'Server_Name': '1',                        //服务器名称
            'EXT': 'Cocos Creator'                     //扩展字段
        };
        this.iapPlugin.payForProduct(info);
    }
};

// SDKManager.share = function () {
//     cc.log('SDKManager share...(this is forbidden now)');
//     this.init();
//     if(this.sharePlugin){
//         var info = {
//             'title' : 'HuanLe HongShi Title',                   // 标题名称
//             'titleUrl' : 'http://www.cocos.com',      // 标题链接
//             'site' : 'HuanLe HongShi Site',                    // 标题网站名
//             'siteUrl' : 'http://www.cocos.com',       // 标题网站链接
//             'text' : '欢乐红十的分享内容',//分享内容
//             'comment' : '无',                                 //评论
//             'description': '欢乐红十的描述', //描述
//             'imageTitle': '欢乐红十的图片标题',                              //图片标题
//             'imageUrl': 'http://veewo.com/promo/img/darkslash_web_web_banner.png', //分享图片链接
//             'url': 'http://www.veewo.com/games/?name=darkslash',       //分享链接
//         };
//         this.sharePlugin.share(info);
//     }
// };

/**
 * 微信分享有如下参数：
 * 
        shareTo：分享的目标，0聊天窗口，1朋友圈，2收藏
        mediaType：分享类型，0 文本，1 图片，2 页面，3 音乐，4视频
        thumbSize：图片的缩略图大小，不能超过 127，微信不支持超过 32 k 的缩率图
        url：音乐，及网页的路径 
        imagePath：图片路径（本地图片，如"/sdcard/test.png"）
        title：分享的标题
        text：分享的内容
*/

// 分享文本：shareTo、mediaType、text
// 分享图片：shareTo、mediaType、imagePath、thumbSize
// 分享页面：shareTo、mediaType、imagePath、thumbSize、url、title、text

SDKManager.share = function (info) {
    cc.log('SDKManager share...');
    this.init();
    if (this.sharePlugin) {
        this.sharePlugin.share(info);
    }
};


SDKManager.onUserResult = function (code, msg) {
    cc.log('########## USER RESULT ########## code: ' + code + ',msg: ' + msg);
    switch(code)
    {
    case anysdk.UserActionResultCode.kInitSuccess://用户系统初始化成功
        ui.createScreenMsg('用户系统初始化成功');
        break;
    case anysdk.UserActionResultCode.kInitFail://用户系统初始化失败
        ui.createScreenMsg('用户系统初始化失败');
        //do
        break;
    case anysdk.UserActionResultCode.kLoginSuccess://用户系统登录成功
        console.log('########## LOGIN SUCCESS ##########');
        ui.createScreenMsg('账号登录成功...');
        this.handleAfterLogin();
        break;
    case anysdk.UserActionResultCode.kLoginNetworkError://用户系统网络错误
        ui.createScreenMsg('用户系统网络错误');
        break;
    case anysdk.UserActionResultCode.kLoginNoNeed://用户系统无需登录
        ui.createScreenMsg('用户系统无需登录');
        break;
    case anysdk.UserActionResultCode.kLoginFail://用户系统登录失败
        ui.createScreenMsg('账户登录出错,请重新登录...');
        break;
    case anysdk.UserActionResultCode.kLoginCancel://用户系统登录取消
        ui.createScreenMsg('账户取消登录...');
        break;
    default:
        break;
    }
};

SDKManager.onPayResult = function (code, msg) {
    cc.log('########## PAY RESULT ########## code: ' + code + ',msg: ' + msg);
    switch(code){
        case anysdk.PayResultCode.kPaySuccess:// 支付系统支付成功
            console.log('########## PAY SUCCESS ##########');
            ui.createScreenMsg('支付成功...')
            break;
        case anysdk.PayResultCode.kPayCancel:// 支付系统支付取消
            ui.createScreenMsg('支付取消...');
            break;
        case anysdk.PayResultCode.kPayFail:// 支付系统支付失败
        case anysdk.PayResultCode.kPayNetworkError:// 支付系统网络错误
        case anysdk.PayResultCode.kPayProductionInforIncomplete:// 支付系统支付信息不完整
            ui.createScreenMsg('支付失败，请重试...');
            break;
        case anysdk.PayResultCode.kPayInitSuccess:// 支付系统初始化成功
            //do
            break;
        case anysdk.PayResultCode.kPayInitFail:// 支付系统初始化失败
            //do
                break;
        case anysdk.PayResultCode.kPayNowPaying:// 支付系统正在支付中
            //do
            break;
        default:
            break;
        }
};

SDKManager.onShareResult = function(code, msg) {
    cc.log('########## Share RESULT ########## code: ' + code + ',msg: ' + msg);
    switch(code){
        case anysdk.ShareResultCode.kShareSuccess://分享系统分享成功
            ui.createScreenMsg('分享成功...');
            break;
        case anysdk.ShareResultCode.kShareFail://分享系统分享失败
        case anysdk.ShareResultCode.kShareCancel://分享系统分享取消
        case anysdk.ShareResultCode.kShareNetworkError://分享系统分享网络出错
            ui.createScreenMsg('分享失败，请重试...');
            break;         
        default:
            break;
    }
};

SDKManager.handleAfterLogin = function () {
    if (this.userPlugin) {
        
        var uid = "" + this.userPlugin.getUserID();
        var info = JSON.parse(this.userPlugin.callStringFuncWithParam('getUserInfo'));

        if (info != null) {
            uid = info.uid;
        }
        // 暂时设置userData.id，下面login或者register返回的数据里面会有id的修改的
        hongshi.userData.id = uid;

        var sendData = {
            uid: uid,
            ip: hongshi.userData.ip,
        };
        netEngine.send('login', sendData, (data)=>{
            if (data == null) {
                var registerData = {};
                // 如果是微信登陆
                if (info != null) {
                    registerData = {
                        uid: info.uid,
                        name: info.nickName,
                        avatarUrl: info.avatarUrl,
                        sex: info.sex,
                        city: info.city,
                        language: info.language,
                        isVip: info.isVip,
                        province: info.province,
                        country: info.country,
                        privilege: JSON.stringify(info.privilege),
                        unionid: info.unionid,
                        ip: hongshi.userData.ip
                    };
                }
                // 如果不是微信登陆
                else {
                    registerData = {
                        uid: uid,
                        name: '游客' + uid,
                        avatarUrl: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM6QaUUp10ojCU23hItZVZ1fFMWpTIo93Z1IBykhLka0xhDbOdic9ssyVdBvCF79ftibCaOJzyHmXEEwJa0AYwsKAFHacRKIjibAKM/0",
                        sex: Math.floor(Math.random() * 3),
                        city: '杭州',
                        language: '中文',
                        isVip: Math.floor(Math.random() * 2),
                        province: '浙江省',
                        country: '中国',
                        privilege: null,
                        unionid: '游客unionId-' + uid,
                        ip: hongshi.userData.ip
                    };
                }
                netEngine.send('register', registerData, (resData)=>{
                    if (resData.result == true) {
                        hongshi.userData = resData.userData;
                        cc.director.loadScene('scenes/Hall');
                    }
                });
            }
            else {
                hongshi.userData = data;
                cc.director.loadScene('scenes/Hall');
            }
        });
    }

};

module.exports = SDKManager;