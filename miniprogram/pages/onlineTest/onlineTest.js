import getpaper from '../../packaging/getOnlineTestPaper.js'

const db = wx.cloud.database() //操作数据库
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        detail_height: null,
        questions: [], //存放接收的题库
        CurrentIndex: 0, //存放当前的Index
        questionSum: 0, //题目总数
        NowQuestionNum: 0, //现在的题目数
        SystemWindowHeight: 1000, //初始化高度
        isdisabled: false,
        tab_slot_contorl: true,
        tabControlTop: 1120,
        van_action_show: false,
        questionGetNumMultiple: 1,
        anction_e_id: null,
        CountDownTime: '02:00:00',
        nowSelectItem: '',
        Item1: 'A',
        Item2: 'B',
        Item3: 'C',
        Item4: 'D',
        Space1Answer: '',
        Space2Answer: '',
        Space3Answer: '',
        Space4Answer: '',
        isinputdone: false,
        isInputdisabled: true,
        isNextLastBtndisabled: false,
        isalterBtnhidden: true,
        alterBtnText: '填写'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        getpaper(db)
            .then(res => {
                console.log(res)
                for (let i = 0; i < res.length; i++) {
                    for (let j = 0; j < res[i].length; j++) {
                        this.data.questions.push(res[i][j])
                    }
                }
                that.setData({
                    questions: this.data.questions
                })
                console.log(this.data.questions)
            })

    },
    onShow: function() {
        this.setData({
            detail_height: app.globalData.SystemWindowHeight
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        //将虚拟题库list清空
        app.globalData.getlist = []
        app.globalData.answerArray = []
        app.globalData.CollectionArray = []

    },
    onChange(event) {
        this.setData({
            value: event.detail
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    selectItem(e) {
        app.globalData.answerArray[this.data.CurrentIndex] = e.currentTarget.id
        this.setData({
            nowSelectItem: e.currentTarget.id
        })
    },
    goToNextQuestion() {
        if (app.globalData.vacancyArr.length > 0) {
            app.globalData.answerArray[this.data.CurrentIndex] = app.globalData.vacancyArr
        }
        if ((this.data.CurrentIndex + 1) >= 5 && (this.data.CurrentIndex + 1) < 10) {
            this.setData({
                isalterBtnhidden: false
            })
        } else {
            this.setData({
                isalterBtnhidden: true
            })
        }
        //如果答过显示答过的答案
        if (app.globalData.answerArray[this.data.CurrentIndex + 1]) {
            if (typeof(app.globalData.answerArray[this.data.CurrentIndex + 1]) == 'string') {
                this.setData({
                    nowSelectItem: app.globalData.answerArray[this.data.CurrentIndex + 1]
                })
            } else {
                app.globalData.vacancyArr = app.globalData.answerArray[this.data.CurrentIndex + 1]
                this.setData({
                    isInputdisabled: true,
                    Space1Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][0],
                    Space2Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][1],
                    Space3Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][2],
                    Space4Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][3],
                })
            }
        } else {
            this.setData({
                nowSelectItem: '',
                Space1Answer: '',
                Space2Answer: '',
                Space3Answer: '',
                Space4Answer: '',
                isInputdisabled: false
            })
        }
        if (this.data.isinputdone) {
            this.cleanvacancyArry()
        }
        if (this.data.NowQuestionNum == 99) {
            wx.showToast({
                title: '这已经是最后一道题了！',
                icon: 'none',
                duration: 500
            })
        } else {
            this.setData({
                CurrentIndex: this.data.CurrentIndex + 1,
                NowQuestionNum: this.data.NowQuestionNum + 1
            })
        }
        console.log(app.globalData.answerArray)
    },
    goToLastQuestion() {
        if (app.globalData.vacancyArr.length > 0) {
            app.globalData.answerArray[this.data.CurrentIndex] = app.globalData.vacancyArr
        }
        if ((this.data.CurrentIndex - 1) >= 5 && (this.data.CurrentIndex - 1) < 10) {
            this.setData({
                isalterBtnhidden: false
            })
        } else {
            this.setData({
                isalterBtnhidden: true
            })
        }
        //如果答过显示答过的答案
        if (app.globalData.answerArray[this.data.CurrentIndex - 1]) {
            if (typeof(app.globalData.answerArray[this.data.CurrentIndex - 1]) == 'string') {
                this.setData({
                    nowSelectItem: app.globalData.answerArray[this.data.CurrentIndex - 1]
                })
            } else {
                app.globalData.vacancyArr = app.globalData.answerArray[this.data.CurrentIndex - 1]
                this.setData({
                    isInputdisabled: true,
                    Space1Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][0],
                    Space2Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][1],
                    Space3Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][2],
                    Space4Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][3],
                })
            }
        } else {
            this.setData({
                nowSelectItem: '',
                Space1Answer: '',
                Space2Answer: '',
                Space3Answer: '',
                Space4Answer: '',
                isInputdisabled: false
            })
        }
        if (this.data.isinputdone) {
            this.cleanvacancyArry()
        }
        if (this.data.NowQuestionNum == 99) {
            wx.showToast({
                title: '这已经是最后一道题了！',
                icon: 'none',
                duration: 500
            })
        } else {
            this.setData({
                CurrentIndex: this.data.CurrentIndex - 1,
                NowQuestionNum: this.data.NowQuestionNum - 1
            })
        }
        console.log(app.globalData.answerArray)
    },
    onPageScroll: function(e) {
        this.setData({
            tabControlTop: 1120 + (e.scrollTop * 2)
        })
    },

    open_van_action() {
        this.setData({
            van_action_show: !this.data.van_action_show
        })
    },
    close_van_action() {
        this.setData({
            van_action_show: false
        })
    },
    selectActionQuestionNum(e) {
        this.setData({
            NowQuestionNum: e.currentTarget.dataset.id,
            CurrentIndex: e.currentTarget.dataset.id
        })
        this.close_van_action()
    },
    Space1Input(e) {
        app.globalData.vacancyArr[0] = e.detail.value
        this.setData({
            isalterSpace1: true
        })
    },
    Space2Input(e) {
        app.globalData.vacancyArr[1] = e.detail.value
        this.setData({
            isalterSpace2: true
        })
    },
    Space3Input(e) {
        app.globalData.vacancyArr[2] = e.detail.value
        this.setData({
            isalterSpace3: true
        })
    },
    Space4Input(e) {
        app.globalData.vacancyArr[3] = e.detail.value
        this.setData({
            isalterSpace4: true
        })
    },
    goAlterVacancy() {
        this.setData({
            isInputdisabled: false,
            isNextLastBtndisabled: true,
            alterBtnText: '完成',

        })
    },
    alterDone() {
        this.setData({
            isNextLastBtndisabled: false,
            isInputdisabled: true,
            isinputdone: true,
            alterBtnText: '填写',
        })
        console.log(app.globalData.vacancyArr)
    },
    cleanvacancyArry() {
        app.globalData.vacancyArr = []
    }
})