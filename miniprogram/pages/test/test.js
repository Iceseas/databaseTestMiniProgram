let app = getApp();


Page({
    /**
     * 页面的初始数据
     */
    data: {
        center_box_top: null,
        tab_width: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            center_box_top: app.globalData.SystemWindowHeight
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    godetail() {
        wx.navigateTo({
            url: '../detail/detail',
            success: (result) => {
                // console.log(result)
            },
            fail: (err) => {
                console.log(err)
            },
            complete: () => {}
        });
    }
})