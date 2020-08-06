// 检测用户登录
import getUser from './getuser'

export default function verifyUserCount(db, collectionName, data) {
    return new Promise((resolve, reject) => {
        if (!data.stuID || !data.password || !data.countName) {
            reject({
                msg: '请填写完信息！',
                error: -1
            })
        } else {
            getUser(db, collectionName, data, 'get')
                .then(res => {
                    if (res.error == 0) {
                        if (res.data.data[0].password == data.password && res.data.data[0].stuID == data.stuID) {
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
                    }
                })
                .catch(err => {
                    reject(err)
                })
        }

    })

}