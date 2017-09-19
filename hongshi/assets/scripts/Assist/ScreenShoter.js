var ScreenShoter = new Object();

ScreenShoter.screenShot = function (callback) {
    cc.log('pibpib: ' + cc.sys.isNative);
    if (!cc.sys.isNative) {
        callback(null);
        return;
    }
    let dirpath = jsb.fileUtils.getWritablePath() + 'ScreenShoot/';
    if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
        jsb.fileUtils.createDirectory(dirpath);
    }
    let name = 'ScreenShoot-' + (new Date()).valueOf() + '.png';
    let filepath = dirpath + name;
    let size = cc.winSize;
    let rt = cc.RenderTexture.create(size.width, size.height);
    cc.director.getScene()._sgNode.addChild(rt);
    rt.setVisible(false);
    rt.begin();
    cc.director.getScene()._sgNode.visit();
    rt.end();
    rt.saveToFile('ScreenShoot/' + name, cc.IMAGE_FORMAT_PNG, function() {
        cc.log('save succ');
        rt.removeFromParent();
        if (callback) {
            callback(filepath);
        }
    });
}

module.exports = ScreenShoter;