import wxRelaunch from '../../packaging/wxRelaunch'
import resUser from '../../packaging/resUser.js'
import verifyUserCount from '../../packaging/verifyUserCount.js'
import showToast from '../../packaging/showToast.js'




const db = wx.cloud.database() //操作数据库
let countName = 'userMessage.countName'
let password = 'userMessage.password'
let major = 'userMessage.major'
let name = 'userMessage.name'
let image = 'userMessage.img'
let stuID = 'userMessage.stuID'
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3959542671,3569689889&fm=26&gp=0.jpg',
        login: '登录',
        navigationText_title: "登录",
        ishaventip: '没有帐号？',
        loginorretip: '注册',
        isloginres: null,
        userimg: false,
        fileList: [],
        isCountNameverify: false,
        isPasswordverify: false,
        isMajorverify: false,
        isNameverify: false,
        isStuIDverify: false,
        isloginOrRes_button: 'gotocenter',
        userMessage: {
            name: '',
            password: '',
            img: '',
            major: '',
            countName: '',
            stuID: ''
        },
        fileID: ''
    },
    onLoad: function(options) {
        this.setData({
            isloginres: app.globalData.islogin
        })
    },
    onShow: function() {
        wx.getSystemInfo({
            success: (result) => {
                console.log(result)
                this.setData({
                    reslogin_height: (result.windowHeight) * 2
                })
            },
            fail: () => {},
            complete: () => {}
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    onPageScroll: function(e) {

    },
    swichisloginres() {
        app.globalData.islogin = !app.globalData.islogin
        if (app.globalData.islogin) {
            this.setData({
                login: '登录',
                navigationText_title: "登录",
                ishaventip: '没有帐号？',
                loginorretip: '注册',
                isloginres: app.globalData.islogin,
                isloginOrRes_button: 'gotocenter'
            })
        } else {
            this.setData({
                login: '注册',
                navigationText_title: "注册",
                ishaventip: '已有帐号？',
                loginorretip: '登录',
                isloginres: app.globalData.islogin,
                isloginOrRes_button: 'res_user_count',
                isNameverify: false,
                isCountNameverify: false,
                isPasswordverify: false,
                isMajorverify: false
            })
        }
    },
    gotocenter() {
        wx.showLoading({
            title: '验证中',
        })
        verifyUserCount(db, 'mini_users_models', { countName: this.data.userMessage.countName, password: this.data.userMessage.password })
            .then(res => {
                wx.hideLoading()
                console.log('res.jsres', res)
                if (res.error == 0) {
                    showToast(res.msg, 1000, 'success')
                    wxRelaunch('center', { countName: this.data.userMessage.countName })
                }
            })
            .catch(err => {
                console.log('reserr', err)
                if (err.error) {
                    showToast(err.msg, 1000, 'none')
                } else {
                    showToast(err.res.userexist, 1000, 'none')
                }
            })

    },
    // 上传图片
    uploaderimage() {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                that.setData({
                    user_image: res.tempFilePaths,
                    userimg: true
                })
            }
        })

    },
    res_user_count() {
        if (this.data.isNameverify && this.data.isCountNameverify && this.data.isPasswordverify && this.data.isMajorverify && this.data.isStuIDverify) {
            this.uploaderToCloudimage()
                .then((res) => {
                    console.log('consoleUser', this.data.userMessage)
                    console.log('consoleUser', res)
                    resUser('mini_users_models', this.data.userMessage)
                        .then(res => {
                            console.log('res', res)
                            if (res.errMsg == 'collection.add:ok') {
                                wx.showToast({
                                    title: '注册成功！',
                                    duration: 2000,
                                    icon: 'success'
                                })
                                this.swichisloginres()
                            } else {
                                wx.showToast({
                                    title: err.msg,
                                    duration: 2000,
                                    icon: 'none'
                                })
                            }
                        })
                        .catch(err => {
                            wx.showToast({
                                title: err.msg,
                                duration: 2000,
                                icon: 'none'
                            })
                        })
                })
        } else {
            wx.showToast({
                title: '请填写好信息',
                duration: 2000,
                icon: 'none'
            })
        }
    },
    getCountName(e) {
        //console.log(e)
        console.log(e)
        if (e.detail.value != '') {
            this.setData({
                [countName]: e.detail.value,
                isCountNameverify: true
            })
        }
    },
    getPassword(e) {
        //console.log(e)
        if (e.detail.value != '') {
            this.setData({
                [password]: e.detail.value,
                isPasswordverify: true
            })
        }
    },
    getStuID(e) {
        if (e.detail.value != '') {
            this.setData({
                [stuID]: e.detail.value,
                isStuIDverify: true
            })
        }
    },
    getMajor(e) {
        //console.log(e)
        if (e.detail.value != '') {
            this.setData({
                [major]: e.detail.value,
                isMajorverify: true
            })
        }
    },
    getName(e) {
        //console.log(e)
        if (e.detail.value != '') {
            this.setData({
                [name]: e.detail.value,
                isNameverify: true
            })
        }
    },
    uploaderToCloudimage() {
        return new Promise((resolve, reject) => {
            wx.cloud.uploadFile({
                cloudPath: `${this.data.userMessage.countName}.jpg`,
                filePath: this.data.user_image[0], // 文件路径
            }).then(res => {
                // get resource ID 
                this.setData({
                    [image]: res.fileID
                })
                resolve(res)
            }).catch(error => {
                reject(error)
                    // handle error
            })
        })
    }
})