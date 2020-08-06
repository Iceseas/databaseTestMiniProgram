// 显示提示
export default function showToast(title, duration, icon) {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            duration: duration,
            icon: icon,
        })

    })
}