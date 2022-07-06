// components/qt-message/qt-message.js
Component({
  externalClasses: ['qt-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value:'标题'
    },
    date:{
      type: String,
      value:'日期'
    },
    time:{
      type: String,
      value:'时间'
    },
    info:{
      type: String,
      value:'详情'
    },
    isDetail:{
      type: Boolean,
      value:true
    },
    state:{
      //可选值 info success error warning
      type: String,
      value:'error'
    },
    stateLabel:{
      type: String,
      value:''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(){
      if(!this.data.isDetail) return false
      console.log('click')
      this.triggerEvent('click')
    },
  }
})
