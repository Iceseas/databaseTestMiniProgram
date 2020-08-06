// 渲染样式
export default function handleCorrectItemClass(userselectItem, that) {
    //处理item正确的class
    switch (userselectItem) {
        case 'A':
            that.setData({
                item1classControl: 'SelectItemCorrect',
                buttonBindTap: ''
            })
            break;
        case 'B':
            that.setData({
                item2classControl: 'SelectItemCorrect',
                buttonBindTap: ''
            })
            break;
        case 'C':
            that.setData({
                item3classControl: 'SelectItemCorrect',
                buttonBindTap: ''
            })
            break;
        case 'D':
            that.setData({
                item4classControl: 'SelectItemCorrect',
                buttonBindTap: ''
            })
            break;
    }
}