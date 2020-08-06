// 得到数据库的总和
export default function getCollectionSum(db, collectionName) {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).count()
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })


}