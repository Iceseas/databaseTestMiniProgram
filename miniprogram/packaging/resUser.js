import getUser from './getuser'

export default function resUser(db, collectionName, data) {
    return new Promise((resolve, reject) => {
        getUser(db, collectionName, data, 'check')
            .then(res => {
                console.log('res', res)
                db.collection(collectionName).add({
                        // data 字段表示需新增的 JSON 数据
                        data: data
                    })
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {

                    })
            })

    })

}