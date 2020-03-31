export default function request(options) {
    return new Promise((resolve, reject) => {

        wx.request({
            url: options.url,
            method: options.method || 'post',
            data: options.data || { questionType: 'A1_TEST_Model_1' },
            success: function(res) {
                resolve(res)
            },
            fail: function(err) {
                reject(err)
            }
        })
    })
}