// pages/find/find.js
let app = getApp();

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import relaunch from '../../packaging/wxRelaunch.js'
import getUser from '../../packaging/getuser.js'
import getuserSignIndata from '../../packaging/getuserSignIndata.js'


const db = wx.cloud.database() //操作数据库
Page({
    /**
     * 页面的初始数据
     */
    data: {
        usergradedata: [],
        center_box_top: 0,
        thismonthFirstDay: null,
        day_magin_left: null,
        user_major: '',
        user_name: '',
        user_img: '',
        isrecordshow: false,
        dialogshow: false,
        isSignInShow: false,
        actions: [{
            name: '查看大图',
            operation: 'showImg'
        }],
        ImgOptionsshow: false,
        cloudUserImgFile: '',
        isSignInNum: []
    },
    onLoad: function(options) {
        let date = new Date()
        date = new Date(date.setDate(1))
        this.setData({
            thismonthFirstDay: date.getDay()
        })
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        that.handleSignInMonthOneDay()
        let checkUserData
        if (options.countName) {
            checkUserData = new Object()
            checkUserData.countName = options.countName
            checkUserData.stuID = options.stuID
        } else {
            checkUserData = new Object()
            checkUserData.countName = app.globalData.nowOnlineUser
            checkUserData.stuID = app.globalData.nowOnlineUserID
        }
        getUser(db, 'mini_users_models', checkUserData, 'get')
            .then(res => {
                if (res.error != 0) {
                    wx.hideLoading()
                    this.hideTabBar()
                    Dialog.confirm({
                        title: '登录状态有误',
                        message: '请重新登录！',
                        showCancelButton: false
                    }).then(() => {
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
            .catch(err => {})
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
        }).catch(() => {});
    },
    shareToFriend() {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    hideTabBar() {
        wx.hideTabBar({
            animation: false,
            success: function(res) {}
        })
    },
    goToSubjectiveGrade() {
        wx.navigateTo({
            url: '../subjectivegrade/subjectivegrade',
            success: function(res) {}
        })
    },
    showTabBar() {
        wx.showTabBar({
            animation: false,
            success: function(res) {}
        })
    },
    onUnload: function() {
        app.globalData.nowOnlineUser = ''
    },
    OpenSignIn() {
        wx.showLoading({
            title: '加载中',
        })
        db.collection('signIn_model').where({ stuID: app.globalData.nowOnlineUserID }).get()
            .then(res => {
                let signIndate = []
                for (let i = 0; i < res.data[0].signInCollection.length; i++) {
                    signIndate.push(res.data[0].signInCollection[i].substring(1, 2))
                }
                this.setData({
                    isSignInNum: signIndate
                })
                wx.hideLoading()
            })
            .catch(err => {
                console.log(err)
            })
        this.setData({
            isSignInShow: true
        })
    },
    onSignInClose() {
        this.setData({
            isSignInShow: false
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
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        getuserSignIndata('user_grade_data', app.globalData.nowOnlineUserID)
            .then(res => {
                that.setData({
                    usergradedata: res.data[0].grade
                })
                wx.hideLoading()
                this.setData({ isrecordshow: true });
            })
            .catch(err => {
                wx.hideLoading()
                this.setData({ isrecordshow: true });
            })
    },
    handleSignInMonthOneDay() {
        if (this.data.thismonthFirstDay == 7) {
            this.setData({
                thismonthFirstDay: 0
            })
        }
        this.setData({
            day_magin_left: (this.data.thismonthFirstDay * 14.25) + "%"
        })
    },
    signInAjax() {
        wx.showLoading({
            title: '签到中',
        })
        let date = new Date()
        let nowDate = (date.getMonth() + 1).toString() + (date.getDate()).toString()
        wx.request({
            url: 'http://localhost:3000/signIn/api/saveSignInData',
            data: {
                date: (date.getMonth() + 1).toString() + (date.getDate()).toString(),
                stuID: app.globalData.nowOnlineUserID
            },
            method: 'POST',
            success: (result) => {
                wx.hideLoading()
                if (nowDate == result.date) {
                    wx.showToast({
                        title: '签到成功',
                        duration: 1000,
                        icon: 'success'
                    })
                }
            },
        });
    },
    signInSave() {
        let signInObj = {
            signInCollection: [],
            stuID: app.globalData.nowOnlineUserID,
            stuName: app.globalData.nowOnlineUserName
        }
        db.collection('signIn_model').where({
            stuID: app.globalData.nowOnlineUserID
        }).get().then(res => {
            if (res.data.length > 0) {
                this.signInAjax()
            } else {
                db.collection('signIn_model').add({
                    data: signInObj
                }).then(res => {

                }).catch(err => {

                })
            }
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },
    consleDay(e) {
        console.log(e.currentTarget.dataset.id)
    }
})