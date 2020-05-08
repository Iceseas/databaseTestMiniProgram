import getpaper from '../../packaging/getOnlineTestPaper.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
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
        countDown: 2 * 60 * 60 * 1000,
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
        Inputdisabled: true,
        isNextLastBtndisabled: false,
        isalterBtnhidden: true,
        alterBtnText: '填写'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        getpaper(db)
            .then(res => {
                console.log(res)
                for (let i = 0; i < res.length; i++) {
                    for (let j = 0; j < res[i].length; j++) {
                        let noteArr = []
                        this.data.questions.push(res[i][j])
                        if (res[i][j].Answer) {
                            app.globalData.questionAnswerArray.push(res[i][j].Answer)
                        } else if (res[i][j].Issequence) {
                            noteArr.push(res[i][j].Issequence)
                            if (res[i][j].Space1Answer) {
                                noteArr.push(res[i][j].Space1Answer)
                            }
                            if (res[i][j].Space2Answer) {
                                noteArr.push(res[i][j].Space2Answer)
                            }
                            if (res[i][j].Space3Answer) {
                                noteArr.push(res[i][j].Space3Answer)
                            }
                            if (res[i][j].Space4Answer) {
                                noteArr.push(res[i][j].Space4Answer)
                            }
                            app.globalData.questionAnswerArray.push(noteArr)
                        }
                    }
                }
                that.setData({
                    questions: this.data.questions
                })
                wx.hideLoading()
                console.log(app.globalData.questionAnswerArray)
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
        app.globalData.answerArray = []
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
                    Inputdisabled: true,
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
                Space4Answer: ''
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
                    Inputdisabled: true,
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
                Space4Answer: ''
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
            Inputdisabled: false,
            isNextLastBtndisabled: true,
            alterBtnText: '完成',

        })
    },
    alterDone() {
        this.setData({
            isNextLastBtndisabled: false,
            Inputdisabled: true,
            isinputdone: true,
            alterBtnText: '填写',
        })
        console.log(app.globalData.vacancyArr)
    },
    cleanvacancyArry() {
        app.globalData.vacancyArr = []
    },
    submitPaper() {
        let that = this
        Dialog.confirm({
            title: '提交试卷',
            message: '您确定要提交吗？'
        }).then(() => {
            if (app.globalData.vacancyArr.length > 0) {
                app.globalData.answerArray[that.data.CurrentIndex] = app.globalData.vacancyArr
            }
            if (that.data.isinputdone) {
                that.cleanvacancyArry()
            }
            wx.showLoading({
                title: '正在算分中..',
            })
            for (let i = 0; i < app.globalData.answerArray.length; i++) {
                if (typeof(app.globalData.answerArray[i]) == 'object') {
                    if (app.globalData.questionAnswerArray[i][0] == 'true') {
                        for (let j = 0; j < app.globalData.answerArray[i].length;) {
                            if (app.globalData.answerArray[i][j].search(app.globalData.questionAnswerArray[i][j + 1]) != -1) {
                                app.globalData.finalGrade = app.globalData.finalGrade + 1
                                j++
                            } else {
                                j++
                            }
                        }
                    } else if (app.globalData.questionAnswerArray[i][0] == 'false') {
                        for (let k = 1; k < app.globalData.questionAnswerArray[i].length; k++) {
                            for (let l = 0; l < app.globalData.answerArray[i].length; l++) {
                                if (app.globalData.questionAnswerArray[i][k].indexOf('(') != -1) {
                                    let reg = /\([^\)]+\)/g
                                    app.globalData.questionAnswerArray[i][k] = app.globalData.questionAnswerArray[i][k].match(reg)
                                    for (let y = 0; y < app.globalData.questionAnswerArray[i][k].length; y++) {
                                        app.globalData.questionAnswerArray[i][k][y] = app.globalData.questionAnswerArray[i][k][y].substring(1, app.globalData.questionAnswerArray[i][k][y].length - 1)
                                    }
                                    for (let x = 0; x < app.globalData.questionAnswerArray[i][k].length; x++) {
                                        if (app.globalData.answerArray[i][l].includes(app.globalData.questionAnswerArray[i][k][x]) != -1) {
                                            app.globalData.answerArray[i].splice(l, 1)
                                            app.globalData.finalGrade = app.globalData.finalGrade + 1
                                            l = app.globalData.answerArray[i].length
                                            x = app.globalData.questionAnswerArray[i][k].length
                                        }
                                    }
                                } else {
                                    if (app.globalData.answerArray[i][l].includes(app.globalData.questionAnswerArray[i][k]) != -1) {
                                        app.globalData.answerArray[i].splice(l, 1)
                                        app.globalData.finalGrade = app.globalData.finalGrade + 1
                                        l = app.globalData.answerArray[i].length
                                    }
                                }
                            }
                            console.log('跳出for l')
                        }
                    }
                } else if (typeof(app.globalData.answerArray[i]) == 'string') {
                    // console.log('app.globalData.answerArray[i]:', app.globalData.answerArray[i])
                    // console.log('app.globalData.questionAnswerArray[i]:', app.globalData.questionAnswerArray[i])
                    if (app.globalData.answerArray[i] == app.globalData.questionAnswerArray[i]) {
                        app.globalData.finalGrade += 1
                    }
                }
            }
            wx.hideLoading()
            console.log(app.globalData.finalGrade)
            console.log(app.globalData.questionAnswerArray)
            console.log(app.globalData.answerArray)
        }).catch(() => {
            // on cancel

        });
    }
})