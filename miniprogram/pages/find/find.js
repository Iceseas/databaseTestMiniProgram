// pages/find/find.js
import submitSubjectiveAnswer from '../../packaging/submitSubjectiveAnswer.js'
import getCollectionSum from '../../packaging/getCollectionSum.js'
const stuname = 'Subjective_problems.stuName'
const stuID = 'Subjective_problems.stuID'
const stuClass = 'Subjective_problems.stuClass'
const submitTime = 'Subjective_problems.submitTime'
const problemTitle = 'Subjective_problems.problem_Title'
const Id = 'Subjective_problems.Id'
const db = wx.cloud.database() //操作数据库
const _ = db.command; //操作数据库
let app = getApp();

//Page Object
Page({
    data: {
        Subjective_problems_body_height: null,
        Subjective_problems: {
            Id: null,
            problem_Title: '',
            stuName: '',
            stuID: '',
            stuClass: '',
            submitTime: '',
            problemsAnswer: [],
            remark: [],
            grade: []
        }
    },
    //options(Object)
    onLoad: function(options) {

    },
    onReady: function() {

    },
    onShow: function() {
        this.setData({
            Subjective_problems_body_height: app.globalData.SystemWindowHeight * 2
        })
    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    onPageScroll: function(e) {
        console.log(e)
    },
    //item(index,pagePath,text)
    onTabItemTap: function(item) {

    },
    handleAddAnswer() {
        let arrName = 'Subjective_problems.problemsAnswer'
        let remarkName = 'Subjective_problems.remark'
        let gradeName = 'Subjective_problems.grade'
        this.data.Subjective_problems.problemsAnswer.push('')
        this.data.Subjective_problems.remark.push('')
        this.data.Subjective_problems.grade.push('')
        this.setData({
            [arrName]: this.data.Subjective_problems.problemsAnswer,
            [remarkName]: this.data.Subjective_problems.remark,
            [gradeName]: this.data.Subjective_problems.grade,
        })
    },
    removeAnswer(e) {
        var num = e.currentTarget.dataset.index; //获取data-index
        this.data.Subjective_problems.problemsAnswer.splice(num, 1);
        let arrName = 'Subjective_problems.problemsAnswer'
        this.setData({
            [arrName]: this.data.Subjective_problems.problemsAnswer
        })
    },
    submit_Subjective_Problems() {
        getCollectionSum(db, 'subjective_publish_models')
            .then(res => {
                let dt = new Date(msg);
                let yy = dt.getFullYear();
                let mm = (dt.getMonth() + 1).toString().padStart(2, '0');
                let ww = (dt.getDate()).toString().padStart(2, '0');
                let hh = (dt.getHours()).toString().padStart(2, '0');
                let m = (dt.getMinutes()).toString().padStart(2, '0');
                let ss = (dt.getSeconds()).toString().padStart(2, '0');
                console.log(`${yy}-${mm}-${ww} ${hh}:${m}:${ss}`);
                this.setData({
                    [Id]: res.total + 1,
                    [stuname]: app.globalData.nowOnlineUserName,
                    [stuID]: app.globalData.nowOnlineUserID,
                    [stuClass]: app.globalData.nowOnlineUserClass,
                    [submitTime]: Date.now()
                })
                console.log('submit')
                submitSubjectiveAnswer('subjective_publish_models', this.data.Subjective_problems)
                    .then(res => {
                        console.log('submit')
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })

    },
    getInputValue(e) {
        let id = e.currentTarget.dataset.id
        let value = "Subjective_problems.problemsAnswer[" + id + "]"
        this.setData({
            [value]: e.detail.value
        })
        console.log(e)
    },
    getTitle(e) {
        this.setData({
            [problemTitle]: e.detail
        })
    }
});