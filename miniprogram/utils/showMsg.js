function okMsg(title, duration) {
    wx.showToast({
        title,
        icon: 'success',
        duration,
    });
}

function errMsg(title, duration) {
    wx.showToast({
        title,
        icon: 'error',
        duration,
    });
}

function noIconMsg(title, duration) {
    wx.showToast({
        title,
        icon: 'none',
        duration,
    });
}

export {
    okMsg,
    errMsg,
    noIconMsg
}