import handleItemID from '../../packaging/handleItemID.js';
import getQuestion from '../../packaging/getquestion.js'
import getSequenceQuestion from '../../packaging/getSequenceQuestion.js'
import judgeRightOrError from '../../packaging/judgeRightOrError.js'
import getCollectionSum from '../../packaging/getCollectionSum.js'
import handleCleanitemClass from '../../packaging/handleCleanitemClass.js'
import handleSwiperCurrentChange from '../../packaging/handleSwiperCurrentChange.js'
import handleCorrectItemClass from '../../packaging/handleCorrectItemClass.js'
import handleFailItemClass from '../../packaging/handleFailItemClass.js'

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
        CurrentIndex: 0, //存放当前的swiper Index
        swiperDuration: 0, //控制swiper切换动画
        questionSum: 0, //题目总数
        NowQuestionNum: 0, //现在的题目数
        SystemWindowHeight: 1000, //初始化swiper的高度
        item1classControl: '',
        item2classControl: '',
        item3classControl: '',
        item4classControl: '',
        itemCorrect1classControl: '',
        itemFail2classControl: '',
        isCollection: '',
        isdisabled: false,
        buttonBindTap: 'handleSelectItem',
        isexplainsHidden: false,
        isCorrectTipHidden: true,
        isFailTipHidden: true

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
                //得到随机测试的题
                getQuestion(db, 'single_C1_models')
                    .then(res => {
                        pushGetlist(res.list)
                    })
                    .then(() => {
                        that.setData({
                            questions: app.globalData.getlist,
                            questionSum: 100
                        })
                    })
                wx.hideLoading()
                break;
            case 'sequenceTest':
                //得到顺序测试的题
                getCollectionSum(db, collectionName)
                    .then(res => {
                        this.setData({
                            questionSum: res.total
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
                getSequenceQuestion(db, collectionName, _, app.globalData.questionNum)
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
    onShow: function() {
        this.setData({
            detail_height: app.globalData.SystemWindowHeight
        })
        console.log(this.data.detail_height)
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
                handleFailItemClass(e.currentTarget.id, this)
                handleCorrectItemClass(RightAnswer, this)
            })
            //控制swiper-item转换逻辑
            //handleSwiperCurrentChange(this.data.CurrentIndex, this.data.questions.length - 1, this)

    },
    swiperCurrentChange(e) {
        handleCleanitemClass(this, e);
        let that = this
        let DecideItemData = app.globalData.answerArray[e.detail.current]
        let CollectionData = app.globalData.CollectionArray[e.detail.current]
            //如果手动划swiper划到了目前渲染的最后一页，那么就开始请求数据
        if (e.detail.current == this.data.questions.length - 1) {
            wx.showLoading({
                title: '加载中',
                mask: true,
            });
            switch (app.globalData.TestType) {
                case 'RandomTest':
                    getQuestion(db, collectionName)
                        .then(res => {
                            //把新请求到的数据push到getlist中
                            pushGetlist(res.list)
                        })
                        .then(() => {
                            //再把新getlist赋值给questions，页面会相应的进行增加渲染
                            that.setData({
                                questions: app.globalData.getlist
                            })
                            wx.hideLoading();
                        })
                    break;
                case 'sequenceTest':
                    app.globalData.questionNum = app.globalData.questionNum + 5
                    getSequenceQuestion(db, collectionName, _, app.globalData.questionNum)
                        .then(res => {
                            pushGetlist(res.data)
                        })
                        .then(() => {
                            that.setData({
                                questions: app.globalData.getlist
                            })
                            wx.hideLoading();
                        })
                    break;
            }
        }
        //目前的swiper的index值就是目前的题号
        this.setData({
                NowQuestionNum: e.detail.current
            })
            //如果在这一页的Current对应app.globalData.CollectionArray的[current位]有数据，那么给收藏加样式
        if (CollectionData) {
            //如果收藏存在
            this.setData({
                isCollection: 'activeCollection'
            })
        } else {
            this.setData({
                isCollection: ''
            })
        }
        if (DecideItemData) {
            //如果用户答过这一题
            if (DecideItemData.isCorrect == true) {
                handleCorrectItemClass(DecideItemData.CurrentTargetID, this)
            } else if (DecideItemData.isCorrect == false) {
                handleFailItemClass(DecideItemData.CurrentTargetID, this)
                handleCorrectItemClass(DecideItemData.RightItemID, this)
            }
        }

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
    }

})