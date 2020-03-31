import judgeCurrentIndex from 'judgeCurrentIndex.js'
export default function handleSwiperCurrentChange(CurrentIndex, questionLength, that) {
    //处理Swiper的切换逻辑
    judgeCurrentIndex(CurrentIndex, questionLength)
        .then(res => {
            //获取数据
            if (res.msg == 'getData') {
                wx.showLoading({
                    title: '加载中',
                    mask: true,
                });
                switch (app.globalData.TestType) {
                    case 'RandomTest':
                        getQuestion(db, collectionName)
                            .then(res => {
                                pushGetlist(res.list)
                            })
                            .then(() => {
                                that.setData({
                                    questions: app.globalData.getlist
                                })
                                wx.hideLoading();
                            })
                            .then(() => {
                                that.setData({
                                    CurrentIndex: res.data
                                })
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
                            .then(() => {
                                that.setData({
                                    CurrentIndex: res.data
                                })
                            })
                        break;
                }
                //swiper-item跳转
            } else if (res.msg == 'Next') {
                that.setData({
                    CurrentIndex: res.data
                })
            }
        })
}