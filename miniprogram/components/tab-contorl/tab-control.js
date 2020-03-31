// Components/tab-contorl/tab-control.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        titles: {
            type: Array
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentIndex: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleClickTab(e) {
            const index = e.currentTarget.dataset.index
            this.setData({
                currentIndex: index
            })
            this.triggerEvent('sendIndex', { TabcurrentIndex: index })
        }
    },
    options: {
        multipleSlots: true
    }
})