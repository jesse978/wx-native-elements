Component({

  /**
   * 组件的属性列表
   */
  properties: {
    datas: {
      type: Array,
      value: []
    },
    navShow: {
      type: Boolean,
      value: false,
    },
    icon: {
      type: Boolean,
      value: false,
    },
    title: {
      type: Boolean,
      value: true,
    },
    add: {
      type: Boolean,
      value: false,
    },
    slotParam: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'switch'
    },
    contentFields: {
      type: String,
      value: 'processInfos'
    },
    padding: {
      type: Boolean,
      value: false
    }
  },

  data: {
    navTab: 0,
  },

  // observers: {
  //   'datas'(data) {
  //     console.log(data)
  //   }
  // },

  methods: {

    // 切换品类
    switchCategory(e) {
      let { index } = e.currentTarget.dataset
      this.setData({
        navTab: index
      })
    },

    // 兼容有nav或有title或只有一级内容的数据
    switch(e) {
      let { index, i } = e.currentTarget.dataset
      let { state } = e.detail
      let { datas, navTab, slotParam, navShow, title, contentFields } = this.data
      if (navShow) {
        datas[navTab].wrappers[index][contentFields][i][slotParam] = state
        datas[navTab].wrappers[index][contentFields][i].tag = true
      } else {
        switch (title) {
          case true:
            datas[index][contentFields][i][slotParam] = state
            datas[index][contentFields][i].tag = true
            break;
          default:
            datas[index][slotParam] = state
            datas[index].tag = true
            break;
        }
      }
      this.triggerEvent('toggle', { datas });
    },

    addPart() {
      this.triggerEvent('addPart')
    },

  },

  options: {
    multipleSlots: true
  }
})
