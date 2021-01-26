/**
 * post请求
 * @param {String} url 请求地址
 * @param {Object} data 请求数据 
 */
function post (url, data) {
    return new Promise((resolve, reject)=>{
        wx.request({
            url,
            data,
            method: 'POST',
            success: (result) => {
               if (result.data.err === 0){
                   resolve(result)
               }else {
                   reject(result)
               }
            },
            fail: (err) => {
                reject({
                    data: {
                    err,
                    msg: '系统错误，请联系管理员',
                    errcode: '-1'
                }})
            },
        });
    })
}
/**
 * get 请求
 * @param {String} url 请求地址
 * @param {Object} data 请求数据 
 */
function get (url, data) {
    return new Promise((resolve, reject)=>{
        wx.request({
            url,
            data,
            method: 'GET',
            success: (result) => {
               if (result.data.err === 0){
                   resolve(result)
               }else {
                   reject(result)
               }
            },
            fail: (err) => {
                reject({
                    data: {
                    msg: '系统错误，请联系管理员',
                    errcode: '-1'
                }})
            },
        });
    })
}

/**
 * file 请求
 * @param {String} url 请求地址
 * @param {Object} data 请求数据 
 */
function file (url, data) {
    return new Promise((resolve, reject)=>{
        wx.uploadFile({
            url,
            filePath: data.tempFilePaths,
            name: data.name,
            success: (result) => {
                console.log('封装接口res:',result)
                resolve(result)
             },
             fail: (err) => {
                 console.log('封装接口err:',err)
                 reject({
                     data: {
                     msg: '系统错误，请联系管理员',
                     errcode: '-1'
                 }})
             },
          })
    })
}

export {
    post,
    get,
    file
}