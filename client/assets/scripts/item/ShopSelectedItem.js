cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        selectedNode: cc.Node,
        notSelectedNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onClick: function () {
        if (this.shopPanel != null) {
            this.shopPanel.onClickSelect(this.index);
        }
    },

    updateShow: function (clicked) {
        this.selectedNode.active = clicked;
        this.notSelectedNode.active = !clicked;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
