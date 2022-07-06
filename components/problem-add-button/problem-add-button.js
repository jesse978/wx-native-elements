/*
 * @Description:
 * @Author: Jesse
 * @Date: 2021-12-16 15:04:49
 * @LastEditTime: 2021-12-20 16:20:22
 * @FilePath: \cpmsext-v1\components\problem-add-button\problem-add-button.js
 * @LastEditors: Jesse
 */
// components/problem-add-float/problem-add-float.js
Component({
  externalClasses: ["qt-class"],

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
    addProblem() {
      this.triggerEvent("click");
      // wx.navigateTo({
      //   url: "/pages/backlog/add-installer-problem/add-installer-problem",
      // });
    },
  },
});
