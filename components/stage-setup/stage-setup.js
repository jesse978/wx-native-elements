/*
 * @Description:
 * @Author: Jesse
 * @Date: 2021-12-07 17:14:16
 * @LastEditTime: 2022-04-07 17:24:42
 * @FilePath: \cpmsma-v1\components\stage-setup\stage-setup.js
 * @LastEditors: Jesse
 */
// pages/scene/components/setup/setup.js
const app = getApp();
Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },
    type: {
      type: String,
      value: "scene",
    },
  },

  data: {
    sortList: [
      { name: "从高到低", value: 1 },
      { name: "从低到高", value: 0 },
    ],
    actionList: [
      { name: "流程模板", event: "jumpManage" },
      { name: "产品类流程", event: "jumpEvents" },
      { name: "产品流程", event: "jumpProducts" },
      { name: "产品统计", event: "jumpAddCriteria" },
    ],
    userInfo: {},
  },
  lifetimes: {
    attached: function () {
      // let checkedSort = wx.getStorageSync("sortType") || this.data.sortList[0];
      // // let checkedSort = sortList.find(v => value == v) || sortList[0];
      this.setData({
        userInfo: app.globalData.userInfo,
      });
      // this.filterList();
    },
  },
  methods: {
    // filterList() {
    //   let arr = [
    //     { name: "流程模板", event: "jumpManage" },
    //     { name: "产品类流程", event: "jumpEvents" },
    //     { name: "产品流程", event: "jumpProducts" },
    //     { name: "产品统计", event: "jumpAddCriteria" },
    //   ];
    //   if (this.data.userInfo.opRange) {
    //     this.setData({
    //       actionList: arr,
    //     });
    //   } else {
    //     this.setData({
    //       actionList: arr,
    //     });
    //   }
    // },
    // 跳转添加条件
    jumpManage(e) {
      let { item } = e.currentTarget.dataset;
      console.log(item);
      wx.navigateTo({
        url: `/pages/scene/condition-library/condition-library?stageId=${item.id}`,
      });
    },

    // 跳转条件组合管理
    jumpAddCriteria(e) {
      let { item, dataType = 1 } = e.currentTarget.dataset;
      if ([1, 12, 13].includes(item.stage)) dataType = 2;
      if (item.eventNum < 1) return app.Toast.showToast("请到流程模板开启流程");
      wx.navigateTo({
        url: `/pages/scene/criteria/criteria?type=${this.data.type}&stageId=${item.id}&stage=${item.stage}&dataType=${dataType}`,
      });
    },
    //跳转安装页面
    jumpInstallPage(e) {
      let { item, dataType = 3 } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/install/installed/installed?type=${this.data.type}&stageId=${item.id}&stage=${item.stage}&dataType=${dataType}`,
      });
    },
    // 跳转事件管理
    jumpEvents(e) {
      let { item } = e.currentTarget.dataset;
      if (item.eventNum < 1) return app.Toast.showToast("请到流程模板开启流程");
      wx.navigateTo({
        url: `/pages/scene/tube-event/tube-event?stageId=${item.id}&stage=${item.stage}`,
      });
    },

    // 跳转产品管理
    jumpProducts(e) {
      let { item } = e.currentTarget.dataset;
      if (item.eventNum < 1) return app.Toast.showToast("请到流程模板开启流程");

      wx.navigateTo({
        url: `/pages/scene/pipe-products/pipe-products?type=${this.data.type}&stageId=${item.id}&stage=${item.stage}`,
      });
    },
    jumpParts() {
      wx.navigateTo({
        url: "/pages/products/setup/main-part/main-part",
      });
    },
    changeSort(e) {
      const { value } = e.detail;
      const { sortList } = this.data;
      let checkedSort = sortList[Number(value)];
      this.setData({
        checkedSort,
      });
      wx.setStorageSync("sortType", checkedSort);
      this.triggerEvent("refresh");
    },
    jumpIsMainBody() {
      wx.navigateTo({
        url: "/pages/install/setup/mainbody/mainbody",
      });
    },
    jumpInBulk() {
      let item = this.data.list[0];
      wx.navigateTo({
        url: `/pages/install/setup/process-batch/process-batch?stageId=${item.id}&stage=${item.stage}`,
      });
    },
    jumpInspect() {
      let item = this.data.list[0];
      wx.navigateTo({
        url: `/pages/install/setup/process-inspect/process-inspect?stageId=${item.id}&stage=${item.stage}`,
      });
    },
    jumpProductsWeight() {
      let item = this.data.list[0];
      wx.navigateTo({
        url: `/pages/install/setup/product-weight/product-weight?stageId=${item.id}&stage=${item.stage}`,
      });
    },
    jumpProcessesWeight() {
      let item = this.data.list[0];
      wx.navigateTo({
        url: `/pages/install/setup/process-weight/process-weight?stageId=${item.id}&stage=${item.stage}`,
      });
    },
  },
});
