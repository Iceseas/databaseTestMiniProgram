export default function getUser(db, collectionName, data, how) {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).where({
            countName: data.countName
        }).get().then(res => {
            console.log('get', res)
            if (res.data.length > 0) {
                switch (how) {
                    case 'get':
                        resolve(res)
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
                    userexist: 'not exist'
                })
            }
        }).catch(err => {
            console.log(err)
        })
    })
}