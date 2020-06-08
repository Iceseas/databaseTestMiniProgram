const db = wx.cloud.database();
export default function getCountNameUser(countName) {
    console.log(countName)
    return new Promise((resolve, reject) => {
        db.collection('mini_users_models').where({
            countName: countName
        }).get().then(res => {
            if (res.data.length > 0) {
                resolve({
                    msg: '已存在此账户，请重新检查账户',
                    error: -3,
                })
            } else {
                resolve({
                    msg: '此帐户可以注册',
                    error: 0
                })
            }
        }).catch(err => {
            reject({
                msg: '未知错误，请重试',
                error: -111
            })
        })
    })
}