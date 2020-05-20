const db = wx.cloud.database();
export default function getuserSignIndata(collectionName, stuID) {
    return new Promise((resolve, reject) => {
        console.log(collectionName, stuID)
        db.collection(collectionName).where({
                stuID: stuID
            }).get()
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })

}