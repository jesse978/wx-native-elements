Component({
  properties: {

  },

  data: {

  },

  methods: {
    confirm(){
      this.triggerEvent('confirm')
    },
    cancel(){
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})
