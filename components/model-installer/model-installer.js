/*
 * @Description:
 * @Author: Jesse
 * @Date: 2021-05-07 18:07:44
 * @LastEditTime: 2021-05-07 18:33:32
 * @FilePath: \cpmsma-v1\components\model-installer\model-installer.js
 * @LastEditors: Jesse
 */
// components/model-installer/model-installer.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    total: 0,
    checkedInstaller: {},
    list: [],
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
  },
  observers: {
    visible(v) {
      if (v) {
        this.getInstallerList("new")
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent("close")
    },
    skip() {
      this.triggerEvent("save", {})
    },
    save() {
      this.triggerEvent("save", { id: this.data.checkedInstaller.id })
    },
    changeChecked(e) {
      let { item } = e.currentTarget.dataset
      this.setData({
        checkedInstaller: item,
      })
    },
    getInstallerList(type) {
      let { page, limit } = this.data
      let params = {
        page,
        limit,
        keyword: "",
      }
      app.wxRequest.POST.PROJECT.resetProcessInstaller(params).then(res => {
        this.setData({
          list: type === "new" ? res.list : [...this.data.list, ...res.list],
          total: res.total,
        })
      })
    },
    onload() {
      let { limit, page, total } = this.data
      if (limit * page > total) return
      this.setData({
        page: ++page,
      })
      this.getInstallerList()
    },
  },
})
