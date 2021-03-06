// 获取题目
export default function getSequenceQuestion(db, collectionName, _, questionNum) {
    return new Promise((resolve, reject) => {
        let newArr = []
        for (let i = questionNum - 20; i <= (questionNum - 1); i++) {
            let numString = (i + 1)
            newArr.push(numString)
        }
        db.collection(collectionName)
            .get()
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject('已到最后一题')
            })
    })
}