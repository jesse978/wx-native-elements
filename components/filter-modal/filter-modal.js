/*
 * @Description:
 * @Author: Jesse
 * @Date: 2020-12-10 14:58:21
 * @LastEditTime: 2021-12-29 14:50:55
 * @LastEditors: Jesse
 */
// components/filter-modal/filter-modal.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: [Boolean, String],
      value: false,
    },
    title: {
      type: String,
      value: "筛选",
    },
    filterObj: {
      type: Object,
      value: {},
    },
    isCustom: {
      type: Boolean,
      value: false,
    },
    isReset: {
      type: Boolean,
      value: false,
    },
    isSave: {
      type: Boolean,
      value: true,
    },
    currentKey: {
      type: String,
      value: "remark",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgRoot: app.imgRoot,
    resetData: {}, //取消筛选后初始数据
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
  },
  observers: {
    visible(value) {
      //备份初始化数据
      if (!value) return;
      this.setData({
        resetData: JSON.parse(JSON.stringify(this.data.filterObj)),
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      //点击遮罩层取消筛选并还原上次数据
      this.setData({
        filterObj: JSON.parse(JSON.stringify(this.data.resetData)),
      });
      this.triggerEvent("close");
    },
    changeFilter() {
      this.triggerEvent("change", { data: this.data.filterObj });
      this.triggerEvent("close");
    },
    itemClick(e) {
      let { item, type } = e.currentTarget.dataset;
      this.setData({
        [`filterObj.${type}.checked`]: item.remark,
      });
      this.triggerEvent("click", { item, type, filterObj: this.data.filterObj });
    },
    reset() {
      this.triggerEvent("reset");
    },
    //阻止冒泡
    stopTap() {},
    
  },
});
