//Page Object
const db = wx.cloud.database() //操作数据库
let app = getApp();
const _ = db.command; //操作数据库
Page({
    data: {

    },
    //options(Object)
    onLoad: function(options) {
        db.collection('subjective_modified_models').where({
                stuID: app.globalData.nowOnlineUserID
            }).get()
            .then(res => {
                console.log(res)
            })
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    onPageScroll: function() {

    },
    //item(index,pagePath,text)
    onTabItemTap: function(item) {

    }
});