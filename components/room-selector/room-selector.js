// components/room-selector/room-selector.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    //0多选 1单选
    mode: {
      type: Number,
      value: 0,
    },
    //0选中1筛选
    type: {
      type: Number,
      value: 1,
    },
    extraParams: {
      type: Object,
      value: null,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    buildingList: [],
    buildingIndex: 0,
    unitIndex: 0,
    roomTotal: 0,
    isAll: false,
  },
  lifetimes: {
    attached: function () {
      let { mode = 0, productTag = "" } = this.data;
      this.setData({
        mode: Number(mode),
        productTag,
      });
      this.getBuliding();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent("close");
    },
    //楼栋筛选
    getBuliding() {
      const currentProject = wx.getStorageSync("currentProject");
      let { isAll, productTag, extraParams } = this.data;
      let params = {
        projectId: currentProject.projectId,
        productTag,
        roomRequest: isAll ? null : extraParams,
      };
      app.wxRequest.POST.SCENE.batchActionRoomList(params).then(res => {
        if (res.length) {
          if (params.roomRequest == null) {
            res.forEach(v => {
              v.cacheData = JSON.parse(JSON.stringify(v.unitInfos));
            });
          } else {
            if (this.data.type == 1) {
              res.forEach(v => {
                v.unitInfos.forEach(unit => {
                  unit.floorInfos.forEach(floor => {
                    floor.roomInfos = floor.roomInfos.filter(room => room.selected);
                  });
                  unit.floorInfos = unit.floorInfos.filter(floor => floor.roomInfos.length > 0);
                });
                v.unitInfos = v.unitInfos.filter(unit => unit.floorInfos.length > 0);
                v.cacheData = JSON.parse(JSON.stringify(v.unitInfos));
              });
              res.filter(e => e.unitInfos);
              res = res.filter(e => e.unitInfos.length > 0);
            } else {
              res.forEach(v => {
                v.unitInfos.forEach(unit => {
                  unit.floorInfos.forEach(floor => {
                    floor.roomInfos.forEach(room => {
                      room.checked = room.selected;
                    });
                    floor.checked = floor.roomInfos.filter(v => v.checked).length === floor.roomInfos.length;
                  });
                });
                v.cacheData = JSON.parse(JSON.stringify(v.unitInfos));
              });
            }
          }
          this.setData({
            buildingList: res,
            checkedBuilding: res[0],
            buildingIndex: 0,
            unitIndex: 0,
          });
          this.updateTotal();
          // this.getUnitData();
        }
      });
    },
    //单元数据
    // getUnitData() {
    //   const { buildingIndex, buildingList, productTag, extraParams } = this.data;
    //   let checkedBuilding = buildingList[buildingIndex];
    //   //当前数据有缓存情况取缓存
    //   if (checkedBuilding?.cacheData) {
    //     let unitList = checkedBuilding.cacheData;
    //     const checkedUnit = unitList?.[0] || {};
    //     this.setData({
    //       floorList: checkedUnit?.floorInfos || [],
    //     });
    //   } else {
    //     let params = {
    //       buildingId: checkedBuilding.id,
    //       buildingTag: checkedBuilding.identityTag,
    //       productTag,
    //     };
    //     // app.Toast.showLoading();
    //     app.wxRequest.POST.SCENE.unitRoomData(params).then(res => {
    //       // app.Toast.hideLoading();
    //       if (res.length) {
    //         // res.floorInfos.forEach(floor => {
    //         //   floor.roomInfos.forEach(room => {
    //         //     room.checked = room.selected;
    //         //   });
    //         // });
    //         const index = buildingList.findIndex(v => v.id === checkedBuilding.id);
    //         //缓存当前楼栋房间数据
    //         this.setData({
    //           [`buildingList[${index}].cacheData`]: res,
    //         });
    //       }
    //     });
    //   }
    // },
    //切换查看全部
    changeIsAll() {
      this.setData({
        isAll: !this.data.isAll,
      });
      this.getBuliding();
    },
    saveParams(e) {
      var { state } = e?.currentTarget?.dataset || false;
      const { buildingList } = this.data;
      // if (mode === 1) return this.chooseRoom(); //房间单选
      let paramsArr = [];
      //根据选择项拼接参数
      buildingList.forEach(building => {
        let buildingObj = {
          identityTag: building.identityTag,
          name: building.name,
          alias: building.alias,
          unitInfos: [],
        };
        if (false) {
          buildingObj.identityTag = building.identityTag;
          paramsArr.push(buildingObj);
        } else {
          building.cacheData &&
            building.cacheData.forEach(unit => {
              let unitObj = {
                name: unit.name,
                alias: unit.alias,
                floorInfos: [],
              };
              if (false) {
                //全选时单元数组传空
                buildingObj.unitInfos.push(unitObj);
              } else {
                unit.floorInfos.forEach(floor => {
                  let floorObj = {
                    name: floor.name,
                    alias: floor.alias,
                    roomInfos: [],
                  };
                  if (false) {
                    //全选时楼层数组传空
                    unitObj.floorInfos.push(floorObj);
                  } else {
                    floor.roomInfos.forEach(room => {
                      room.checked && floorObj.roomInfos.push(room.name + ":" + room.alias);
                    });
                  }
                  floorObj.roomInfos.length && unitObj.floorInfos.push(floorObj);
                });
              }
              unitObj.floorInfos.length && buildingObj.unitInfos.push(unitObj);
            });
          buildingObj.unitInfos.length && paramsArr.push(buildingObj);
        }
      });
      let remark = this.getRoomOverview(paramsArr);
      this.setData({
        remark,
      });
      if (state) {
        this.triggerEvent("save", { paramsArr, total: this.data.roomTotal, remark });
        this.triggerEvent("close");
      }
    },
    //房间概要描述
    getRoomOverview(BuildingInfo) {
      let BuildingStr = "";
      BuildingInfo?.forEach(build => {
        if (build?.unitInfos?.length === 0) return (BuildingStr += `${build.alias}栋；`);
        build?.unitInfos?.forEach(unit => {
          if (build?.unitInfos?.length === 1 && build?.unitInfos[0].name == "01") {
            BuildingStr += `${build.alias}栋`;
          } else {
            BuildingStr += `${build.alias}栋${unit.alias}单元`;
          }
          //筛选空房间楼层
          let floorMap = new Map(),
            notEmptyList = [];
          unit.floorInfos.forEach(v => (v.roomInfos.length === 0 ? floorMap.set(v.name, v.alias) : notEmptyList.push(v)));
          let floorInfo = this.getSortedInfo(Array.from(floorMap.keys()));
          let floorArr = [];
          floorInfo.forEach(floor => {
            //拼接连续楼层
            if (floor.length < 1) return;
            if (floor.length === 1) return floorArr.push(`${floorMap.get(floor[0])}F`);
            floorArr.push(`${floorMap.get(floor[0])}~${floorMap.get(floor[floor.length - 1])}F`);
          });
          BuildingStr += floorArr.join("、");
          if (notEmptyList.length > 0) BuildingStr += "、";
          //非空房间楼层
          let roomArr = [];
          notEmptyList.forEach(floor => {
            floor.roomInfos.forEach(room => {
              roomArr.push(`${floor.alias}F${room.split(":")[1]}`);
            });
          });
          BuildingStr += roomArr.join("、");
          BuildingStr += "；";
        });
      });
      console.log(BuildingStr);
      return BuildingStr;
    },
    /**
     * 连续数字分组
     * @param arr 分组数据
     * @return List
     */
    getSortedInfo(arr = []) {
      if (arr.length < 1) return [];
      let ListMain = [],
        temp = [];
      arr.sort((a, b) => a - b);
      temp.push(arr[0]);
      for (let i = 0; i < arr.length - 1; i++) {
        if (Number(arr[i + 1]) == Number(arr[i]) + 1) {
          temp.push(arr[i + 1]);
        } else {
          ListMain.push(temp);
          temp = [];
          temp.push(arr[i + 1]);
        }
      }
      ListMain.push(temp);
      return ListMain;
    },
    //单个房间选择
    // chooseRoom() {
    //   const { buildingList } = this.data;
    //   let roomArr = [],
    //     remark = "";
    //   buildingList.forEach(building => {
    //     building.cacheData &&
    //       building.cacheData.forEach(unit => {
    //         unit.floorInfos.forEach(floor => {
    //           floor.roomInfos.forEach(room => {
    //             if (room.checked) {
    //               roomArr.push(room.id);
    //               remark = `${building.alias}栋${unit.alias == 1 ? "" : unit.alias + "单元"}${floor.alias}F${room.alias}`;
    //             }
    //           });
    //         });
    //       });
    //   });
    //   if (roomArr.length > 1) return app.Toast.showToast("仅支持选择单个房间");
    //   // const eventChannel = this.getOpenerEventChannel();
    //   // eventChannel.emit("chooseRoom", { data: roomArr[0], remark });
    //   // wx.navigateBack({
    //   //   delta: 1,
    //   // });
    //   this.triggerEvent("save", { data: roomArr[0], remark });
    //   this.triggerEvent("close");
    // },
    //修改楼栋数据
    changeBuilding(e) {
      let { index } = e.currentTarget.dataset;
      this.setData({
        buildingIndex: index,
        unitIndex: 0,
      });
      // this.getUnitData();
      this.closeDetail();
    },
    //修改单元数据
    changeUnit(e) {
      let { index } = e.currentTarget.dataset;
      //存储操作数据后再获取新数据
      this.setData({
        unitIndex: index,
      });
    },
    floorClick(e) {
      let { item, unitIndex, index } = e.currentTarget.dataset;
      const { buildingIndex, mode } = this.data;
      if (mode === 1) return; //单选不可选择楼层
      item.checked = !item.checked;
      item.roomInfos.forEach(v => (v.checked = item.checked));
      //只更改当前选中单元数据及更新缓存数据
      this.setData({
        [`buildingList[${buildingIndex}].cacheData[${unitIndex}].floorInfos[${index}]`]: item,
      });
      this.updateTotal();
    },
    //切换房间选中状态
    roomClick(e) {
      const { buildingIndex, mode } = this.data;
      //单选
      if (mode) return this.changeRadioVal(e);
      let { item, floorItem, unitIndex, floorIndex, roomIndex } = e.currentTarget.dataset;
      item.checked = !item.checked;
      floorItem.roomInfos[roomIndex] = item;
      //切换楼层选中标识
      if (!item.checked) {
        floorItem.checked = false;
      } else {
        //根据房间选中数量确定楼层选中标识
        floorItem.checked = floorItem.roomInfos.filter(v => v.checked).length === floorItem.roomInfos.length;
      }
      //只更改当前楼层数据
      this.setData({
        [`buildingList[${buildingIndex}].cacheData[${unitIndex}].floorInfos[${floorIndex}]`]: floorItem,
      });
      this.updateTotal();
      this.closeDetail();
    },
    batchRoom(e) {
      let { item } = e.currentTarget.dataset;
      let { buildingList, buildingIndex, mode } = this.data;
      if (mode) return;
      app.wxp
        .showModal({
          title: "批量选择",
          content: `确认${item.checked ? "取消全选" : "全选"}当前楼栋此房号的房间`,
        })
        .then(res => {
          if (res.confirm) {
            app.Toast.showLoading();
            buildingList[buildingIndex].cacheData.forEach(unit => {
              unit.floorInfos.forEach(floor => {
                floor.roomInfos.forEach(room => {
                  if (room.name === item.name) {
                    room.checked = !item.checked;
                  }
                });
                floor.checked = floor.roomInfos.filter(v => v.checked).length === floor.roomInfos.length;
              });
            });
            this.setData({
              buildingList,
            });
            this.updateTotal();
            app.Toast.hideLoading();
          }
        });
    },
    //单选事件
    changeRadioVal(e) {
      let { item } = e.currentTarget.dataset;
      const { buildingList } = this.data;
      let roomArr = [],
        remark = "";
      buildingList.forEach(building => {
        building.cacheData &&
          building.cacheData.forEach(unit => {
            unit.floorInfos.forEach(floor => {
              floor.roomInfos.some(room => {
                if (room.id === item.id) {
                  roomArr.push(room.id);
                  remark = `${building.alias}栋${unit.alias == 1 ? "" : unit.alias + "单元"}${floor.alias}F${room.alias}`;
                  return true;
                }
              });
            });
          });
      });
      this.triggerEvent("save", { data: roomArr[0], remark });
      this.triggerEvent("close");
      this.setData({
        radioItem: item,
      });
    },
    //单元全选
    unitCheckedAll() {
      const { buildingIndex, buildingList } = this.data;
      let buildingItem = buildingList[buildingIndex];
      //根据当前全选状态自动选择全部
      buildingItem.checkedAll = !buildingItem.checkedAll;
      app.Toast.showLoading("操作中");
      buildingItem.cacheData.forEach(unit => {
        //单元全选标识跟随楼栋改变
        unit.checkedAll = buildingItem.checkedAll;
        unit.floorInfos.forEach(floor => {
          floor.checked = buildingItem.checkedAll;
          floor.roomInfos.forEach(room => {
            room.checked = buildingItem.checkedAll;
          });
        });
      });
      this.setData({
        [`buildingList[${buildingIndex}]`]: buildingItem,
      });
      this.updateTotal();
      this.closeDetail();
      setTimeout(v => {
        app.Toast.hideLoading();
      }, 500);
    },
    //房间选择全部
    roomCheckedAll() {
      const { buildingIndex, unitIndex, buildingList } = this.data;
      let unitItem = buildingList[buildingIndex].cacheData[unitIndex];
      //根据当前全选状态自动选择全部
      unitItem.checkedAll = !unitItem.checkedAll;
      app.Toast.showLoading("操作中");
      unitItem.floorInfos.forEach(floor => {
        floor.checked = unitItem.checkedAll;
        floor.roomInfos.forEach(room => {
          room.checked = unitItem.checkedAll;
        });
      });
      this.setData({
        [`buildingList[${buildingIndex}].cacheData[${unitIndex}]`]: unitItem,
      });
      this.updateTotal();
      setTimeout(v => {
        app.Toast.hideLoading();
      }, 500);
    },
    //操作数据后更新总数
    updateTotal() {
      const { buildingList = [] } = this.data;
      let total = 0;
      buildingList.forEach((building, index) => {
        let unitNum = 0;
        building.checkedNum = 0;
        if (building.cacheData) {
          building.cacheData.forEach((unit, unitIndex) => {
            let floorNum = 0;
            unit.checkedNum = 0;
            unit.floorInfos.forEach(floor => {
              floor.checked && floorNum++;
              floor.roomInfos.forEach(room => {
                if (room.checked) {
                  total++;
                  building.checkedNum++;
                  unit.checkedNum++;
                }
              });
            });
            //单元是否全选根据楼层选择情况确认
            let unitAll = unit.floorInfos.length === floorNum;
            this.setData({
              [`buildingList[${index}].cacheData[${unitIndex}].checkedAll`]: unitAll,
              [`buildingList[${index}].cacheData[${unitIndex}].checkedNum`]: unit.checkedNum,
            });
            unit.checkedAll && unitNum++;
          });
          //当前楼栋是否全选根据单元选择情况确认
          let buildingAll = building.cacheData.length === unitNum;
          this.setData({
            [`buildingList[${index}].checkedAll`]: buildingAll,
            [`buildingList[${index}].checkedNum`]: building.checkedNum,
          });
        }
      });
      this.setData({
        roomTotal: total,
      });
    },
    showDetail() {
      if (this.data.roomTotal.length < 1) return;
      this.setData({
        isDetail: true,
      });
      this.saveParams();
    },
    closeDetail() {
      console.log("00002");
      this.setData({
        isDetail: false,
      });
    },
    //阻止冒泡
    stopTap(e) {
      this.closeDetail();
    },
  },
});
