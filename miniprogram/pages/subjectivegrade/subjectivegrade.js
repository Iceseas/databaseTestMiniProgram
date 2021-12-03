//Page Object
let app = getApp();
import { questionApi } from '../../api/api'
Page({
    data: {
        activeNames: '1',
        gradelist: []
    },
    onLoad: function(options) {
        questionApi.subGetData({
            stuID: app.globalData.nowOnlineUserID
        })
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
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
    onClickLeft() {
        wx.switchTab({
            url: '../center/center'
        })
    },
});