var nativeLoader = new Object();
var hongshi = require('hongshi');

nativeLoader.loadNative = function(id, url, callback){
    // 添加这段代码，方便浏览器端测试
    if (cc.sys.isBrowser) {
        callback(null);
        return;
    }

    var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
    // var filepath = dirpath + MD5(url) + '.png';
    var filepath = dirpath + id + '.png';

    function loadEnd(){
        cc.loader.load(filepath, function(err, tex){
            if( err ){
                cc.error(err);
            }else{
                var spriteFrame = new cc.SpriteFrame(tex);
                if( spriteFrame ){
                    spriteFrame.retain();
                    callback(spriteFrame);
                }
            }
        });

    }

    if( jsb.fileUtils.isFileExist(filepath) ){
        cc.log('Remote is find' + filepath);
        loadEnd();
        return;
    }

    var saveFile = function(data){
        cc.log('save file: ' + data);
        if( typeof data !== 'undefined' ){
            if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                jsb.fileUtils.createDirectory(dirpath);
            }

            if( jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , filepath) ){
                cc.log('Remote write file succeed.');
                loadEnd();
            }else{
                cc.log('Remote write file failed.');
            }
        }else{
            cc.log('Remote download file failed.');
        }
    };
    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState  " +xhr.readyState);
        cc.log("xhr.status  " +xhr.status);
        if (xhr.readyState === 4 ) {
            if(xhr.status === 200){
                xhr.responseType = 'arraybuffer';
                saveFile(xhr.response);
            }else{
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
};

nativeLoader.loadNativeWithCallbackFilePath = function(id, url, callback){
    // 添加这段代码，方便浏览器端测试
    if (cc.sys.isBrowser) {
        callback(null);
        return;
    }

    var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
    // var filepath = dirpath + MD5(url) + '.png';
    var filepath = dirpath + id + '.png';

    function loadEnd(){
        callback(filepath);
    }

    if( jsb.fileUtils.isFileExist(filepath) ){
        cc.log('Remote is find' + filepath);
        loadEnd();
        return;
    }

    var saveFile = function(data){
        cc.log('save file: ' + data);
        if( typeof data !== 'undefined' ){
            if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                jsb.fileUtils.createDirectory(dirpath);
            }

            if( jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , filepath) ){
                cc.log('Remote write file succeed.');
                loadEnd();
            }else{
                cc.log('Remote write file failed.');
            }
        }else{
            cc.log('Remote download file failed.');
        }
    };
    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState  " +xhr.readyState);
        cc.log("xhr.status  " +xhr.status);
        if (xhr.readyState === 4 ) {
            if(xhr.status === 200){
                xhr.responseType = 'arraybuffer';
                saveFile(xhr.response);
            }else{
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
};

module.exports = nativeLoader;

