cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.schedule(()=>{
            this.showNext();
        }, 3);
    },

    showNext: function () {
        if (this.idx == null) this.idx = 0;
        this.idx = (this.idx + 1) % 3;
        this.node.getComponent(cc.PageView).scrollToPage(this.idx, 1);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
