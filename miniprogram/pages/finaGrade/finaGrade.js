let app = getApp();
//Page Object
Page({
    data: {
        grade: 0,
        final_height: null,
    },
    //options(Object)
    onLoad: function(options) {


    },
    onReady: function() {

    },
    onShow: function() {
        this.setData({
            final_height: app.globalData.SystemWindowHeight,
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
        console.log('111')
        wx.switchTab({
            url: '../test/test',
            success: function(res) {
                console.log(res)
            },
            fail: function(err) {
                console.log(err)
            }
        })
    }
});