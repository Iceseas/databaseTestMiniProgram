// 跳转
export default function wxRelaunch(page, data) {
    let newurl
    if (data) {
        if (data.stuID && data.countName) {
            newurl = `../${page}/${page}?countName=${data.countName}&stuID=${data.stuID}`
        } else {
            newurl = `../${page}/${page}?countName=${data.countName}`
        }
        wx.reLaunch({
            url: newurl,
            success: (result) => {},
            fail: (err) => {
                console.log(err)
            },
            complete: () => {}
        });
    } else {
        wx.reLaunch({
            url: `../${page}/${page}`,
            success: (result) => {
                console.log(result)
            },
            fail: (err) => {
                console.log(err)
            },
            complete: () => {}
        });
    }

}