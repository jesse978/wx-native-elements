/*
 * @Description:
 * @Author: Jesse
 * @Date: 2021-05-07 10:07:29
 * @LastEditTime: 2022-03-24 13:46:12
 * @FilePath: \cpmsma-v1\components\picker-problem-type\picker-problem-type.js
 * @LastEditors: Jesse
 */
// components/picker-problem-type/picker-problem-type.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    defaultData: {
      type: Array,
      value: [0, 0, 0],
    },
    pickerType: {
      type: Number,
      value: 3,
    },
    typeList: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    reasonList: [],
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      const { defaultData } = this.data;
      while (defaultData.length < 3) {
        defaultData.push(0);
      }
      const PROBLEM_REASON_TYPE_V2 = wx.getStorageSync("DICT").PROBLEM_REASON_TYPE_V2;
      let firstChild = PROBLEM_REASON_TYPE_V2[defaultData[0]],
        checkedType = firstChild,
        checkedReasonType = firstChild.list[defaultData[1]],
        reasonList = firstChild.list[defaultData[2]].list;
      this.setData({
        typeList: PROBLEM_REASON_TYPE_V2,
        checkedType,
        checkedReasonType,
        reasonList,
      });
    },
    moved: function () {},
    detached: function () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.triggerEvent("cancel");
    },
    save() {
      const { checkedType, checkedReasonType, reasonList } = this.data;
      let arr = reasonList.filter(v => v.checked);
      console.log({ type: checkedType, reasonType: checkedReasonType, reason: arr });
      this.triggerEvent("save", { type: checkedType, reasonType: checkedReasonType, reason: arr });
    },
    changeType(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedType: item,
        reasonList: item.list[0].list,
        checkedReasonType: {},
      });
    },
    changeReasonType(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedReasonType: item,
        reasonList: item.list || [],
      });
    },
    changeReason(e) {
      let { item, index } = e.currentTarget.dataset;
      this.setData({
        [`reasonList[${index}].checked`]: !item.checked,
      });
    },
    preventTouchMove() {},
  },
});
