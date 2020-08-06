let app = getApp();
//Page Object
Page({
    data: {
        grade: 0,
    },
    //options(Object)
    onLoad: function(options) {


    },
    onReady: function() {

    },
    onShow: function() {
        this.setData({
            grade: app.globalData.finalGrade
        })
    },
    onHide: function() {

    },
    onUnload: function() {
        app.globalData.finalGrade = 0
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

    },
    backToTest() {
        wx.switchTab({
            url: '../test/test'
        })
    }
});