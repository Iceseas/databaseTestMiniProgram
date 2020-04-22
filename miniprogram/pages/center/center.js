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
        dialogshow: false
    },
    onLoad: function(options) {
        getUser(db, 'mini_users_models', options, 'get')
            .then(res => {
                console.log('center', res)
                if (res.error != 0) {
                    // this.hideTabBar()
                    // Dialog.confirm({
                    //     title: '登录状态有误',
                    //     message: '请重新登录！',
                    //     showCancelButton: false
                    // }).then(() => {
                    //     // on confirm
                    //     relaunch('res')
                    // })
                } else {
                    this.showTabBar()
                    app.globalData.nowOnlineUser = res.data.data[0].countName
                    app.globalData.nowOnlineUserClass = res.data.data[0].major
                    app.globalData.nowOnlineUserID = res.data.data[0].stuID
                    app.globalData.nowOnlineUserName = res.data.data[0].name
                    this.setData({
                        user_img: res.data.data[0].img,
                        user_name: res.data.data[0].name,
                        user_major: res.data.data[0].major
                    })

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
            app.globalData.nowOnlineUser = '';
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
        relaunch('subjectivegrade')
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
    }
})