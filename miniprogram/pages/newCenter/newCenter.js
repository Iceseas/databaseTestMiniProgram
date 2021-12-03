// pages/find/find.js
let app = getApp();

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

import { userMessageApi } from '../../api/api'
/**
 * title 显示的内容
 * duration  显示的时间
 */
import { okMsg, errMsg, noIconMsg } from '../../utils/showMsg'

const db = wx.cloud.database() //操作数据库
Page({
    /**
     * 页面的初始数据
     */
    data: {
        day_magin_left: null,
        user_major: '',
        user_name: '',
        user_img: '',
        // 控制退出的dialog
        isrecordshow: false,
        // 控制签到的dialog
        isSignInShow: false,
        // 点击头像出现的选项
        actions: [{
            name: '查看大图',
            operation: 'showImg'
        }],
        ImgOptionsshow: false,
        cloudUserImgFile: '',
        isSignInNum: []
    },
    onLoad: function(options) {
      let that = this;
      userMessageApi.findData({
        discount: app.globalData.nowOnlineDiscount
      })
      .then((res)=>{
        that.setData({
            user_major : res.data.data[0].major,
            user_name : res.data.data[0].userName
        })
        app.globalData.nowOnlineUserClass = res.data.data[0].userClass;
        app.globalData.nowOnlineUserID = res.data.data[0].stuID;
        app.globalData.nowOnlineUserName = res.data.data[0].userName;
      })
      .catch((err)=>{
        console.log(err)
      })
    },
    onShow: function() {
        wx.showTabBar({
            animation: false,
            success: function(res) {}
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},
    // 退出的dialog
    handleUserQuit() {
        Dialog.confirm({
            title: '退出',
            message: '您确定要退出吗？'
        }).then(() => {
            // on confirm

            wx.showToast({
                title: '您已退出！',
                duration: 1000,
                icon: 'success'
            })
        }).catch(() => {});
    },
    // 分享
    shareToFriend() {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    // 控制tabbar隐藏
    hideTabBar() {
        wx.hideTabBar({
            animation: false,
            success: function(res) {}
        })
    },
    // 查看主观题
    goToSubjectiveGrade() {
        wx.navigateTo({
            url: '../subjectivegrade/subjectivegrade',
            success: function(res) {}
        })
    },
    // 显示tabbar
    showTabBar() {
        wx.showTabBar({
            animation: false,
            success: function(res) {}
        })
    },
    onUnload: function() {

    },
    // 关闭签到
    onSignInClose() {
        this.setData({
            isSignInShow: false
        })
    },
    // 点击日历
    oncalendarConfirm(event) {
        console.log(this.formatDate(event.detail))
    },
    // 打开签到
    OpenSignIn() {
      wx.showLoading({
          title: '加载中',
      })
      this.setData({
          isSignInShow: true
      })
      wx.hideLoading();
  },
    formatDate(date) {
        date = new Date(date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    checkImgOptions() {
        this.setData({
            ImgOptionsshow: true
        })
    },
    onImgOptionsClose() {
        this.setData({ ImgOptionsshow: false });
    },
    onImgOptionsSelect(event) {
        if (event.detail.operation == 'showImg') {
            wx.cloud.downloadFile({
                fileID: this.data.cloudUserImgFile,
                success: res => {
                    let imgarr = [res.tempFilePath]
                    wx.previewImage({
                        current: '', // 当前显示图片的http链接0
                        urls: imgarr // 需要预览的图片http链接列表
                    })
                },
                fail: err => {}
            })
        }
    },
    onClose() {
        this.setData({ isrecordshow: false });
    },
    showGrade() {
      console.log('查看记录');
    },
    signInSave() {
        console.log('签到');
    },
    consleDay(e) {
        console.log(e.currentTarget.dataset.id)
    }
})