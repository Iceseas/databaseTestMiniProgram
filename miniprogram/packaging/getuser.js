import getCountNameUser from './getCountNameUser.js'

export default function getUser(db, collectionName, data, how) {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).where({
            stuID: data.stuID
        }).get().then(res => {
            if (res.data.length > 0) {
                switch (how) {
                    case 'get':
                        resolve({
                            data: res,
                            error: 0
                        })
                        break;
                    case 'check':
                        reject({
                            msg: '该帐号或学号已存在，请重新输入或登录！',
                            error: -1
                        })
                        break;
                }
            } else {
                getCountNameUser(data.countName)
                    .then(res => {
                        if (res.error == 0 && how == 'check') {
                            resolve({
                                msg: '该账户可以注册',
                                error: 0
                            })
                        } else {
                            reject({
                                msg: '该账户或学号已存在，请重新输入或登录！',
                                error: -1
                            })
                        }
                    })
                    .catch(err => {
                        console.log('未知错误')
                    })
            }
        })
    })
}