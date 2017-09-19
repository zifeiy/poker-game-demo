var hongshi = require('hongshi');

cc.Class({
    extends: cc.Component,

    properties: {
        showContent: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    initPanel: function (data) {
        var len = data.data.putCardRecords.length;
        var resDataList = [];
        for (var i = 0; i < len; i ++) {
            // 获得时间显示字符串
            var dateValue = data.data.timeList[i];
            var theDate = new Date(dateValue);
            var dateString = theDate.getFullYear() + '-' + (theDate.getMonth()+1) + '-' + theDate.getDate() + '  ' + theDate.getHours() + ':';
            if (theDate.getMinutes() < 10) {
                dateString += '0' + theDate.getMinutes();
            }
            else {
                dateString += theDate.getMinutes();
            }

            var resData = {
                players: [
                    {name: hongshi.playersInfo[ data.id1 ].name, point: data.data.pointRecords[i][0]},
                    {name: hongshi.playersInfo[ data.id2 ].name, point: data.data.pointRecords[i][1]},
                    {name: hongshi.playersInfo[ data.id3 ].name, point: data.data.pointRecords[i][2]},
                    {name: hongshi.playersInfo[ data.id4 ].name, point: data.data.pointRecords[i][3]},
                ],
                date: dateString,
                roomData: {

                },
            };
            resDataList.push(resData);
        }
        this.init(resDataList);
    }, 

    init: function (dataList) {
        dataList.forEach((data)=>{
            cc.loader.loadRes("item/RecordDetailItem", (err, prefab)=>{
                if (!err) {
                    var node = cc.instantiate(prefab);
                    this.showContent.addChild(node);
                    node.getComponent("RecordDataItem").updateShow(data);
                }
            });
        })
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
