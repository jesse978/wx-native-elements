/*
 * @Description: 
 * @Author: Jesse
 * @Date: 2020-12-09 14:41:45
 * @LastEditTime: 2021-05-15 10:43:34
 * @FilePath: \cpmsma-v1\components\qt-change-input\qt-change-input.js
 * @LastEditors: Jesse
 */
// components/qt-change-list/qt-change-list.js
const app = getApp()
Component({
  externalClasses: ['qt-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    //输入框类型
    inputType: {
      type: String,
      value: 'text'
      /**
       * text	文本输入键盘
       * number	数字输入键盘
       * idcard	身份证输入键盘
       * digit	带小数点的数字键盘
       */
    },
    //输入框初始值
    inputValue: {
      type: String,
      value: '属性值'
    },
    //文本标题
    title: {
      type: String,
      value: '标题'
    },
    maxlength:{
      type: Number,
      value: -1
    },
    icon:{
      type:String,
      value:'edit'
    },
    placeholder:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgRoot: app.imgRoot,
    isInput: false //控制是否显示输入框
  },

  /**
   * 组件的方法列表
   */
  methods: {
    focusInput() {
      //聚焦输入框
      this.setData({
        isInput: true
      })
      // this.triggerEvent('click', {value})
    },
    //实时输入响应事件
    changeValue(e) {
      let { value } = e.detail
      this.setData({
        inputValue: value
      })
      this.triggerEvent('change', {value})
    },
    //失焦事件
    loseFocus(e) {
      let { value } = e.detail
      //失焦事件触发保存
      this.setData({
        inputValue: value,
        isInput: false
      })
      this.triggerEvent('finish', {value})
    },
    iconClick(){
      this.triggerEvent('iconClick')
    },
  }
})
