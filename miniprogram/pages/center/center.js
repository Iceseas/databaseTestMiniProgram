// pages/find/find.js
let app = getApp();

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
        user_img: ''
    },
    onLoad: function(options) {
        console.log('options:', options)
        getUser(db, 'mini_users_models', options, 'get')
            .then(res => {
                console.log('center', res)
                this.setData({
                    user_name: res.data[0].name,
                    user_major: res.data[0].major
                })
            })
            .catch(err => {
                console.log(err)
            })
        wx.cloud.downloadFile({
            fileID: options.fileID
        }).then(res => {
            // get temp file path
            console.log(res.tempFilePath)
            this.setData({
                user_img: res.tempFilePath
            })
        }).catch(error => {
            // handle error
        })
    },
    onShow: function() {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    onPageScroll: function(e) {
        // 页面滚动时执行
        console.log(e)
        this.setData({
            center_box_top: 0
        })
    },
    downloadFile() {
        wx.cloud.downloadFile({
            fileID: res.data[0].img
        }).then(res => {
            // get temp file path
            console.log('download', res.tempFilePath)
            this.setData({
                user_img: res.tempFilePath,
            })
        })
    }
})