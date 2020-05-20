const db = wx.cloud.database();
const _ = db.command
export default function uploadgrade(stuID, grade) {
    return new Promise((resolve, reject) => {
        console.log(grade)
        db.collection('user_grade_data').where({
                stuID: stuID
            }).get()
            .then(res => {
                console.log(res)
                if (res.data.length > 0) {
                    wx.cloud.callFunction({
                        // 云函数名称
                        name: 'login',
                        // 传给云函数的参数
                        data: {
                            stuID: stuID,
                            grade: grade,
                        },
                        success: function(res) {
                            console.log(res) // 3
                        },
                        fail: console.error
                    })
                }
            })
            .catch(err => {
                reject(err)
            })
    })

}