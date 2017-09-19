cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function (data, BigTitleLabel, showLabel) {
        this.titleLabel.string = data.title;
        this.content = data.content;
        this.BigTitleLabel = BigTitleLabel;
        this.showLabel = showLabel;

        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "BroadcastItem";
        eventHandler.handler = "onClickItem";
        eventHandler.customEventData = "my data";

        this.node.getComponent(cc.Button).clickEvents = [ eventHandler ];
    },

    onClickItem: function (event) {
        if (this.showLabel != null) {
            this.BigTitleLabel.string = this.titleLabel.string;
            this.showLabel.string = this.content;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
