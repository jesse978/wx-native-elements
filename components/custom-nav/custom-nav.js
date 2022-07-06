// components/custom-nav/custom-nav.js
Component({
  externalClasses: ['qt-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    background:{
      type:String,
      value:''
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({
        topMargin: wx.getStorageSync('topMargin')
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    topMargin: 0 //顶部边距
  },

  /**
   * 组件的方法列表
   */
  methods: {}
})
