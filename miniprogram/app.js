﻿//app.js
App({
    onLaunch: function() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'nodetestminicloud-e53ge',
                traceUser: true,
            })
        }
        // 获取用户信息
        wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                this.globalData.userInfo = res.userInfo,
                                    this.globalData.isgetSetting = true
                            }
                        })
                    }
                },
                fail: () => {
                    console.log('获取权限失败')
                }
            }),
            wx.getSystemInfo({
                success: (result) => {
                    this.globalData.SystemWindowHeight = (result.windowHeight)
                },
                fail: () => {},
                complete: () => {}
            });
    },
    globalData: {
        userInfo: null,
        isgetSetting: true,
        questionType: 'c1',
        answerArray: [],
        questionAnswerArray: [],
        vacancyArr: [],
        notevacancyArr: [],
        getlist: [],
        TestType: '',
        questionGetNum: 20,
        CollectionArray: [],
        islogin: true,
        SystemWindowHeight: null,
        nowOnlineUserClass: '',
        nowOnlineUserID: '',
        nowOnlineUserName: '',
        // 现在登陆的用户账户
        nowOnlineDiscount: '',
        nowMaxQuestionSum: 20,
        finalGradeArry: [],
        finalGrade: 0
    }
})