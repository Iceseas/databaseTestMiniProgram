// 判断对错
export default function JudgeRightOrError(itemID, RightAnswer) {
    return new Promise((resolve, reject) => {
        if (itemID && (itemID == RightAnswer)) {
            resolve('正确')
        } else if (itemID && (itemID != RightAnswer)) {
            reject('错误')
        }
    })

}