export default async function getCollectionSum(db) {
    let paperArr = []
    await db.collection('single_models').aggregate().sample({ size: 5 }).end().then(res => {
        console.log(res)
        paperArr.push(res.list)
    })
    await db.collection('vacancy_C1_models').aggregate().sample({ size: 5 }).end().then(res => {
        console.log(res)
        paperArr.push(res.list)
    })
    await db.collection('decide_models').aggregate().sample({ size: 5 }).end().then(res => {
        console.log(res)
        paperArr.push(res.list)
    })
    return new Promise((resolve, reject) => {
        resolve(paperArr)
    })

}