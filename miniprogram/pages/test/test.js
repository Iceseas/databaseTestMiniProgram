let app = getApp();


Page({
    /**
     * 页面的初始数据
     */
    data: {
        center_box_top: null,
        tab_width: null,
        show: false,
        actions: [{
                name: '单项选择',
                questionType: 'single_models'
            },
            {
                name: '判断题',
                questionType: 'decide_models'
            },
            {
                name: '填空题',
                questionType: 'vacancy_C1_models'
            },
            // {
            //     name: '应用题',
            // }
        ],
        SelectQuestionType: ''
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
    gotoOnlineTest() {
        wx.navigateTo({
            url: '../onlineTest/onlineTest',
            success: (result) => {
                // console.log(result)
            },
            fail: (err) => {
                console.log(err)
            },
            complete: () => {}
        });
    },
    checkspecialItem() {
        this.setData({
            show: true
        })
    },
    onClose() {
        this.setData({ show: false });
    },

    onSelect(event) {
        this.setData({
            SelectQuestionType: event.detail.questionType
        })
        wx.navigateTo({
            url: '../detail/detail',
            success: (result) => {
                result.eventChannel.emit('ToDetailData', { Type: this.data.SelectQuestionType })
            },
            fail: (err) => {
                console.log(err)
            },
            complete: () => {}
        });
    }
})