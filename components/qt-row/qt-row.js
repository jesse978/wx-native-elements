/*
 * @Description: 
 * @Author: Jesse
 * @Date: 2020-12-09 14:41:45
 * @LastEditTime: 2020-12-14 21:10:20
 * @LastEditors: Jesse
 */
const app = getApp()
Component({
    externalClasses: ['qt-class'],

    options: {
        addGlobalClass: true
    },

    data: {
        imgRoot: app.imgRoot,
    },

    properties: {
        // 左侧标题
        title: {
            type: String,
            value: '标题'
        },
        color: {
            type: String,
            value: '#2B2B2B;'
        },
        // 右侧内容
        content: {
            type: String,
            value: ''
        },
        // 列表类型，可选值 big, small
        type: {
            type: String,
            value: 'small'
        },
        // 是否显示右侧小箭头
        isLink: {
            type: Boolean,
            value: true
        },
        // 链接类型，可选值为 navigateTo, redirectTo, switchTab, reLaunch
        linkType: {
            type: String,
            value: 'navigateTo'
        },
        // 链接地址
        linkUrl: {
            type: String,
            value: ''
        },
        // Icon 图片路径
        iconUrl: {
            type: String,
            value: ''
        },
        hoverClass: {
            type: String,
            value: ''
        },
        item: {
            type: Object,
            value: {}
        },
        height:{
          type: [Number,String],
          value: 0
        },
    },

    methods: {
        // 跳转链接
        navigateTo () {
            const {linkUrl, isLink, linkType} = this.data;

            if (!linkUrl || !isLink) return;

            if (['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'].indexOf(linkType) === -1) {
                console.warn('linkType 属性可选值为 navigateTo，redirectTo，switchTab，reLaunch');
                console.log('接受到的值为：', linkType);
            }
            wx[linkType]({ url: linkUrl });
        },
        handleTap() {
            this.triggerEvent('click', this.data.item);
            this.navigateTo();
        }
    }
});
