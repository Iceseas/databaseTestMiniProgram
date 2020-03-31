export default function wxRelaunch(page, data) {
    console.log(data)
    if (data) {
        wx.reLaunch({
            url: `../${page}/${page}?countName=${data.countName}`,
            success: (result) => {
                console.log(result)
            },
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