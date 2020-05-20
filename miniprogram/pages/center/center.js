// pages/find/find.js
let app = getApp();

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import relaunch from '../../packaging/wxRelaunch.js'
import getUser from '../../packaging/getuser.js'
const db = wx.cloud.database() //操作数据库
Page({

    /**
     * 页面的初始数据
     */
    data: {
        center_box_top: 0,
        user_major: '',
        user_name: '',
        user_img: '',
        dialogshow: false,
        isCalendarOpen: false,
        actions: [{
            name: '查看大图',
            operation: 'showImg'
        }],
        ImgOptionsshow: false,
        cloudUserImgFile: '',
        formatter(day) {
            const month = day.date.getMonth() + 1;
            const date = day.date.getDate();
            if (month === 5) {
                if (date === 1) {
                    day.text = '劳动节';
                }
            }
            return day;
        },
    },
    onLoad: function(options) {
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        let checkUserData
        if (options.countName) {
            checkUserData = options
        } else {
            checkUserData = new Object()
            checkUserData.countName = app.globalData.nowOnlineUser
        }
        getUser(db, 'mini_users_models', checkUserData, 'get')
            .then(res => {
                console.log('center', res)
                if (res.error != 0) {
                    wx.hideLoading()
                    this.hideTabBar()
                    Dialog.confirm({
                        title: '登录状态有误',
                        message: '请重新登录！',
                        showCancelButton: false
                    }).then(() => {
                        // on confirm
                        relaunch('res')
                    })
                } else {
                    this.showTabBar()
                    app.globalData.nowOnlineUser = res.data.data[0].countName
                    app.globalData.nowOnlineUserClass = res.data.data[0].major
                    app.globalData.nowOnlineUserID = res.data.data[0].stuID
                    app.globalData.nowOnlineUserName = res.data.data[0].name
                    wx.cloud.downloadFile({
                        fileID: res.data.data[0].img,
                        success: res => {
                            console.log(res)
                            that.setData({
                                user_img: res.tempFilePath
                            })
                        }
                    })
                    this.setData({
                        cloudUserImgFile: res.data.data[0].img,
                        user_name: res.data.data[0].name,
                        user_major: res.data.data[0].major
                    })
                    wx.hideLoading()
                }


            })
            .catch(err => {
                console.log('err', err)
            })
    },
    onShow: function() {
        wx.showTabBar({
            animation: false,
            success: function(res) {
                console.log(res)
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    handleUserQuit() {
        Dialog.confirm({
            title: '退出',
            message: '您确定要退出吗？'
        }).then(() => {
            // on confirm
            app.globalData.nowOnlineUser = ''
            app.globalData.nowOnlineUserClass = ''
            app.globalData.nowOnlineUserID = ''
            app.globalData.nowOnlineUserName = ''
            relaunch('res')
            wx.showToast({
                title: '您已退出！',
                duration: 1000,
                icon: 'success'
            })
        }).catch(() => {
            // on cancel

        });
    },
    shareToFriend() {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    hideTabBar() {
        wx.hideTabBar({
            animation: false,
            success: function(res) {
                console.log(res)
            }

        })
    },
    goToSubjectiveGrade() {
        wx.navigateTo({
            url: '../subjectivegrade/subjectivegrade',
            success: function(res) {
                console.log(res)
            }
        })
    },
    showTabBar() {
        wx.showTabBar({
            animation: false,
            success: function(res) {
                console.log(res)
            }
        })
    },
    onUnload: function() {
        app.globalData.nowOnlineUser = ''
    },
    OpenClendar() {
        this.setData({
            isCalendarOpen: true
        })
    },
    oncalendarClose() {
        this.setData({
            isCalendarOpen: false
        })
    },
    oncalendarConfirm(event) {
        console.log(this.formatDate(event.detail))
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
                    console.log(res)
                    let imgarr = [res.tempFilePath]
                    wx.previewImage({
                        current: '', // 当前显示图片的http链接0
                        urls: imgarr // 需要预览的图片http链接列表
                    })
                },
                fail: err => {
                    console.log(err)
                }
            })

        }
    }
})