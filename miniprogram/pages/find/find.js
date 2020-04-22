// pages/find/find.js
let app = getApp();
import submitSubjectiveAnswer from '../../packaging/submitSubjectiveAnswer.js'
const stuname = 'Subjective_problems.stuName'
const stuID = 'Subjective_problems.stuID'
const stuClass = 'Subjective_problems.stuClass'
const submitTime = 'Subjective_problems.submitTime'
const problemTitle = 'Subjective_problems.problem_Title'
    //Page Object
Page({
    data: {
        Subjective_problems_body_height: null,
        Subjective_problems: {
            problem_Title: '',
            stuName: '',
            stuID: '',
            stuClass: '',
            submitTime: '',
            problemsAnswer: [{
                value: ''
            }]
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
        let newData = {
            value: ''
        }
        let arrName = 'Subjective_problems.problemsAnswer'
        this.data.Subjective_problems.problemsAnswer.push(newData)
        this.setData({
            [arrName]: this.data.Subjective_problems.problemsAnswer
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
        this.setData({
            [stuname]: app.globalData.nowOnlineUserName,
            [stuID]: app.globalData.nowOnlineUserID,
            [stuClass]: app.globalData.nowOnlineUserClass,
            [submitTime]: Date.now()
        })
        submitSubjectiveAnswer('subjective_publish_models', this.data.Subjective_problems)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    },
    getInputValue(e) {
        let id = e.currentTarget.dataset.id
        let name = e.currentTarget.dataset.name
        let value = "Subjective_problems.problemsAnswer[" + id + "]." + name
        this.setData({
            [value]: e.detail
        })
        console.log(e)
    },
    getTitle(e) {
        this.setData({
            [problemTitle]: e.detail
        })
    }
});