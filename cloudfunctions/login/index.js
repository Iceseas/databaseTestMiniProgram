// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database() //链接数据库
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
    const gradeCollection = db.collection('user_grade_data')
    return gradeCollection.where({ stuID: event.stuID }).get().then(res => {
        console.log(res)
        if (res.data.length === 0) { //如果不存在 - 新增  res.data[0].score
            return userCollection.add({
                data: {
                    StuID: event.stuID,
                    grade: _.push(event.grade)
                }
            })
        } else { //如果表存在字段 - 更新
            return gradeCollection.update({
                data: {
                    grade: _.push(event.grade)
                }
            })
        }
    })
}