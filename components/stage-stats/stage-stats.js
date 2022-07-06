//Page Object
//Component Object
const app = getApp();
Component({
  properties: {
    projectId: {
      type: String,
      value: "",
    },
    type: {
      //[1,2,3]现场，产品，安装
      type: Number,
      value: 0,
    },
    stageInfo: {
      type: Object,
      value: {},
    },
    isProblem: {
      type: Boolean,
      value: false,
    },
    info: {
      type: String,
      value: "",
    },
  },
  data: {
    page: 1,
    limit: 20,
    //组合列表
    groupList: [],
    batchId: "",
    groupState: true,
    groupPopup: true,
    productGroupId: "",
    typeArr: [
      { name: "主体", remark: 1 },
      { name: "配套", remark: 0 },
    ],
    typeIndex: 0,
    roomList: [],
    state: 0,
    timeIndex: 4,
    recentDay: 7,
    timeList: [
      {
        txt: "更新时间选择",
        remark: 0,
      },
      {
        txt: "近一天更新",
        remark: 1,
      },
      {
        txt: "近三天更新",
        remark: 3,
      },
      {
        txt: "近五天更新",
        remark: 5,
      },
      {
        txt: "近七天更新",
        remark: 7,
      },
    ],
    stageDICT: {
      7: [
        { name: "出图", val: 6 },
        { name: "转图", val: 7 },
      ],
      8: [
        { name: "下单", val: 8 },
        { name: "排产", val: 9 },
        { name: "入库", val: 10 },
        { name: "出仓", val: 11 },
      ],
      9: [
        { name: "到场", val: 12 },
        { name: "清点", val: 13 },
      ],
    },
    checkedItem: {},
    checkedTeam: {},
    checkedPeople: {},
  },
  observers: {
    "projectId,stageInfo": function (id, info) {
      if (!id || !info) return;
      if (id === this.data.oldId && info.id === this.data.oldInfo.id) return;
      this.setData({
        oldId: id,
        oldInfo: info,
        statInfo: info.statInfo,
      });
      this.initData();
    },
  },
  methods: {
    initData() {
      let { stageInfo, info } = this.data,
        state = 0;
      if ([1, 12, 13].includes(stageInfo.stage)) {
        state = -1;
      }
      if (info == "backlog") {
        state = 0;
      }
      if (info == "recheck") {
        this.setData({
          timeIndex: 0,
          recentDay: 0,
        });
      }
      this.setData({
        tableData: [],
        checkedItem: {},
        state,
        required: 1,
      });
      this.getTeamFilter(true);
      // this.getTeamFilter(false);
      this.getTableData();
      this.getBuildingFilter();
    },
    //isTeam 查询 班组||人员
    getTeamFilter(isTeam = true) {
      let { stageInfo, checkedTeam } = this.data;
      let params = {
        stageId: stageInfo.id,
        configType: isTeam ? 1 : 2,
        partnerId: isTeam ? "" : checkedTeam.id ?? "",
      };
      let headArr = [{ name: "全部", id: "", accid: "" }];
      app.wxRequest.POST.PRODUCT.getTeamFilter(params).then(res => {
        if (res) {
          if (isTeam) {
            this.setData({
              teamFilter: headArr.concat(res),
              checkedTeam: headArr[0],
            });
          } else {
            this.setData({
              peopleFilter: headArr.concat(res),
              checkedPeople: headArr[0],
            });
          }
        }
      });
    },
    getTableData() {
      let { productGroupId, batchId, state, stageInfo, statInfo, required, recentDay, info, checkedTeam, checkedPeople } = this.data;
      app.wxRequest.POST.PRODUCT.productStats({
        eventState: state,
        productGroupId,
        batchId,
        stageId: stageInfo.id,
        statType: statInfo.dataType,
        coreRequired: required,
        responseType: info == "backlog" ? -1 : state === -1 ? 2 : 1,
        recentDay: recentDay,
        groupQueryType: info == "backlog" ? 3 : 1,
        partnerId: checkedTeam.id || "",
        installer: checkedPeople.accid || "",
      }).then(res => {
        if (res) {
          // let list = res.filter(v => {
          //   return v.itemInfos.filter(item => item.total > -1).length;
          // });
          // this.setData({
          //   tableData: list,
          //   checkedItem: {},
          // });
          this.setData({
            tableHead: res.productGroupHeads,
            tableData: res.productGroupInfos,
            statTypes: res.statInfo.statTypes,
          });
        }
      });
    },

    //楼栋筛选条件
    getBuildingFilter() {
      let { batchId, productGroupId, checkedItem, state, stageInfo, info, checkedTeam, checkedPeople } = this.data;
      let params = {
        stageId: stageInfo.id,
        batchId,
        productGroupId,
        groupType: 14,
        eventState: state,
        productTag: checkedItem.productTag || "",
        eventGroupId: checkedItem.eventGroupId || "",
        partId: checkedItem.partId || "",
        eventId: checkedItem.eventId || "",
        productTags: checkedItem.productTags || [],
        statType: checkedItem.statType || 0,
        groupStatType: checkedItem.dataType || 0,
        groupEventIds: checkedItem.groupEventIds || [],
        groupEventState: state === -1 ? checkedItem.stageType ?? -1 : -1,
        eventNum: checkedItem.eventNum || 0,
        partIds: checkedItem.partIds || [],
        installableGroupIds: checkedItem.installableGroupIds || [],
        // statType: statInfo.dataType,
        // coreRequired: required,
        recentDay: checkedItem.recentDay || 0,
        // groupQueryType: info ? 3 : 1,
        partnerId: checkedTeam.id || "",
        installer: checkedPeople.accid || "",
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
      app.Toast.showLoading();
      //重置房间分页
      if (type === "new") {
        this.setData({
          page: 1,
          total: 0,
          scrollTop: 0,
        });
      }
      let { page, limit, state, productGroupId, checkedBuilding, batchId, floorFilter, roomFilter, roomList, isLoad, checkedItem, stageInfo, info, checkedTeam, checkedPeople } = this.data;
      if (isLoad) return; //防止重复请求
      this.data.isLoad = true;
      let params = {
        stageId: stageInfo.id,
        page,
        limit,
        groupType: 14,
        eventState: state,
        productTag: checkedItem.productTag || "",
        partId: checkedItem.partId || "",
        eventGroupId: checkedItem.eventGroupId || "",
        eventId: checkedItem.eventId || "",
        productTags: checkedItem.productTags || [],
        partIds: checkedItem.partIds || [],
        statType: checkedItem.statType || 0,
        groupStatType: checkedItem.dataType || 0,
        groupEventIds: checkedItem.groupEventIds || [],
        eventNum: checkedItem.eventNum || 0,
        groupEventState: state === -1 ? checkedItem.stageType ?? -1 : -1,
        installableGroupIds: checkedItem.installableGroupIds || [],
        batchId,
        productGroupId,
        buildingId: checkedBuilding.id,
        buildingTag: checkedBuilding.identityTag,
        nextTag: "",
        sort: 1,
        floorTags: [],
        roomTags: [],
        recentDay: checkedItem.recentDay || 0,
        partnerId: checkedTeam.id || "",
        installer: checkedPeople.accid || "",
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
          }
          this.setFilterStr();
        })
        .finally(f => {
          this.data.isLoad = false;
        });
    },

    // 跳转
    jumpToDo() {
      wx.navigateTo({
        url: "/pages/install/backlog/backlog",
      });
    },
    // 更新时间
    updateTime(e) {
      let { value } = e.detail;
      let { timeList, timeIndex } = this.data;
      if (value == timeIndex) return;
      this.setData({
        timeIndex: value,
        recentDay: timeList[value].remark,
        checkedItem: {},
      });
      this.getTableData();
      this.getBuildingFilter();
    },
    itemClick(e) {
      let { item, row } = e.currentTarget.dataset;
      if (item.total < 0) return;
      item.partId = row.partId;
      item.productTag = row.productTag;
      item.installableGroupIds = row.installableGroupIds;
      this.setData({
        checkedItem: item,
      });
      this.getBuildingFilter();
    },
    changeTeamModel() {
      this.setData({
        isTeamShow: !this.data.isTeamShow,
      });
    },
    saveTeamFilter() {
      this.getTableData();
      this.getBuildingFilter();
    },
    teamClick(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedTeam: item,
      });
      if (item.id) {
        this.getTeamFilter(false);
      } else {
        this.setData({
          peopleFilter: [],
          checkedPeople: {},
        });
      }
    },
    peopleClick(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedPeople: item,
      });
    },
    changeGroup(e) {
      let { id } = e.detail;
      this.setData({
        batchId: id,
        checkedItem: {},
      });
      this.getTableData();
      this.getBuildingFilter();
    },
    changeProduct(e) {
      let { id } = e.detail;
      this.setData({
        productGroupId: id,
      });
      this.getTableData();
      this.getBuildingFilter();
    },
    foldUpGroup() {
      this.setData({
        isGroupHide: !this.data.isGroupHide,
      });
    },
    changeState(e) {
      let { value } = e.currentTarget.dataset;
      this.setData({
        state: Number(value),
        checkedItem: {},
      });
      this.getTableData();
      this.getBuildingFilter();
    },

    changePartShow(e) {
      let { item, index } = e.currentTarget.dataset;
      if (!item.groupStateVisible) return;
      this.setData({
        [`tableData[${index}].hidePart`]: !item.hidePart,
      });
    },
    //主体||配套
    changeType(e) {
      const { key } = e.detail;
      this.setData({
        required: Number(key),
        checkedItem: {},
      });
      this.getTableData();
      this.getBuildingFilter();
    },
    /* 进入房间详情 */
    roomDetail(e) {
      let { item, floorIndex } = e.currentTarget.dataset;
      if (this.data.info == "backlog") return;
      this.setData({
        floorIndex,
      });
      let title = `${item.building}栋${item.unit ? item.unit + "单元" : ""}${item.floor}F${item.alias || item.name}`;
      if (this.data.info !== "recheck") {
        wx.navigateTo({
          url: `/pages/project/project-detail/room-detail/stage-detail?id=${item.id}&title=${title}&required=${this.data.required}&stageId=${this.data.stageInfo.id}&stage=${this.data.stageInfo.stage}`,
        });
      } else {
        wx.navigateTo({
          url: `/pages/project/project-detail/room-detail/recheck-detail/recheck-detail?id=${item.id}&title=${title}&required=${this.data.required}&stageId=${this.data.stageInfo.id}&stage=${this.data.stageInfo.stage}`,
        });
      }
    },
    changeBuilding(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedBuilding: item,
        floorFilter: item.floorInfos,
        roomFilter: item.roomInfos,
      });
      this.getRoomData("new");
    },

    batchOperation() {
      wx.navigateTo({
        url: `../common/batch-stage/batch-stage?required=${this.data.required}&stageId=${this.data.stageInfo.id}&stage=${this.data.stageInfo.stage}`,
        success: result => {
          //合并参数列表并传入问题页面
          result.eventChannel.emit("params", { oldParams: this.data.oldParams });
        },
      });
    },
    addProblem() {
      wx.navigateTo({
        url: "/pages/common/submit-issue/submit-issue",
        success: result => {
          //合并参数列表并传入问题页面
          result.eventChannel.emit("params", { type: 1, pageData: this.data.stageInfo.stage == 1 ? "scene" : "", stage: this.data.stageInfo.stage, oldParams: this.data.oldParams });
        },
      });
    },
    /* 楼层筛选 */
    changeFloorFilter(e) {
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
    // 房间筛选重置
    resetRoomFilter() {
      let { roomFilter } = this.data;
      roomFilter.forEach(e => (e.checked = false));
      this.setData({
        roomFilter,
      });
      this.setFilterStr();
    },
    refreshData() {
      this.changeRefresh();
      setTimeout(v => {
        this.changeRefresh();
      }, 500);
      this.setData({
        checkedItem: {},
      });
      this.getTableData();
      this.getBuildingFilter();
    },
    changeRefresh() {
      this.setData({
        isRefresh: !this.data.isRefresh,
      });
    },
    dataLoad() {
      let { page, limit, total } = this.data;
      if (limit * page > total) return;
      this.setData({
        page: ++page,
      });
      this.getRoomData();
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
  },
});
