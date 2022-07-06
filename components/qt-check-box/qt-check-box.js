/*
 * @Description: 
 * @Author: Jesse
 * @Date: 2020-12-09 14:41:45
 * @LastEditTime: 2021-04-22 11:00:31
 * @FilePath: \cpmsma-v1\components\qt-check-box\qt-check-box.js
 * @LastEditors: Jesse
 */
// components/qt-check-box/qt-check-box.js
Component({
  // externalClasses: ['check_box'],
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false,
    },
    disable: {
      type: Boolean,
      value: true,
    },
    size:{
      type: Number,
      value: 40,
    },
    checkedSide: {
      type: Boolean,
      value: false,
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
    changeChecked() {
      let checked = !this.data.checked
      this.setData({
        checked
      })
      this.triggerEvent('change', { value: checked })
    },
  },
})
