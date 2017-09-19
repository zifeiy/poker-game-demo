var gameManager = new Object();

/**
判断牌组的类型：
-1: 不符合逻辑的牌
1: 单牌
2: 对子
3: 3张牌的炸弹
4: 4张牌的炸弹
5: 顺子
6: 大王小王炸
7: 红十炸
*/
gameManager.judgeType = function (cards) {
    cards.sort();
    if (cards == null || cards.length == 0) {
        return -1;
    }
    if (cards.length == 1) {
        return 1;
    }
    else if (cards.length == 2) {
        var x = cards[0];
        var y = cards[1];
        var xx = x % 100;
        var yy = y % 100;
        if (x == 210 && y == 410) {
            return 7;
        }
        else if (x == 114 && y == 214) {
            return 6;
        }
        else if (xx == yy) {
            return 2;
        }
        else {
            return -1;
        }
    }
    else if (cards.length == 3) {
        var x = cards[0] % 100;
        var y = cards[1] % 100;
        var z = cards[2] % 100;
        if (cards.indexOf(114) != -1 || cards.indexOf(214) != -1) {
            return -1;
        }
        else if (x + 1 == y && y + 1 == z || x == 1 && y == 12 && z == 13) {
            return 5;
        }
        else if (x == y && y == z) {
            return 3;
        }
        else {
            return -1;
        }
    }
    else if (cards.length == 4) {
        var a = cards[0] % 100;
        var b = cards[1] % 100;
        var c = cards[2] % 100;
        var d = cards[3] % 100;
        if (cards.indexOf(114) != -1 || cards.indexOf(214) != -1) {
            return -1;
        }
        else if (a + 1 == b && b + 1 == c && c + 1 == d || a == 1 && b == 11 && c == 12 && d == 13) {
            return 5;
        }
        else if (a == b && a == c && a == d) {
            return 4;
        }
        else {
            return -1;
        }
    }
    else if (cards.length == 14) {
        var arr = cards.map((x)=>{return x % 100;});
        var isShunZi = true;
        if (cards.indexOf(114) != -1 || cards.indexOf(214) != -1) {
            return -1;
        }
        else if (arr[0] == 1) {
            for (var i = 1; i < 14; i ++) {
                if (arr[i] != i) {
                    isShunZi = false;
                    break;
                }
            }
        }
        else {
            isShunZi = false;
        }
        if (isShunZi) {
            return 5;
        }
        else {
            return -1;
        }
    }
    else {
        if (cards.indexOf(114) != -1 || cards.indexOf(214) != -1) {
            return -1;
        }
        var arr1 = cards.map((x)=>{     // A 作为最大的牌
            var y = x % 100;
            if (y == 1) {
                y = 14;
            }
            return y;
        });
        arr1.sort();
        var isShunZi = true;
        for (var i = 1; i < arr1.length; i ++) {
            if (arr1[i] - arr1[i-1] != 1) {
                isShunZi = false;
                break;
            }
        }
        if (!isShunZi) {
            var arr2 = cards.map((x)=>{     // A 作为最小的牌
                var y = x % 100;
                return y;
            });
            arr2.sort();
            isShunZi = true;
            for (var i = 1; i < arr2.length; i ++) {
                if (arr2[i] - arr2[i-1] != 1) {
                    isShunZi = false;
                    break;
                }
            }
        }
        if (isShunZi) {
            return 5;
        }
        else {
            return -1;
        }
    }
};

/**
 * 判断newCards是否能跟oldCards
 * true: 能跟 
 * false: 不能跟 
*/
gameManager.checkCanFollow = function (oldCards, newCards) {
    var type1 = this.judgeType(oldCards);
    var type2 = this.judgeType(newCards);
    if (type1 == -1 || type2 == -1) {
        return false;
    }
    if (type1 == 1) {
        if (type2 == 1) {
            var x = oldCards[0];
            var y = newCards[0];
            var xx = x % 100;
            var yy = y % 100;
            if (x == 210 || x == 410) return false;
            if (y == 210 || y == 410) return true;
            if (x == 214) return false;
            if (y == 214) return true;
            if (x == 114) return false;
            if (y == 114) return true;
            if (xx == 2) return false;
            if (yy == 2) return true;
            if (xx == 1) return false;
            if (yy == 2) return true;
            return yy > xx;
        }
        else if ([3, 4, 6, 7].indexOf(type2) != -1) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type1 == 2) {
        if (type2 == 2) {
            var x = oldCards[0] % 100;
            var y = newCards[0] % 100;
            if (x == 2) return false;
            if (y == 2) return true;
            if (x == 1) return false;
            if (y == 1) return true;
            return y > x;
        }
        else if ([3, 4, 6, 7].indexOf(type2) != -1) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type1 == 3) {
        if (type2 == 3) {
            var x = oldCards[0] % 100;
            var y = newCards[0] % 100;
            if (x == 2) return false;
            if (y == 2) return true;
            if (x == 1) return false;
            if (y == 1) return true;
            return y > x;
        }
        else if ([4, 6, 7].indexOf(type2) != -1) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type1 == 4) {
        if (type2 == 4) {
            var x = oldCards[0] % 100;
            var y = newCards[0] % 100;
            if (x == 2) return false;
            if (y == 2) return true;
            if (x == 1) return false;
            if (y == 1) return true;
            return y > x;
        }
        else if ([6, 7].indexOf(type2) != -1) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type1 == 5) {
        if (type2 == 5) {
            if (oldCards.length != newCards.length) {
                return false;
            }
            else if (oldCards.length >= 13) {
                return false;
            }
            else {
                var arr1 = oldCards.map((x)=>{ return x % 100; });
                var arr2 = newCards.map((x)=>{ return x % 100; });
                if (arr1[0] == 1 && arr1[1] != 2) {
                    return false;
                }
                if (arr2[0] == 1 && arr2[1] != 2) {
                    return true;
                }
                return arr2[0] > arr1[0];
            }
        }
        else if ([3, 4, 6, 7].indexOf(type2) != -1) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (type1 == 6) {
        return type2 == 7;
    }
    else {
        return false;
    }
};

gameManager.getCardList = function (cards, type, len) {
    var resList = [];
    if (type == 1) {
        cards.sort(this.cardCmp);
        for (var i = 0; i < cards.length; i ++) {
            var tmpList = [cards[i]];
            resList.push(tmpList);
        }
    }
    else if (type == 2) {
        cards.sort(this.cardCmp);
        for (var i = 0; i < cards.length-1; i ++) {
            if (i == 0 || cards[i] % 100 != cards[i-1] % 100) {
                var x = cards[i];
                var y = cards[i+1];
                if (x % 100 == y % 100 && this.judgeType([x, y]) == 2) {
                    resList.push([x, y]);
                }
            }
        }
    }
    else if (type == 3) {
        cards.sort(this.cardCmp);
        for (var i = 0; i < cards.length-2; i ++) {
            if (i == 0 || cards[i] % 100 != cards[i-1] % 100) {
                var x = cards[i];
                var y = cards[i+1];
                var z = cards[i+2];
                if (x % 100 == y % 100 && x % 100 == z % 100 && this.judgeType([x, y, z]) == 3) {
                    resList.push([x, y, z]);
                }
            }
        }
    }
    else if (type == 4) {
        cards.sort(this.cardCmp);
        for (var i = 0; i < cards.length-3; i ++) {
            if (i == 0 || cards[i] % 100 != cards[i-1] % 100) {
                var a = cards[i];
                var b = cards[i+1];
                var c = cards[i+2];
                var d = cards[i+3];
                if (a % 100 == b % 100 && a % 100 == c % 100 && a % 100 == d % 100 && this.judgeType([a, b, c, d]) == 4) {
                    resList.push([a, b, c, d]);
                }
            }
        }
    }
    else if (type == 5) {
        if (len != null && len < 13) {
            var arr = [];
            for (var i = 0; i < 15; i ++) arr.push(null);
            for (var i = 0; i < cards.length; i ++) {
                var card = cards[i];
                if ([114, 214, 210, 410].indexOf(card) != -1) continue; // 这里的处理是:不会把红十放到 顺子 中
                var x = card % 100;
                if (arr[x] == null) {
                    arr[x] = card;
                }
            }
            arr[14] = arr[1];
            for (var i = 1; i+len-1 <= 14; i ++) {
                var canPush = true;
                for (var j = 0; j < len; j ++) {
                    if (arr[i+j] == null) {
                        canPush = false;
                        break;
                    }
                }
                if (canPush) {
                    var tmpList = [];
                    for (var j = 0; j < len; j++) {
                        tmpList.push(arr[i+j]);
                    }
                    resList.push(tmpList);
                }
            }
        }
    }
    else if (type == 6) {
        if (cards.indexOf(210) != -1 && cards.indexOf(410) != -1) {
            resList.push([210, 410]);
        }
    }
    return resList;
};

gameManager._getTipCardsByType = function (putCards, myCards, type) {
    var cardsList = this.getCardList(myCards, type, putCards.length);
    for (var i = 0; i < cardsList.length; i ++) {
        var cards = cardsList[i];
        if (this.checkCanFollow(putCards, cards)) {
            return cards;
        }
    }
    return null;
};

gameManager._getAllTipCardsByType = function (putCards, myCards, type) {
    var resList = [];
    var cardsList = this.getCardList(myCards, type, putCards.length);
    for (var i = 0; i < cardsList.length; i ++) {
        var cards = cardsList[i];
        if (this.checkCanFollow(putCards, cards)) {
            resList.push(cards);
        }
    }
    return resList;
};

gameManager.getTipCards = function (putCards, myCards) {
    var type = this.judgeType(putCards);
    if (type == -1) {
        return [];
    }
    else if (type == 1) {
        var res;
        res = this._getTipCardsByType(putCards, myCards, 1);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 3);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 4);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 6);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 7);
        if (res != null) return res;
    }
    else if (type == 2) {
        var res;
        res = this._getTipCardsByType(putCards, myCards, 2);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 3);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 4);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 6);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 7);
        if (res != null) return res;
    }
    else if (type == 3) {
        var res;
        res = this._getTipCardsByType(putCards, myCards, 3);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 4);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 6);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 7);
        if (res != null) return res;
    }
    else if (type == 4) {
        var res;
        res = this._getTipCardsByType(putCards, myCards, 4);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 6);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 7);
        if (res != null) return res;
    }
    else if (type == 5) {
        var res;
        res = this._getTipCardsByType(putCards, myCards, 5);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 3);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 4);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 6);
        if (res != null) return res;
        res = this._getTipCardsByType(putCards, myCards, 7);
        if (res != null) return res;
    }
    else if (type == 6) {
        var res;
        res = this._getTipCardsByType(putCards, myCards, 7);
        if (res != null) return res;
    }
    return [];
};

gameManager.getAllTipCards = function (putCards, myCards) {
    var type = this.judgeType(putCards);
    var resList = [];
    if (type == -1) {
        return [];
    }
    else if (type == 1) {
        var res;
        res = this._getAllTipCardsByType(putCards, myCards, 1);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 3);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 4);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 6);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 7);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
    }
    else if (type == 2) {
        var res;
        res = this._getAllTipCardsByType(putCards, myCards, 2);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 3);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 4);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 6);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 7);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
    }
    else if (type == 3) {
        var res;
        res = this._getAllTipCardsByType(putCards, myCards, 3);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 4);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 6);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 7);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
    }
    else if (type == 4) {
        var res;
        res = this._getAllTipCardsByType(putCards, myCards, 4);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 6);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 7);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
    }
    else if (type == 5) {
        var res;
        res = this._getAllTipCardsByType(putCards, myCards, 5);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 3);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 4);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 6);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
        res = this._getAllTipCardsByType(putCards, myCards, 7);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
    }
    else if (type == 6) {
        var res;
        res = this._getAllTipCardsByType(putCards, myCards, 7);
        if (res != null) res.forEach((r)=>{ resList.push(r); });
    }
    return resList;
};

gameManager.cardCmp = function (x, y) {      // 从小到达排序
    var xx = x % 100;
    var yy = y % 100;
    if (y == 210 || y == 410) return -1;
    if (x == 210 || x == 410) return 1;
    if (y == 214) return -1;
    if (x == 214) return 1;
    if (y == 114) return -1;
    if (x == 114) return 1;
    if (yy == 2) return -1;
    if (xx == 2) return 1;
    if (yy == 1) return -1;
    if (xx == 1) return 1;
    if (xx == yy) {
        return x - y;   // return x -y; 则为 黑桃在红桃左边
    }
    return xx - yy;
},


gameManager.test = function (cards) {
    console.log('cards: ' + JSON.stringify(cards));
    var res = this.judgeType(cards);
    if (res == -1) {
        console.log("不符合规则的牌：" + res);
    }
    else {
        console.log(["1: 单牌", "2: 对子", "3: 3张牌的炸弹", "4: 4张牌的炸弹", "5: 顺子", "6: 大王小王炸", "7: 红十炸"][res-1]);
    }
};

gameManager.test2 = function () {
    var myCards = [];
    for (var i = 1; i <= 4; i ++) {
        var len = 13;
        if (i <= 2) len = 14;
        for (var j = 1; j <= len; j ++) {
            var num = i * 100 + j;
            var flag = (Math.random() < 0.3);
            if (flag) {
                myCards.push(num);
            }
        }
    }
    var putCards = [103];
    // var putCards = [101, 202, 303, 404, 205];
    // var putCards = [103, 203, 303];
    // var putCards = [101, 201, 301, 401];
    console.log('putCard type = ' + gameManager.judgeType(putCards));
    var res = this.getTipCards(putCards, myCards);
    console.log('-------------------------------');
    console.log('myCards: ' + JSON.stringify(myCards));
    console.log('putCards: ' + JSON.stringify(putCards));
    console.log('shouldPut: ' + JSON.stringify(res));
    console.log('--------------\n所有方案:');
    var resList = this.getAllTipCards(putCards, myCards);
    var iidx = 0;
    resList.forEach((res)=>{
        iidx ++;
        console.log('\t方案' + iidx + ": " + JSON.stringify(res));
    });
    console.log('-------------------------------\n\n\n');
};

module.exports = gameManager;

// setInterval(()=>{
//     gameManager.test2();
// }, 1000);

// // test main
// var args = process.argv;
// var cards = [];
// for (var i = 2; i < args.length; i ++) {
//     cards.push(parseInt(args[i]));
// }
// gameManager.test(cards);
