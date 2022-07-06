// components/down-menu/down-menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Object,
      value: {}
    }, 
    list: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isDown:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeMenu() {
      this.setData({
        isDown: !this.data.isDown,
      })
      this.changeMask()
    },
    changeMask() {
      this.setData({
        isMask: !this.data.isMask
      })
    },
    checkedMenu(e) {
      let {
        item
      } = e.currentTarget.dataset
      this.triggerEvent('change', item);
      this.changeMenu()
    },
    
    //防止触摸穿透
    stopTouch(e){
      return false
    },
  }
})