cc.Class({
    extends: cc.Component,

    properties: {
        itemLayout: cc.Node,
        titleLabel: cc.Label,
        showLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
    },

    init: function (data) {
        var infoList = data.infos;
        if (infoList == null || infoList.length <= 0) {
            return;
        }
        for (var i = 0; i < infoList.length; i ++) {
            let idx = i;
            cc.loader.loadRes("item/BroadcastItem", (err, prefab)=>{
                if (!err) {
                    var node = cc.instantiate(prefab);
                    this.itemLayout.addChild(node);
                    node.getComponent("BroadcastItem").init(infoList[idx], this.titleLabel, this.showLabel);
                    if (idx == infoList.length -1) {
                        node.getComponent("BroadcastItem").onClickItem();
                    }
                    this.itemLayout.addChild(node);
                }
            }); 
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
