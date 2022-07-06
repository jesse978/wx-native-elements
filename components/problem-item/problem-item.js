/*
 * @Description:
 * @Author: Jesse
 * @Date: 2020-12-17 10:43:34
 * @LastEditTime: 2020-12-17 17:18:14
 * @LastEditors: Jesse
 */
// components/problem-item/problem-item.js
Component({
  externalClasses: ['qt-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    },
    isRoom:{
      type:Boolean,
      value:true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    problemDetail(e) {
      this.triggerEvent('click', { item: this.data.item })
    },
  },
})
