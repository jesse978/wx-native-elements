/*
 * @Description:
 * @Author: Jesse
 * @Date: 2021-01-22 16:37:48
 * @LastEditTime: 2021-01-25 09:58:05
 * @LastEditors: Jesse
 */
// components/attachment-list/attachment-list.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    attachmentList: {
      type: Array,
      value: ['attachment_img', 'attachment_img2', 'attachment_img3'],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgRoot: app.imgRoot,
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showBigImg(e) {
      const { item } = e.currentTarget.dataset
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [`${this.data.imgRoot}/${item}.png`], // 需要预览的图片http链接列表
      })
    },
  },
})
