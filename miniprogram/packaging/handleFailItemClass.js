export default function handleFailItemClass(userselectItem, that) {
    //处理item正确的class
    switch (userselectItem) {
        case 'A':
            that.setData({
                item1classControl: 'SelectItemFail',
                buttonBindTap: ''
            })
            break;
        case 'B':
            that.setData({
                item2classControl: 'SelectItemFail',
                buttonBindTap: ''
            })
            break;
        case 'C':
            that.setData({
                item3classControl: 'SelectItemFail',
                buttonBindTap: ''
            })
            break;
        case 'D':
            that.setData({
                item4classControl: 'SelectItemFail',
                buttonBindTap: ''
            })
            break;
    }
}