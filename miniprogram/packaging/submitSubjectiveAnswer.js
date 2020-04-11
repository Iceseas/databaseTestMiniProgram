const db = wx.cloud.database();
export default function submitSubjectiveAnswer(collectionName, data) {
    console.log('subdata', data)
    return new Promise((resolve, reject) => {
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

}