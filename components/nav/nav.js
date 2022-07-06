Component({

  properties: {
    datas: {
      type: Array,
      value: [],
    },
    navTab: {
      type: Number,
      value: 0,
    }
  },

  data: {

  },

  methods: {

    switchCategory(e) {
      let { index } = e.currentTarget.dataset
      this.triggerEvent('toggle', { index });
    }

  }
})
