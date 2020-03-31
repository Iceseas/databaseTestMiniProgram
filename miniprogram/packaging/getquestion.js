export default function getquestions(db, collectionName) {
    return new Promise((resolve, reject) => {
        console.log('collectionName', collectionName)
        db.collection(collectionName)
            .aggregate()
            .sample({
                size: 5
            })
            .end()
            .then(res => {
                console.log(res)
                resolve(res)
            })
            .catch(err => {
                reject('获取错误')
            })
    })

}