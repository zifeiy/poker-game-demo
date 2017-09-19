var SDKManager = require('SDKManager');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {

    },

    _onClickBuy: function (num) {
        cc.log('buy : ' + num);
        SDKManager.pay(num);
    },

    // 6
    onClickBuy6: function () {
        this._onClickBuy(6);
    },

    // 18
    onClickBuy18: function () {
        this._onClickBuy(18);
    },

    // 30
    onClickBuy30: function () {
        this._onClickBuy(30);
    },

    // 98
    onClickBuy98: function () {
        this._onClickBuy(98);
    },

    // 128
    onClickBuy128: function () {
        this._onClickBuy(128);
    },

    // 328
    onClickBuy328: function () {
        this._onClickBuy(328);
    },

    // 698
    onClickBuy698: function () {
        this._onClickBuy(698);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
