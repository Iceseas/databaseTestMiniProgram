// 封装request
export default function Request(url, method, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data,
            header: {'content-type':'application/json'},
            method: method,
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                resolve({
                    result,
                    msg: '请求成功'
                })
            },
            fail: (err) => {
                reject({
                    err,
                    msg: '请求失败'
                })
            },
        });
    })
}
  