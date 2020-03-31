export default function handleCleanitemClass(that, e) {
    that.setData({
        item1classControl: '',
        item2classControl: '',
        item3classControl: '',
        item4classControl: '',
        itemCorrect1classControl: '',
        itemFail2classControl: '',
        buttonBindTap: 'handleSelectItem',
        //滑动swiper也要给CurrentIndex赋值，因为要一直保持CurrentIndex和目前swiper的index值是一样的
        CurrentIndex: e.detail.current
    })
}