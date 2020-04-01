import getSequenceQuestion from '../../packaging/getSequenceQuestion.js'
import judgeRightOrError from '../../packaging/judgeRightOrError.js'
import getCollectionSum from '../../packaging/getCollectionSum.js'
import handleCorrectItemClass from '../../packaging/handleCorrectItemClass.js'
import handleFailItemClass from '../../packaging/handleFailItemClass.js'
import handleCleanItemClass from '../../packaging/handleCleanitemClass.js'

const db = wx.cloud.database() //操作数据库
let app = getApp();
let collectionName = app.globalData.questionType + `_models` //控制选择的考试类型
const _ = db.command; //操作数据库
let timer = null;
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
        detail_height: null,
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
        buttonBindTap: 'handleSelectItem',
        tab_slot_contorl: true,
        tabControlTop: 1120,
        correctNum: 0,
        failNum: 0,
        van_action_show: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.Type) {
            app.globalData.TestType = options.Type //接受test页的数据
        }
        let that = this
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        //判断test的类型
        switch (app.globalData.TestType) {
            case 'single_C1':
                //得到顺序测试的题
                getCollectionSum(db, 'single_C1_models')
                    .then(res => {
                        this.setData({
                            questionSum: res.total
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
                getSequenceQuestion(db, 'single_C1_models')
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
                break;
        }

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
        console.log('页面gg')
            //将虚拟题库list清空
        app.globalData.getlist = []
        app.globalData.answerArray = []
        app.globalData.CollectionArray = []

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    handleSelectItem(e) {
        let that = this;
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
                })
                that.setData({
                    correctNum: this.data.correctNum + 1
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
                })
                that.setData({
                    failNum: this.data.failNum + 1
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
        if (this.data.NowQuestionNum == 4) {
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
            handleCleanItemClass(this)
            this.handleRememberAnsweredItemClass(this.data.CurrentIndex)
        }
    },
    goToLastQuestion() {
        if (this.data.NowQuestionNum == 0) {
            wx.showToast({
                title: '这已经是第一道题了！',
                icon: 'none',
                duration: 500
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
        console.log(DecideItemData)
        if (DecideItemData) {
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
        console.log(e)
        this.setData({
            NowQuestionNum: e.currentTarget.dataset.id,
            CurrentIndex: e.currentTarget.dataset.id
        })
        this.close_van_action()
    }

})