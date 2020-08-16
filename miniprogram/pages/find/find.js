// pages/find/find.js
import submitSubjectiveAnswer from '../../packaging/submitSubjectiveAnswer.js'
import getCollectionSum from '../../packaging/getCollectionSum.js'
import Request from '../../api/api'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const stuname = 'Subjective_problems.stuName'
const stuID = 'Subjective_problems.stuID'
const stuClass = 'Subjective_problems.stuClass'
const submitTime = 'Subjective_problems.submitTime'
const problemTitle = 'Subjective_problems.problem_Title'
const problemsAnswer = 'Subjective_problems.problemsAnswer'
const Id = 'Subjective_problems.Id'
const db = wx.cloud.database() //操作数据库
const _ = db.command; //操作数据库
let app = getApp();

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
            problemsAnswer: [],
            remark: '',
            grade: 0
        },
        isCalendarOpen: false
    },
    //options(Object)
    onLoad: function(options) {
        wx.request({
            url: 'http://localhost:3000/signIn/api/saveSignInData',
            data: {},
            header: { 'content-type': 'application/json' },
            method: 'POST',
            fail: () => {},
            complete: () => {}
        });

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
        this.setData({
            [problemTitle]: '',
            [problemsAnswer]: []
        })
    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    onPageScroll: function(e) {

    },
    //item(index,pagePath,text)
    onTabItemTap: function(item) {
        this.setData({
            [problemTitle]: '',
            [problemsAnswer]: []
        })
    },
    handleAddAnswer() {
        let arrName = 'Subjective_problems.problemsAnswer'
        this.data.Subjective_problems.problemsAnswer.push('')
        this.setData({
            [arrName]: this.data.Subjective_problems.problemsAnswer,
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
        let that = this
        Dialog.confirm({
            title: '提交主观题作答',
            message: '您确定要提交吗？'
        }).then(() => {
            if (that.data.Subjective_problems.problem_Title === '') {
                wx.showToast({
                    title: '请填写作业名！',
                    duration: 1000,
                    icon:'none'
                })
                return
            }
            // on confirm
            wx.showLoading({
                title: '提交中...',
            })
            let dt = new Date();
            let yy = dt.getFullYear();
            let mm = (dt.getMonth() + 1).toString().padStart(2, '0');
            let ww = (dt.getDate()).toString().padStart(2, '0');
            let hh = (dt.getHours()).toString().padStart(2, '0');
            let m = (dt.getMinutes()).toString().padStart(2, '0');
            let ss = (dt.getSeconds()).toString().padStart(2, '0');
            this.setData({
                [stuname]: app.globalData.nowOnlineUserName,
                [stuID]: app.globalData.nowOnlineUserID,
                [stuClass]: app.globalData.nowOnlineUserClass,
                [submitTime]: `${yy}-${mm}-${ww} ${hh}:${m}:${ss}`
            })
            console.log(this.data.Subjective_problems)
            Request('http://localhost:3000/addQuestion/api/addSubjectiveData','POST',this.data.Subjective_problems)
            .then(res=>{
                wx.hideLoading()
                wx.showToast({
                    title: '上传成功！',
                    duration: 2000,
                    icon: 'success'
                })
                console.log(res)
            })
            .catch(err=>{
                wx.hideLoading()
                wx.showToast({
                    title: '上传失败！',
                    duration: 2000,
                    icon: 'none'
                })
                console.log(err)
            })
        });

    },
    getInputValue(e) {
        let id = e.currentTarget.dataset.id
        let value = "Subjective_problems.problemsAnswer[" + id + "]"
        this.setData({
            [value]: e.detail.value
        })
    },
    getTitle(e) {
        this.setData({
            [problemTitle]: e.detail
        })
    },
    onClickIcon() {
        wx.showToast({
            title: '此次作业的名称',
            duration: 500,
            icon: 'none'
        })
    }
});