Component({
  externalClasses: ['qt-class'], 

  properties: {
      // 宽度
      width: {
          type: String,
          value: '360rpx'
      },
      // 可选值 left || right || center
      direction: {
          type: String,
          value: 'left'
      },
      // 是否显示
      isShow: {
          type: Boolean,
          value: false
      }
  },
  methods: {
      hidden () {
          this.setData({ isShow: false });
          this.triggerEvent('hiddenMask');
      },
      stopCatchTouch(){},
  }
});
