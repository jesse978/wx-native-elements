/*
 * @Description: 
 * @Author: Jesse
 * @Date: 2021-01-09 10:07:11
 * @LastEditTime: 2021-01-09 10:09:19
 * @LastEditors: Jesse
 */
// components/action-box/action-box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    //添加按钮
    addIssue() {
      wx.navigateTo({ url: '/pages/problem/add-problem/add-problem' })
    },
  },
})
