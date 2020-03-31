export default function sum100Grade(answerArray) {
    let GradeSum = 0
    return new Promise((resolve, reject) => {
        if (answerArray.length > 0) {
            for (let i = 0; i < answerArray.length; i++) {
                console.log((i + 1) + ':' + answerArray[i].grade)
                GradeSum += answerArray[i].grade
            }
            resolve({
                msg: '数据正确',
                grade: GradeSum
            })
        } else {
            reject({
                msg: '数据错误'
            })
        }
    })

}