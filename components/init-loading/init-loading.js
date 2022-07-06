/*
 * @Description: 
 * @Author: Jesse
 * @Date: 2020-12-09 14:41:45
 * @LastEditTime: 2021-05-18 11:49:48
 * @FilePath: \cpmsma-v1\components\init-loading\init-loading.js
 * @LastEditors: Jesse
 */
// components/init-loadin/init-loadin.js
const app = getApp();
import { APPID_DICT } from "../../assets/data/constant";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示底标
    isLogo: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgRoot: app.imgRoot,
    appid: app.globalData.appid,
    APPID_DICT
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
