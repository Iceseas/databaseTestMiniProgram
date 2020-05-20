//Page Object
const db = wx.cloud.database() //操作数据库
let app = getApp();
const _ = db.command; //操作数据库
Page({
    data: {
        activeNames: '1',
        gradelist: []
    },
    //options(Object)
    onLoad: function(options) {
        let that = this
        db.collection('subjective_publish_models').where({
                stuID: app.globalData.nowOnlineUserID
            }).get()
            .then(res => {
                console.log(res)
                that.setData({
                    gradelist: res.data
                })
                console.log(this.data.gradelist)
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
    onChange(event) {
        console.log(event.detail)
        this.setData({
            activeNames: event.detail
        });
    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    onPageScroll: function() {

    },
    //item(index,pagePath,text)
    onTabItemTap: function(item) {

    },
});