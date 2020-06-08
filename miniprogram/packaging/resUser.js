import getUser from './getuser'
const db = wx.cloud.database();
export default function resUser(collectionName, data) {
    let total, obj
    db.collection('user_grade_data').get().then(res => {
        total = res.data.length
        obj = {
            grade: [],
            id: total + 1,
            stuID: data.stuID
        }
    })
    return new Promise((resolve, reject) => {
        getUser(db, collectionName, data, 'check')
            .then(res => {
                db.collection(collectionName).add({
                        // data 字段表示需新增的 JSON 数据
                        data: data
                    })
                    .then(res => {
                        db.collection('user_grade_data').add({
                            data: obj
                        })
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
            .catch(err => {
                reject(err)
            })

    })

}