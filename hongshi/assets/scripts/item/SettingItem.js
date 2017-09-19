cc.Class({
    extends: cc.Component,

    properties: {
        typeName: 'yinXiao',
        openNode: cc.Node,
        closeNode: cc.Node,
        maskNode: cc.Node,
        handleNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var value = cc.sys.localStorage.getItem(this.typeName);
        this.setValue(value, true);
    },

    setValue: function (value, includeHandle) {   // includeHandle表示是否要对控制点进行操作
        this.value = value;
        this.maskNode.width = 350 * value;
        if (value <= 0) {
            this.closeNode.active = true;
            this.openNode.active = false;
        }
        else {
            this.closeNode.active = false;
            this.openNode.active = true;
        }
        if (includeHandle) {
            this.handleNode.x = -175 + 350 * value;
        }
        this.valueSet = true;
    },

    onClickOpenNodeToClose: function () {
        this.setValue(0, true);
    },

    onClickCloseNodeToOpen: function () {
        this.setValue(1, true);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.value == null) {
            return;
        }
        if (this.valueSet == null) {
            return;
        }
        var handleX = this.handleNode.x;
        var value = (this.handleNode.x + 175) / 350;
        this.setValue(value);
    },
});
