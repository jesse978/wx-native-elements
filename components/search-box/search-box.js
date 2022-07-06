/*
 * @Description: 
 * @Author: Jesse
 * @Date: 2020-12-26 16:16:59
 * @LastEditTime: 2021-04-29 14:42:28
 * @LastEditors: Jesse
 */
// components/search-box/search-box.js
Component({
  externalClasses: ['qt-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: '',
    },
    placeholder:{
      type: String,
      value: '请输入搜索关键字',
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
    inputValue(e) {
      let { value } = e.detail
      this.setData({
        value,
      })
      this.triggerEvent('input', { value })
    },
    cleanValue() {
      this.setData({
        value: '',
      })
      this.triggerEvent('clean', { value:this.data.value })
    },
    blur(){
      this.triggerEvent('blur',{ value:this.data.value })
    },
    confirm(){
      this.triggerEvent('confirm',{ value:this.data.value })
    },
  },
})
