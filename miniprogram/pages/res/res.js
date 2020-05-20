import wxRelaunch from '../../packaging/wxRelaunch'
import resUser from '../../packaging/resUser.js'
import verifyUserCount from '../../packaging/verifyUserCount.js'
import showToast from '../../packaging/showToast.js'

const db = wx.cloud.database() //操作数据库
let image = 'userMessage.img'
let app = getApp();
Page({
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
        fileID: '',
        user_name_verify: '',
        user_password_verify: '',
        user_major_verify: '',
        user_stuID_verify: '',
        user_stuName_verify: '',
    },
    onLoad: function(options) {
        this.setData({
            isloginres: app.globalData.islogin
        })
    },
    onShow: function() {
        wx.getSystemInfo({
            success: (result) => {
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
            sizeType: ['compressed'],
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
            wx.showLoading({
                title: '注册中',
            })
            this.uploaderToCloudimage()
                .then((res) => {
                    resUser('mini_users_models', this.data.userMessage)
                        .then(res => {
                            console.log('res', res)
                            if (res.errMsg == 'collection.add:ok') {
                                wx.hideLoading()
                                wx.showToast({
                                    title: '注册成功！',
                                    duration: 2000,
                                    icon: 'success'
                                })
                                this.swichisloginres()
                            } else {
                                wx.hideLoading()
                                wx.showToast({
                                    title: err.msg,
                                    duration: 2000,
                                    icon: 'none'
                                })
                            }
                        })
                        .catch(err => {
                            wx.hideLoading()
                            wx.showToast({
                                title: err.msg,
                                duration: 2000,
                                icon: 'none'
                            })
                        })
                }).catch(err => {
                    console.log(err)
                })
        } else {
            wx.hideLoading()
            wx.showToast({
                title: '请填写好信息',
                duration: 2000,
                icon: 'none'
            })
        }
    },
    getCountName(e) {


        if (e.detail.value != '') {
            this.data.userMessage.countName = e.detail.value
            this.data.isCountNameverify = true
        }

    },
    getPassword(e) {
        let reg = /^(?=.*?[0-9])(?=.*?[a-z])[0-9a-z]{8,}$/
        if (e.detail.value != '') {
            this.data.userMessage.password = e.detail.value
        }
        if (!reg.test(e.detail.value)) {
            this.setData({
                user_password_verify: '密码不能少于8位,且必须有数字字母组合',
                isPasswordverify: false
            })
        } else {
            this.setData({
                user_password_verify: ''
            })
            this.data.isPasswordverify = true
        }
    },
    getStuID(e) {
        let reg = /^2220[0-9]{6}$/
        if (e.detail.value != '') {
            this.data.userMessage.stuID = e.detail.value
        }
        if (!reg.test(e.detail.value)) {
            this.setData({
                user_stuID_verify: '输入的格式错误',
                isStuIDverify: false
            })
        } else {
            this.setData({
                user_stuID_verify: '',
                isStuIDverify: true
            })
        }
    },
    getMajor(e) {
        let reg = /^[\u4e00-\u9fa5]{2,8}[0-9]班$/gi
        if (e.detail.value != '') {
            this.data.userMessage.major = e.detail.value
        }
        if (!reg.test(e.detail.value)) {
            this.setData({
                user_major_verify: '格式：某专业+数字+班',
                isMajorverify: false
            })
        } else {
            this.setData({
                user_major_verify: '',
            })
            this.data.isMajorverify = true
        }
    },
    getName(e) {
        let reg = /^[\u4e00-\u9fa5][\u4e00-\u9fa5]+$/gi
        if (e.detail.value != '') {
            this.data.userMessage.name = e.detail.value
        }
        if (!reg.test(e.detail.value)) {
            this.setData({
                user_stuName_verify: '姓名只能输入大于两位的汉字',
                isNameverify: false
            })
        } else {
            this.setData({
                user_stuName_verify: ''

            })
            this.data.isNameverify = true
        }
    },
    uploaderToCloudimage() {
        let that = this
        return new Promise((resolve, reject) => {
            if (this.data.user_image[0].length == 1 || this.data.user_image[0].length == 0) {
                wx.cloud.downloadFile({
                    fileID: 'cloud://nodetestminicloud-e53ge.6e6f-nodetestminicloud-e53ge-1300092310/DefaultUserImg.jpg',
                    success: res => {
                        wx.getFileSystemManager().saveFile({
                            tempFilePath: res.tempFilePath, // 传入一个本地临时文件路径, http://tmp/开头的
                            filePath: wx.env.USER_DATA_PATH + '/abc.jpg', //保存到用户目录/abc文件中，此处文件名自定义，因为tempFilePath对应的是一大长串字符
                            success(res) {
                                wx.cloud.uploadFile({
                                    cloudPath: `${that.data.userMessage.countName}.jpg`,
                                    filePath: res.savedFilePath, // 文件路径
                                }).then(res => {
                                    that.setData({
                                        [image]: res.fileID
                                    })
                                    resolve(res)
                                }).catch(error => {
                                    console.log(error)
                                    reject(error)
                                })
                            }
                        })
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            } else {
                wx.cloud.uploadFile({
                    cloudPath: `${this.data.userMessage.countName}.jpg`,
                    filePath: that.data.user_image[0], // 文件路径
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
            }
        })
    },
})