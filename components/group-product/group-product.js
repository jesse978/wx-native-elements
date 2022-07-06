/*
 * @Description:
 * @Author: Jesse
 * @Date: 2022-02-17 16:23:31
 * @LastEditTime: 2022-03-30 18:10:51
 * @FilePath: \cpmsma-v1\components\group-product\group-product.js
 * @LastEditors: Jesse
 */
// components/group-product/group-product.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //模块类型 0:看板 1:现场 2:产品 3:安装
    type: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    composeDICT: {
      0: [10],
      1: [7],
      2: [8],
      3: [4],
    },
    groupList: [], //组合列表
    checkedGroup: {}, //当前选择组合
    groupId: "", //默认选择ID
  },
  lifetimes: {
    attached() {
      let { type, composeDICT } = this.data;
      let currentProject = wx.getStorageSync("currentProject");
      this.setData({
        // composeTypes: composeDICT?.[type] || [],
        composeTypes: [7],
        currentProject,
      });
      this.getGroupData();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取组合数据
    getGroupData() {
      let { composeTypes } = this.data;
      app.wxRequest.POST.INSTALL.combine({
        composeTypes,
      }).then(res => {
        if (res.length) {
          // res = res.filter(v => v.productNum > 1);
          this.setData({
            groupList: res,
            checkedGroup: res.find(v => v.id == this.data.groupId) || res[0],
          });
        }
      });
    },
    //组合管理
    groupManage() {
      wx.navigateTo({
        url: `/pages/common/group-product-manage/group-product-manage?composeType=${this.data.composeTypes}`,
        events: {
          homePageUpdate: ({ id }) => {
            this.setData({
              groupId: id,
            });
            this.triggerEvent("change", { id });
            this.getGroupData();
          },
        },
      });
    },
    changeGroup(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedGroup: item,
      });
      this.triggerEvent("change", { id: item.id });
    },
  },
});
