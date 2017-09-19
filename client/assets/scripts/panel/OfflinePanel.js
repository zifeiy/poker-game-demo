var hongshi = require('hongshi');

cc.Class({
    extends: cc.Component,

    properties: {
        nameListLabel: cc.Label,
        leftTimeLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        
    },

    initData: function (data) {
        // cc.log('lol data.timer = ' + data.timer);
        this.timer = data.timer;
        this._showLeftTime();
        if (!this.leftTimeScheduled) {
            this.leftTimeScheduled = true;
            this.schedule(()=>{
                this._showLeftTime();
            }, 1);
        }

        // 显示离线人员列表
        var offlineNameList = [];
        for (var i = 0; i < 4; i ++) {
            if (data.readyStates[i] == 'offline') {
                var id = data.ids[i];
                var name = id;
                if (hongshi.playersInfo != null && hongshi.playersInfo[id] != null) {
                    name = hongshi.playersInfo[id].name;
                }
                offlineNameList.push(name);
            }
        }
        var nameListString = "";
        for (var i = 0; i < offlineNameList.length; i ++) {
            if (i == 0) nameListString += offlineNameList[i];
            else nameListString += ',' + offlineNameList[i];
        }
        this.nameListLabel.string = nameListString;
    },

    _showLeftTime: function () {
        // cc.log('lol show begin: ' + this.timer);
        // 显示剩余等待时间
        if (this.timer > 0) {
            this.timer -= 1;
        }
        var time = this.timer;
        var leftMinutes = parseInt(time / 60);
        var leftSeconds = time % 60;
        var leftTimeString = leftSeconds + "秒";
        if (leftMinutes > 0) {
            leftTimeString = "" + leftMinutes + "分" + leftTimeString;
        }
        // cc.log('lol show ' + leftMinutes + '分 ' + leftSeconds + '秒 ' + leftTimeString);
        this.leftTimeLabel.string = leftTimeString;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});
