// components/off-line-msg/off-line-msg.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示
    isShow: {
      type: Boolean,
      value: false,
    },
    logo: {
      type: String,
      value: '',
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
    hidden() {
      this.setData({ isShow: false })
      this.triggerEvent('hiddenMask')
    },
    viewDetail() {
      app.Toast.showToast('暂无详情，请联系客服处理')
    },
    gotoHome() {
      // wx.reLaunch({ url: '/pages/homepage/homepage' });
      wx.navigateBack({
        delta: 1, //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      })
    },
    stopCatchTouch() {},
  },
})
