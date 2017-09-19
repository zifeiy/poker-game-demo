cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {

    },

    showPic: function (picId) {
        this.node.stopAllActions();
        this.node.opacity = 0;
        cc.loader.loadRes("UI/game_face", cc.SpriteAtlas, (err, atlas)=>{
            if (!err) {
                var frame = atlas.getSpriteFrame('game_face' + picId);
                this.node.getComponent(cc.Sprite).spriteFrame = frame;
            }
            var fadeOut = cc.fadeOut(0.5);
            var nothing = cc.moveBy(0.5, cc.p(0, 0));
            var moveUp = cc.moveBy(0.5, cc.p(0, 10));
            var moveDown = cc.moveBy(0.5, cc.p(0, -10));
            this.node.opacity = 255;
            this.node.runAction(cc.sequence(moveUp, moveDown, moveUp, moveDown, nothing, fadeOut));
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
