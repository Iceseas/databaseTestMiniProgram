import getUser from './getuser'

export default function verifyUserCount(db, collectionName, data) {
    return new Promise((resolve, reject) => {
        getUser(db, collectionName, data, 'get')
            .then(res => {
                if (res.error == 0) {
                    if (res.data.data[0].password == data.password) {
                        resolve({
                            msg: '登录成功！',
                            error: 0
                        })
                    } else {
                        reject({
                            msg: '密码或用户名错误',
                            error: -1
                        })
                    }
                } else {
                    reject({
                        res
                    })
                }

            })
            .catch(err => {
                console.log('err', err)
            })
    })

}