export default function getUser(db, collectionName, data, how) {
    return new Promise((resolve, reject) => {
        if (data.countName) {
            db.collection(collectionName).where({
                countName: data.countName
            }).get().then(res => {
                //console.log('get', res)
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
                                msg: '用户已存在，请登录！',
                                error: -1
                            })
                            break;
                    }
                } else {
                    resolve({
                        userexist: '用户不存在，请注册！',
                        error: -2
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            resolve({
                userexist: '请输入用户名！',
                error: -3
            })
        }
    })
}