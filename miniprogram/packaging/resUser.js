import getUser from './getuser'
const db = wx.cloud.database();
export default function resUser(collectionName, data) {
    console.log('resdata', data)
    return new Promise((resolve, reject) => {
        getUser(db, collectionName, data, 'check')
            .then(res => {
                db.collection(collectionName).add({
                        // data 字段表示需新增的 JSON 数据
                        data: data
                    })
                    .then(res => {
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