/*
 * @Description:
 * @Author: Jesse
 * @Date: 2022-02-17 16:23:31
 * @LastEditTime: 2022-04-01 17:17:26
 * @FilePath: \cpmsma-v1\components\group-room\group-room.js
 * @LastEditors: Jesse
 */
// components/group-room/group-room.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //模块类型 0:看板 1:现场 3:安装
    type: {
      type: Number,
      value: 0,
    },
    stageId: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    composeDICT: {
      0: [9],
      1: [1],
      2: [6],
      3: [2],
    },
    groupList: [], //组合列表
    checkedGroup: {}, //当前选择组合
    groupId: "", //默认选择ID
  },
  lifetimes: {
    attached() {
      let { type, composeDICT } = this.data;
      this.setData({
        // composeTypes: composeDICT?.[type] || [],
        composeTypes: [1],
      });
      this.getGroupData();
    },
  },
  pageLifetimes: {
    // show: function () {
    //   if (!this.data.stageId) return;
    //   // 页面被展示
    //   this.getGroupData();
    // },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取组合数据
    getGroupData() {
      let { type, composeTypes, stageId = "" } = this.data;
      app.wxRequest.POST.INSTALL.combine({
        stageId,
        composeTypes,
        installable: type === 3 ? 1 : -1,
      }).then(res => {
        if (res.length) {
          this.setData({
            groupList: res,
            checkedGroup: res.find(v => v.id == this.data.groupId) || res[0],
          });
        }
      });
    },
    // 房间组合管理
    groupManage() {
      wx.navigateTo({
        url: `/pages/common/group/group?composeType=${this.data.composeTypes}`,
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
