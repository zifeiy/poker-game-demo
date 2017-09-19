cc.Class({
    extends: cc.Component,

    properties: {
        card_101: cc.Node,
        card_102: cc.Node,
        card_103: cc.Node,
        card_104: cc.Node,
        card_105: cc.Node,
        card_106: cc.Node,
        card_107: cc.Node,
        card_108: cc.Node,
        card_109: cc.Node,
        card_110: cc.Node,
        card_111: cc.Node,
        card_112: cc.Node,
        card_113: cc.Node,

        card_201: cc.Node,
        card_202: cc.Node,
        card_203: cc.Node,
        card_204: cc.Node,
        card_205: cc.Node,
        card_206: cc.Node,
        card_207: cc.Node,
        card_208: cc.Node,
        card_209: cc.Node,
        card_210: cc.Node,
        card_211: cc.Node,
        card_212: cc.Node,
        card_213: cc.Node,

        card_301: cc.Node,
        card_302: cc.Node,
        card_303: cc.Node,
        card_304: cc.Node,
        card_305: cc.Node,
        card_306: cc.Node,
        card_307: cc.Node,
        card_308: cc.Node,
        card_309: cc.Node,
        card_310: cc.Node,
        card_311: cc.Node,
        card_312: cc.Node,
        card_313: cc.Node,

        card_401: cc.Node,
        card_402: cc.Node,
        card_403: cc.Node,
        card_404: cc.Node,
        card_405: cc.Node,
        card_406: cc.Node,
        card_407: cc.Node,
        card_408: cc.Node,
        card_409: cc.Node,
        card_410: cc.Node,
        card_411: cc.Node,
        card_412: cc.Node,
        card_413: cc.Node,

        card_114: cc.Node,
        card_214: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    init: function () {
        for (var i = 1; i <= 4; i ++) {
            var len = 13;
            if (i <= 2) len = 14;
            for (var j = 1; j <= len; j ++) {
                var num = i * 100 + j;
                this["card_" + num].parent = this.node;
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
