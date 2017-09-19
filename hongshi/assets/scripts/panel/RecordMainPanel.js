var netEngine = require('netEngine');
var hongshi = require('hongshi');

cc.Class({
    extends: cc.Component,

    properties: {
        selectItems: [cc.Node],
        showNodes: [cc.Node],
        showContents: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        this.selectItems.forEach((node)=>{
            node.getComponent("ShopSelectedItem").shopPanel = this;
        });

        this.onClickSelect(0);

        netEngine.send('getRecord', {}, (data)=>{
            var recordList = [];
            if (data == null) {
                hongshi.recordList = [];
            }
            else {
                data.results.forEach((result)=>{
                    result.data = JSON.parse(result.data);
                    recordList.push(result);
                });
                hongshi.recordList = recordList;
            }

            var needIds = [];
            hongshi.recordList.forEach((record)=>{
                if (needIds.indexOf(record.id1) == -1) needIds.push(record.id1);
                if (needIds.indexOf(record.id2) == -1) needIds.push(record.id2);
                if (needIds.indexOf(record.id3) == -1) needIds.push(record.id3);
                if (needIds.indexOf(record.id4) == -1) needIds.push(record.id4);
            });

            var idGetCount = 0;
            needIds.forEach((id)=>{
                if (hongshi.playersInfo[id] == null) {
                    netEngine.send('getPlayerInfo', {id: id}, (data)=>{
                        hongshi.playersInfo[id] = data;
                        idGetCount ++;
                        if (idGetCount >= needIds.length) {
                            this.afterGetPlayerInfoToShowRecord();
                        }
                    });
                }
                else {
                    idGetCount ++;
                    if (idGetCount >= needIds.length) {
                        this.afterGetPlayerInfoToShowRecord();
                    }
                }
            });

        });
    },

    afterGetPlayerInfoToShowRecord: function () {
        // cc.log('lululi: ' + JSON.stringify(hongshi.recordList));
        if (hongshi.recordList == null || hongshi.recordList.length == 0) {
            return;
        }
        var recordData = [[], [], [], []];
        for (var i = 0; i < hongshi.recordList.length; i ++) {

            var dateValue = hongshi.recordList[i].data.date;
            var theDate = new Date(dateValue);
            var dateString = theDate.getFullYear() + '-' + (theDate.getMonth()+1) + '-' + theDate.getDate() + '  ' + theDate.getHours() + ':';
            if (theDate.getMinutes() < 10) {
                dateString += '0' + theDate.getMinutes();
            }
            else {
                dateString += theDate.getMinutes();
            }

            var data = {
                recordId: i,
                id: i + 1,
                roomId: hongshi.recordList[i].roomId,
                date: dateString,
                players: [
                    {name: hongshi.playersInfo[ hongshi.recordList[i].id1 ].name, point: hongshi.recordList[i].data.pointRecords[i][0]},
                    {name: hongshi.playersInfo[ hongshi.recordList[i].id2 ].name, point: hongshi.recordList[i].data.pointRecords[i][1]},
                    {name: hongshi.playersInfo[ hongshi.recordList[i].id3 ].name, point: hongshi.recordList[i].data.pointRecords[i][2]},
                    {name: hongshi.playersInfo[ hongshi.recordList[i].id4 ].name, point: hongshi.recordList[i].data.pointRecords[i][3]}
                ],
                data: hongshi.recordList[i].data
            };
            recordData[0].push(data);
        }
        this.showRecord(recordData);
    },

    showRecord: function (recordData) {
        for (var i = 0; i < this.showContents.length; i ++) {
            this.showRecordForOne(i, recordData[i]);
        }
    },

    showRecordForOne: function (idx, dataList) {
        var contentNode = this.showContents[idx];

        dataList.forEach((data)=>{
            cc.loader.loadRes("item/RecordMainItem", (err, prefab)=>{
                if (!err) {
                    var node = cc.instantiate(prefab);
                    node.getComponent("RecordMainItem").updateInfo(data);
                    contentNode.addChild(node);
                }
            });
        });
    },

    onClickSelect: function (idx) {
        for (var i = 0; i < this.selectItems.length; i ++) {
            var clicked = (i == idx);
            this.selectItems[i].getComponent("ShopSelectedItem").updateShow(clicked);
        }
        for (var i = 0; i < this.showNodes.length; i ++) {
            var clicked = (i == idx);
            this.showNodes[i].active = (i == idx);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
