import getUser from './getuser'

export default function verifyUserCount(db, collectionName, data) {
    return new Promise((resolve, reject) => {
        getUser(db, collectionName, data, 'get')
            .then(res => {
                if (res.data[0].password == data.password) {
                    resolve({
                        msg: 'verify ok',
                        error: 0
                    })
                } else {
                    reject({
                        msg: 'verify not ok',
                        error: '-1'
                    })
                }
            })
    })

}