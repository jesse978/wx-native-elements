import { Toast } from "../../utils/wxUtil";
Component({

  properties: {
    slotParam: {
      type: Number,
      value: 0,
    },
    type: {
      type: String,
      value: 'switch'
    }
  },

  data: {

  },

  methods: {

    switchChange(e) {
      let { type, slotParam } = this.data
      switch (type) {
        case 'switch':
          var state = e.detail.value ? 1 : 0;
          break;
        case 'button':
          var { state } = e.currentTarget.dataset;
          break;
        case 'weight':
          var state = +e.detail.value;
          if (state < 1 || state > 100) return Toast.showToast('权重最小值为1%, 最大值为100%')
          break;
      }
      if (state == slotParam) return
      this.triggerEvent('switch', { state });
    },

  }
})
