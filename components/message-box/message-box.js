// components/message-box.js
const app = getApp()

Component({
  externalClasses: ['qt-class',"img-class"],
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: String,
      value: ''
    },
    messageText: { 
      type: String, 
      value: '暂无数据'
     },
     isClick:{
       type:Boolean,
       value:false
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
    click(){
      this.triggerEvent('click');
    },
  }
})
