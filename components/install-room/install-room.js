/*
 * @Description:
 * @Author: Jesse
 * @Date: 2022-03-14 13:56:54
 * @LastEditTime: 2022-03-14 14:26:17
 * @FilePath: \cpmsma-v1\components\install-room\install-room.js
 * @LastEditors: Jesse
 */
// components/install-room/install-room.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    limit: 20,
    total: 0,
    currentTab: 0,
    groupList: [],
    batchId: "",
    productGroup: [],
    checkedProductGroup: {},
    state: 0,
    isHide: false,
    tableHead: [],
    tableData: [],
    checkedProduct: {},
    checkedItem: {},
    roomList: [],
    stageList: ["更新时间选择", "近1天更新", "近3天更新", "近5天更新", "近7天更新"],
    stageIndex: 0,
    stateArr: [
      // { name: "房态", remark: 3 },
      { name: "已安装", remark: 2 },
      { name: "未安装", remark: 0 },
    ],
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.initData();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData() {
      // this.getGroupData();
      this.getProductGroup();
    },
    //tab切换事件
    tabChange(e) {
      const { key } = e.detail;
      this.setData({
        currentTab: Number(key),
      });
      this.initData();
    },
    //组合条件
    // getGroupData() {
    //   let params = {
    //     composeTypes: [2],
    //     installable: 1,
    //   };
    //   app.wxRequest.POST.INSTALL.combine(params).then(res => {
    //     if (res) {
    //       this.setData({
    //         groupList: res,
    //         checkedGroup: res.find(v => v.id == this.data.groupId) || res[0],
    //       });
    //     }
    //   });
    // },
    getProductGroup() {
      let params = { composeTypes: [this.data.currentTab ? 5 : 3], selected: true };
      app.wxRequest.POST.INSTALL.roomProductGroup(params).then(res => {
        if (res) {
          this.setData({
            productGroup: res,
            checkedProductGroup: res.find(v => v.id == this.data.productGroupId) || res[0],
          });
          if (res.length > 0) {
            this.getTableData();
          }
        }
      });
    },
    getTableData() {
      let { batchId, checkedProductGroup, state } = this.data;
      let params = { productGroupId: checkedProductGroup?.id || "", batchId, processState: state };
      app.wxRequest.POST.INSTALL.roomTableData(params).then(res => {
        res.productGroupInfos.forEach(v => (v.id = v.productId));
        let totalObj = res.productGroupInfos.pop();
        this.setData({
          tableHead: res.productGroupHeads,
          tableData: res.productGroupInfos,
          totalObj,
        });
      });
      this.getBuildingFilter();
    },
    // 更新时间
    updateTime(e) {
      let { value } = e.detail;
      this.setData({
        stageIndex: value,
      });
    },
    //楼栋筛选条件
    getBuildingFilter() {
      let { checkedProduct, checkedItem, batchId, checkedProductGroup, state } = this.data;
      let params = {
        productTag: checkedProduct?.productTag || "",
        groupType: checkedProduct.groupType ?? 4,
        processAllNum: checkedItem.processAllNum || 0,
        productGroupId: checkedProductGroup.id || "",
        processIds: checkedItem.processIds || [],
        processState: state,
        processNum: checkedItem.processNum || 0,
        batchId,
        stageType: checkedItem.stageType ?? -1,
      };
      app.wxRequest.POST.SCENE.sceneBuildingFilter(params).then(res => {
        if (res) {
          let checkedBuilding = res.buildings[0] || {};
          let { floorInfos = [], roomInfos = [] } = checkedBuilding;
          this.setData({
            buildingFilter: res.buildings,
            checkedBuilding,
            floorFilter: floorInfos,
            roomFilter: roomInfos,
          });
          //切换至无楼栋时清空房间数据并return
          if (res.buildings.length < 1) {
            this.setData({
              roomList: [],
              roomNum: 0,
            });
            return;
          }
          this.getRoomData("new");
        }
      });
    },
    //获取房间数据
    getRoomData(type) {
      //重置房间分页
      if (type === "new") {
        this.setData({
          page: 1,
          total: 0,
          scrollTop: 0,
        });
      }
      let { page, limit, checkedProduct, checkedItem, checkedBuilding, checkedProductGroup, state, batchId, floorFilter, roomFilter, roomList, isLoad } = this.data;
      if (isLoad) return; //防止重复请求
      this.data.isLoad = true;
      let params = {
        page,
        limit,
        productTag: checkedProduct?.productTag || "",
        groupType: checkedProduct.groupType ?? 4,
        productGroupId: checkedProductGroup.id || "",
        processIds: checkedItem.processIds || [],
        processAllNum: checkedItem.processAllNum || 0,
        processState: state,
        stageType: checkedItem.stageType ?? -1,
        processNum: checkedItem.processNum || 0,
        batchId,
        buildingId: checkedBuilding.id,
        buildingTag: checkedBuilding.identityTag,
        floorTags: [],
        roomTags: [],
      };

      //添加楼层筛选项，按最少匹配原则
      floorFilter.forEach(v => {
        v.checked && params.floorTags.push(v.name);
      });
      //添加房间筛选条件
      roomFilter.forEach(v => {
        v.checked && params.roomTags.push(v.name);
      });
      //获取数据特殊标识符
      let lastFloor = roomList[roomList.length - 1] || {};
      if (type !== "new" && lastFloor.hasOwnProperty("roomInfos")) {
        let length = lastFloor.roomInfos.length;
        params.nextTag = lastFloor.roomInfos[length - 1].nextTag;
      }
      app.Toast.showLoading();
      app.wxRequest.POST.SCENE.sceneRoomData(params)
        .then(res => {
          if (res) {
            app.Toast.hideLoading();
            this.setData({
              roomList: type === "new" ? res.list : [...roomList, ...res.list],
              total: res.total,
              roomNum: res.extra.data,
              oldParams: params,
            });
            this.setFilterStr();
          }
        })
        .finally(f => {
          this.data.isLoad = false;
        });
    },
    //单元格点击事件
    cellClick(e) {
      let { item, product } = e.currentTarget.dataset;
      this.setData({
        checkedItem: item,
        checkedProduct: product,
      });
      this.getBuildingFilter();
    },
    //表格收起
    changeHide() {
      this.setData({
        isHide: !this.data.isHide,
      });
    },
    changeState(e) {
      let { value } = e.currentTarget.dataset;
      this.setData({
        state: Number(value),
      });
      this.getTableData();
    },
    changeGroup(e) {
      let { id } = e.detail;
      this.setData({
        batchId: id,
      });
      this.getTableData();
    },

    changeProductGroup(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedProductGroup: item,
      });
      this.getTableData();
    },
    jumpGroup() {
      wx.navigateTo({
        url: `/pages/install/series/series?composeType=${this.data.currentTab ? "5" : "3"}`,
        events: {
          change: ({ id }) => {
            this.setData({
              productGroupId: id,
              [`checkedProductGroup.id`]: id,
            });
            this.getProductGroup();
          },
        },
      });
    },
    // jumpAddToMix() {
    //   wx.navigateTo({
    //     url:`../series-kind/series-kind?composeType=${this.data.currentTab ? "5" : "3"}&genre=1`
    //   });
    // },
    changeBuilding(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedBuilding: item,
      });
      this.getRoomData("new");
    },
    /* 楼层筛选 */
    changeFloorFilter(e) {
      this.setFilterStr();
      this.getRoomData("new");
    },
    floorClick(e) {
      let { index, item } = e.currentTarget.dataset;
      this.setData({
        [`floorFilter[${index}].checked`]: !item.checked,
      });
    },

    showFloorModel() {
      this.setData({
        floorShow: true,
      });
    },
    closeFloorModel() {
      this.setData({
        floorShow: false,
      });
    },
    // 楼层筛选重置
    resetFloorFilter() {
      let { floorFilter } = this.data;
      floorFilter.forEach(e => (e.checked = false));
      this.setData({
        floorFilter,
      });
      this.setFilterStr();
    },

    /* 房号筛选 */
    changeRoomFilter(e) {
      this.setFilterStr();
      this.getRoomData("new");
    },
    roomClick(e) {
      let { index, item } = e.currentTarget.dataset;
      this.setData({
        [`roomFilter[${index}].checked`]: !item.checked,
      });
    },

    showRoomModel() {
      this.setData({
        roomShow: true,
      });
    },
    closeRoomModel() {
      this.setData({
        roomShow: false,
      });
    },
    roomDetail(e) {
      let { item } = e.currentTarget.dataset;
      let title = `${item.building}栋${item.unit ? item.unit + "单元" : ""}${item.floor}F${item.alias || item.name}`;
      wx.navigateTo({
        url: `/pages/install/install-room-detail/install-room-detail?title=${title}&id=${item.id}`,
      });
    },
    // 楼层筛选重置
    resetRoomFilter() {
      let { roomFilter } = this.data;
      roomFilter.forEach(e => (e.checked = false));
      this.setData({
        roomFilter,
      });
      this.setFilterStr();
    },
    addProblem() {
      wx.navigateTo({
        url: "/pages/common/submit-issue/submit-issue",
        success: result => {
          //合并参数列表并传入问题页面
          result.eventChannel.emit("params", {
            type: 1,
            stage: 7,
            checkedProduct: this.data.checkedProduct,
          });
        },
      });
    },
    refreshData() {
      this.changeRefresh();
      setTimeout(v => {
        this.changeRefresh();
      }, 500);
      // this.getProductStats();
      this.getRoomData("new");
    },
    //动态计算筛选标题
    setFilterStr() {
      let { floorFilter, roomFilter } = this.data;
      let strArr = [],
        floors = [],
        rooms = [];
      floorFilter?.forEach(v => (v.checked ? floors.push(v.alias || v.name) : ""));
      roomFilter?.forEach(v => (v.checked ? rooms.push(v.alias || v.name) : ""));
      if (floors.length) strArr.push(floors.join(",") + "层");
      if (rooms.length) strArr.push(rooms.join(",") + "房");
      this.setData({
        filterStr: strArr.length ? ` # ${strArr.join("; ")}` : "",
      });
    },
    onReachBottom() {
      let { page, limit, total } = this.data;
      if (limit * page > total) return;
      this.setData({
        page: ++page,
      });
      this.getRoomData();
    },
  },
});
