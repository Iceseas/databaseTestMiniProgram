import getSequenceQuestion from '../../packaging/getSequenceQuestion.js'
import judgeRightOrError from '../../packaging/judgeRightOrError.js'
import getCollectionSum from '../../packaging/getCollectionSum.js'
import handleCorrectItemClass from '../../packaging/handleCorrectItemClass.js'
import handleFailItemClass from '../../packaging/handleFailItemClass.js'
import handleCleanItemClass from '../../packaging/handleCleanitemClass.js'

const db = wx.cloud.database() //操作数据库
let app = getApp();
const _ = db.command; //操作数据库
//处理将新请求的数据push到题库的后面
function pushGetlist(resList) {
    for (let i = 0; i < resList.length; i++) {
        app.globalData.getlist.push(resList[i])
    }
}
Page({
    /**
     * 页面的初始数据
     */
    data: {
        questions: [], //存放接收的题库
        CurrentIndex: 0, //存放当前的Index
        questionSum: 0, //题目总数
        NowQuestionNum: 0, //现在的题目数
        SystemWindowHeight: 1000, //初始化高度
        item1classControl: '',
        item2classControl: '',
        item3classControl: '',
        item4classControl: '',
        itemCorrect1classControl: '',
        itemFail2classControl: '',
        isCollection: '',
        isdisabled: false,
        tab_slot_contorl: true,
        tabControlTop: 1120,
        correctNum: 0,
        failNum: 0,
        van_action_show: false,
        questionGetNumMultiple: 1,
        selectQuestionEvent: 'handleSelectItem',
        anction_e_id: null,
        value: 1,
        isChecked: false,
        // 填空题
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
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('ToDetailData', function(data) {
            if (data.Type) {
                app.globalData.TestType = data.Type
                wx.showLoading({
                    title: '加载中',
                    mask: true,
                });
                getCollectionSum(db, app.globalData.TestType)
                    .then(res => {
                        that.setData({
                            questionSum: res.total
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
                getSequenceQuestion(db, app.globalData.TestType, _, app.globalData.questionGetNum)
                    .then(res => {
                        pushGetlist(res.data)
                    })
                    .then(() => {
                        that.setData({
                            questions: app.globalData.getlist
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
                wx.hideLoading();
                if (data.Type == 'vacancy_C1_models') {
                    that.setData({
                        isalterBtnhidden: false
                    })
                }
            }
        })

    },
    onShow: function() {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        //将虚拟题库list清空
        app.globalData.TestType = ''
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
    handledifficultStart(difficulty) {
        switch (difficulty) {
            case '简单':
                return 1;
            case '一般':
                return 2;
            case '中等':
                return 3;
            case '较难':
                return 4;
            case '困难':
                return 5;
        }
    },
    handleSelectItem(e) {
        let that = this;
        let newValue = this.handledifficultStart(this.data.questions[this.data.CurrentIndex].difficulty)
        this.setData({
                isChecked: true,
                value: newValue
            })
            //用于控制每次请求的题数
        let RightAnswer = this.data.questions[this.data.CurrentIndex].Answer //正确答案
        let UserAnswer = e.currentTarget.id //用户点击的答案
        app.globalData.questionAnswerArray.push(RightAnswer) //存放正确答案数组
            //判断正误

        judgeRightOrError(UserAnswer, RightAnswer)
            .then(() => {
                //回答正确
                app.globalData.answerArray[this.data.CurrentIndex] = ({
                    UserAnswer: UserAnswer,
                    Answer: RightAnswer,
                    grade: 1,
                    isCorrect: true,
                    difficulty: newValue
                })
                that.setData({
                    correctNum: this.data.correctNum + 1,
                    selectQuestionEvent: ''
                })
                handleCorrectItemClass(e.currentTarget.id, this)
            })
            .catch(() => {
                //回答错误
                app.globalData.answerArray[this.data.CurrentIndex] = ({
                    UserAnswer: UserAnswer,
                    Answer: RightAnswer,
                    grade: 0,
                    isCorrect: false,
                    difficulty: newValue
                })
                that.setData({
                    failNum: this.data.failNum + 1,
                    selectQuestionEvent: ''
                })
                handleFailItemClass(e.currentTarget.id, this)
                handleCorrectItemClass(RightAnswer, this)
            })
    },
    handleCollection(e) {
        wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 500,
            success: () => {
                //如果成功那么getlist[相应位]就赋值给Collection[相应位]这样会自动补齐前面的空
                app.globalData.CollectionArray[this.data.CurrentIndex] = ({
                    data: app.globalData.getlist[this.data.CurrentIndex],
                    isCollection: true
                })
                this.setData({
                    isCollection: 'activeCollection'
                })

            },
        })
    },
    goToNextQuestion() {
        if (app.globalData.answerArray[this.data.CurrentIndex + 1]) {
            this.setData({
                selectQuestionEvent: ''
            })
        } else {
            this.setData({
                selectQuestionEvent: 'handleSelectItem'
            })
        }
        if (app.globalData.vacancyArr.length > 0) {
            app.globalData.answerArray[this.data.CurrentIndex] = app.globalData.vacancyArr
        }
        if (app.globalData.answerArray[this.data.CurrentIndex + 1]) {
            if (typeof(app.globalData.answerArray[this.data.CurrentIndex + 1]) == 'object') {
                app.globalData.vacancyArr = app.globalData.answerArray[this.data.CurrentIndex + 1]
                let newValue = this.handledifficultStart(this.data.questions[this.data.CurrentIndex].difficulty)
                this.setData({
                    isalterBtnhidden: true,
                    isChecked: true,
                    value: newValue,
                    Inputdisabled: true,
                    Space1Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][0],
                    Space2Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][1],
                    Space3Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][2],
                    Space4Answer: app.globalData.answerArray[this.data.CurrentIndex + 1][3],
                })
            } else {
                this.setData({
                    isChecked: false,
                    value: app.globalData.answerArray[this.data.CurrentIndex + 1].difficulty
                })
            }
        } else {
            if (app.globalData.TestType != 'vacancy_C1_models') {
                this.setData({
                    isalterBtnhidden: true
                })
            } else {
                this.setData({
                    isalterBtnhidden: false
                })
            }
            this.setData({
                isChecked: false,
                Space1Answer: '',
                Space2Answer: '',
                Space3Answer: '',
                Space4Answer: ''
            })
        }
        if (this.data.isinputdone) {
            this.cleanvacancyArry()
        }
        this.isTimeToGetNewData(this.data.CurrentIndex + 1)
        if (this.data.NowQuestionNum == this.data.questionSum - 1) {
            wx.showToast({
                title: '这已经是最后一道题了！',
                icon: 'none',
                duration: 500
            })
            this.setData({
                isChecked: true
            })
        } else {
            this.setData({
                CurrentIndex: this.data.CurrentIndex + 1,
                NowQuestionNum: this.data.NowQuestionNum + 1
            })
            handleCleanItemClass(this)
            this.handleRememberAnsweredItemClass(this.data.CurrentIndex)
        }
    },
    goToLastQuestion() {
        if (app.globalData.answerArray[this.data.CurrentIndex - 1]) {
            this.setData({
                selectQuestionEvent: ''
            })
        } else {
            this.setData({
                selectQuestionEvent: 'handleSelectItem'
            })
        }
        if (app.globalData.vacancyArr.length > 0) {
            app.globalData.answerArray[this.data.CurrentIndex] = app.globalData.vacancyArr
        }
        if (app.globalData.answerArray[this.data.CurrentIndex - 1]) {

            if (typeof(app.globalData.answerArray[this.data.CurrentIndex - 1]) == 'object') {
                app.globalData.vacancyArr = app.globalData.answerArray[this.data.CurrentIndex - 1]
                let newValue = this.handledifficultStart(this.data.questions[this.data.CurrentIndex].difficulty)
                this.setData({
                    isalterBtnhidden: true,
                    isChecked: true,
                    value: newValue,
                    Inputdisabled: true,
                    Space1Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][0],
                    Space2Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][1],
                    Space3Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][2],
                    Space4Answer: app.globalData.answerArray[this.data.CurrentIndex - 1][3],
                })
            } else {
                this.setData({
                    isChecked: false,
                    value: app.globalData.answerArray[this.data.CurrentIndex - 1].difficulty
                })
            }
        } else {
            if (app.globalData.TestType != 'vacancy_C1_models') {
                this.setData({
                    isalterBtnhidden: true
                })
            } else {
                this.setData({
                    isalterBtnhidden: false
                })
            }
            this.setData({
                isChecked: false,
                Space1Answer: '',
                Space2Answer: '',
                Space3Answer: '',
                Space4Answer: ''
            })
        }
        if (this.data.isinputdone) {
            this.cleanvacancyArry()
        }
        if (this.data.NowQuestionNum == 0) {
            wx.showToast({
                title: '这已经是第一道题了！',
                icon: 'none',
                duration: 500
            })
            this.setData({
                isChecked: true
            })
        } else {
            this.setData({
                CurrentIndex: this.data.CurrentIndex - 1,
                NowQuestionNum: this.data.NowQuestionNum - 1
            })
            wx.nextTick(() => {
                handleCleanItemClass(this)
                this.handleRememberAnsweredItemClass(this.data.CurrentIndex)
            })
        }

    },
    handleRememberAnsweredItemClass(CurrentIndex) {
        let DecideItemData = app.globalData.answerArray[CurrentIndex]
        if (DecideItemData) {
            this.setData({
                isChecked: true
            })
            if (DecideItemData.isCorrect == true) {
                handleCorrectItemClass(DecideItemData.Answer, this)
            } else if (DecideItemData.isCorrect == false) {
                handleFailItemClass(DecideItemData.UserAnswer, this)
                handleCorrectItemClass(DecideItemData.Answer, this)
            }
        }
    },
    onPageScroll: function(e) {
        this.setData({
            tabControlTop: 1120 + (e.scrollTop * 2)
        })
    },
    openGradeTab() {
        this.setData({
            tab_slot_contorl: !this.data.tab_slot_contorl
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
        let result = this.isTimeToGetNewData(e.currentTarget.dataset.id)
        if (result) {
            this.setData({
                NowQuestionNum: e.currentTarget.dataset.id,
                CurrentIndex: e.currentTarget.dataset.id
            })
        }

        this.close_van_action()
    },
    getOtherQuestion(Multiple) {
        let that = this
        getSequenceQuestion(db, app.globalData.TestType, _, app.globalData.questionGetNum * (Multiple + 1))
            .then(res => {
                pushGetlist(res.data)
                app.globalData.nowMaxQuestionSum = 20 * (Multiple + 1)
            })
            .then(() => {
                that.setData({
                    questions: app.globalData.getlist
                })
            })
            .catch(err => {
                console.log(err)
            })
    },
    isTimeToGetNewData(CurrentID) {
        if ((CurrentID + 1) == app.globalData.nowMaxQuestionSum) {
            this.getOtherQuestion(parseInt((CurrentID + 1) / 20))
            return true
        } else if ((CurrentID + 1) > app.globalData.nowMaxQuestionSum) {
            wx.showToast({
                title: '前20道题还没有答完哦！',
                icon: 'none',
                duration: 1000
            })
            return false
        }
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
            isalterBtnhidden: true,
            isNextLastBtndisabled: false,
            isChecked: true,
            Inputdisabled: true,
            isinputdone: true,
            alterBtnText: '填写',
        })
    },
    cleanvacancyArry() {
        app.globalData.vacancyArr = []
    },

})