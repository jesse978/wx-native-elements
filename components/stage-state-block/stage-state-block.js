/*
 * @Description:
 * @Author: Jesse
 * @Date: 2021-06-18 16:45:11
 * @LastEditTime: 2021-09-09 16:26:30
 * @FilePath: \cpmsma-v1\components\stage-state-block\stage-state-block.js
 * @LastEditors: Jesse
 */
// components/stage-state-block/stage-state-block.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /*
      0:未开始 
      1:最新阶段未开始 
      2:最新阶段进行中 
      3:最新阶段异常
      4:最新阶段完成
      5:前置阶段跳过 
      6:前置阶段进行中 
      7:前置阶段异常 
      8:前置阶段完成
    */
    type: {
      type: Number,
      value: 0,
    },
    state: {
      type: Number,
      value: 0,
    },
    showTag: {
      type: Boolean,
      value: false,
    },
    num: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
});
