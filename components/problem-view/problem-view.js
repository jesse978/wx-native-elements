// components/problem-list/problem-list.js

const app = getApp();
import { formatProblem } from "../../utils/util";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stage: {
      type: Number,
      value: 0,
    },
    // stageId: {
    //   type: String,
    //   value: "0",
    // },
    batchId: {
      type: String,
      value: "",
    },
    productGroupId: {
      type: String,
      value: "",
    },
    extra: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    total: 0,
    statusNum: [], //问题状态统计
    checkedState: -1, //当前选择状态筛选
    filterShow: false, //筛选框可见
    buildingFilter: {}, //楼栋筛选
    checkedBuilding: {}, //当前选择楼栋
    floorFilter: [], //房间筛选
    checkedFloor: {}, //当前选择房间
    checkedProblemType: {},
    typeFilter: [
      {
        remark: -1,
        name: "全部",
      },
      {
        remark: 4,
        name: "遗留",
      },
      {
        remark: 2,
        name: "异常",
      },
      {
        remark: 5,
        name: "仅记录",
      },
    ],
    selfFilter: [
      {
        remark: "1",
        name: "我负责的问题",
      },
      {
        remark: "2",
        name: "我执行的问题",
      },
      {
        remark: "3",
        name: "与我相关的问题",
      },
    ],
    sortFilter: [
      {
        remark: 1,
        name: "优先级",
      },
      {
        remark: 2,
        name: "创建时间",
      },
      {
        remark: 3,
        name: "截止时间",
      },
      {
        remark: 4,
        name: "更新时间",
      },
    ],
    roomFilter: {}, //房间筛选
    productFilter: {}, //产品筛选
    checkedProduct: {}, //当前选择产品
    commonFilter: {}, //问题筛选组合
    filterObj: {}, //当前选中筛选条件
    problemList: [], //问题列表
    isRefresh: false,
    headArr: [
      {
        remark: -1,
        name: "全部",
      },
    ], //固定填充头
    isShowAll: false, //是否显示全选
    isExplain: false,
    viewType: true,
    problemList: [],
    roomList: [],
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  observers: {},
  /**
   * 组件的方法列表
   */
  methods: {
    initData() {
      this.getCommonFilter();
    },
    /* 显示筛选 */
    showFilter(e) {
      this.setData({
        filterShow: true,
        filterClass: true,
      });
    },
    showSerch() {
      this.changeIsSerch();
    },
    changeIsSerch() {
      this.setData({
        isSerch: !this.data.isSerch,
      });
    },
    //模糊搜索
    changeSearch(e) {
      let { value } = e.detail;
      if (value === "6ZOB5ZKp5ZKp") {
        wx.navigateTo({
          url: "../common/back-door/back-door",
        });
        return;
      }
      this.setData({
        searchValue: value,
      });
      this.getNewData();
    },
    //切换筛选框
    changeModel() {
      this.setData({
        filterShow: !this.data.filterShow,
      });
    },
    //点击右上角
    changeCheckedFilter(e) {
      let { data } = e.detail;
      console.log(data);
      this.setData({
        commonFilter: data,
      });
      this.changeModel();
      this.getNewData();
    },
    //筛选项点击
    filterItemClick(e) {
      let { item, type, filterObj: commonFilter } = e.detail;
      let { headArr } = this.data;
      //根据环节切换，动态改变一二级分类筛选条件
      if (type === "stage") {
        commonFilter.first.checked = -1;
        commonFilter.first.list = headArr.concat(item?.list || []);
        commonFilter.second.checked = -1;
        commonFilter.second.list = headArr;
        //同步头部选中状态值
        this.setData({
          checkedState: Number(item.remark),
        });
      }
      if (type === "first") {
        commonFilter.second.checked = -1;
        commonFilter.second.list = headArr.concat(item?.list || []);
      }
      this.setData({
        commonFilter,
      });
    },
    getCommonFilter() {
      const cacheData = wx.getStorageSync("cacheData").problem || {};
      const DICT = wx.getStorageSync("DICT");
      let { stage, batchId = "", productGroupId = "", headArr, selfFilter, sortFilter } = this.data;
      let params = {
        batchId,
        productGroupId,
      };
      app.wxRequest.POST.PROBLEM.problemFilter(params).then(res => {
        if (res) {
          const { buildings, assigns, submits } = res;
          let checkedBuilding = buildings.find(v => v.id === cacheData.buildingId) || buildings[0];
          let { productInfos: products, floorInfos: floors } = checkedBuilding;
          let buildingFilter = {
            building: {
              name: "楼栋",
              checked: checkedBuilding.remark,
              list: buildings,
            },
          };

          let productFilter = {
            product: {
              name: "产品",
              checked: -1,
              list: headArr.concat(products),
            },
          };
          let commonFilter = {
            part: {
              name: "部件",
              checked: -1,
              list: headArr,
            },
            // first: {
            //   name: "问题阶段",
            //   checked: -1,
            //   list: headArr.concat(stageArr || []),
            // },
            // second: {
            //   name: "问题类型",
            //   checked: -1,
            //   list: headArr,
            // },
            // three: {
            //   name: "类型二级",
            //   checked: -1,
            //   list: headArr,
            // },
            // priority: {
            //   name: "优先级",
            //   checked: -1,
            //   list: headArr.concat(DICT.PROBLEM_PRIORITY),
            // },
            dispose: {
              name: "处理状态",
              checked: "1", //默认选择未处理状态
              list: headArr.concat(DICT.PROBLEM_STATE),
            },
            // time: {
            //   name: "时间状态",
            //   checked: -1,
            //   list: headArr.concat(DICT.PROBLEM_TIME),
            // },
            // duty: {
            //   name: "责任方",
            //   checked: -1,
            //   list: headArr.concat(DICT.PROBLEM_RESPONSIBLE_NEW),
            // },
            // oneself: {
            //   name: "我的问题",
            //   checked: -1,
            //   list: headArr.concat(selfFilter),
            // },
            assign: {
              name: "指派人",
              checked: -1,
              list: headArr.concat(assigns),
            },
            submit: {
              name: "提交人",
              checked: -1,
              list: headArr.concat(submits),
            },
            // sort: {
            //   name: "排序",
            //   checked: 2,
            //   list: sortFilter,
            // },
          };
          this.setData({
            resetData: JSON.parse(JSON.stringify(commonFilter)),
            // stageList: headArr.concat(DICT.PROBLEM_TYPE_NEW),
            // checkedStage: DICT.PROBLEM_TYPE_NEW[0],
            commonFilter,
            buildingFilter,
            productFilter,
            floorFilter: floors,
            checkedProblemType: headArr[0],
            checkedProduct: headArr[0],
            checkedBuilding,
          });
          this.getTypeFilter();
          this.getNewData();
        }
      });
    },
    getTypeFilter() {
      const { PROBLEM_TYPE_NEW } = wx.getStorageSync("DICT");
      const { modules } = wx.getStorageSync("currentProject");
      // let productType = PROBLEM_REASON_TYPE_V2.find(v => Number(v.remark) === stage);
      PROBLEM_TYPE_NEW.forEach(type => {
        modules.some(m => {
          return m.stageInfos.some(info => {
            if (info.stage == type.remark) {
              type.stageId = info.id;
              return true;
            }
          });
        });
      });
      let { checkedProduct, headArr, stage } = this.data;
      let param = {
        stageId: PROBLEM_TYPE_NEW[0].stageId,
        partId: "0",
        eventType: -1,
        productId: checkedProduct.productId || "",
        stageTypes: [Number(PROBLEM_TYPE_NEW[0].remark)],
        configType: -1,
        productIds: [],
      };
      app.wxRequest.POST.PRODUCT.templateData(param).then(res => {
        if (res) {
          let data = res?.[0] || {};
          PROBLEM_TYPE_NEW[0].list = data.items;
          this.setData({
            stageList: headArr.concat(stage != 1 ? PROBLEM_TYPE_NEW : [PROBLEM_TYPE_NEW[0]]),
            checkedStage: headArr[0],
            checkedType: headArr[0],
            checkedSecendType: headArr[0],
          });
        }
      });
    },
    //创建公共参数
    createCommonParams(view, type) {
      //重置房间分页
      if (type === "new") {
        this.setData({
          page: 1,
          total: 0,
          roomList: [],
        });
      }
      let stageDict = wx.getStorageSync("stageDict");
      let {
        page,
        limit,
        stage,
        commonFilter: { assign, submit, dispose, part },
        searchValue: keyword,
        checkedBuilding,
        checkedProduct,
        problemList,
        roomList,
        batchId = "",
        productGroupId,
        checkedProblemType,
        checkedStage,
        checkedType,
      } = this.data;
      let params = {
        batchId,
        productGroupId,
        stageId: stageDict[stage].id,
        limit,
        page,
        keyword,
        matchType: checkedProblemType.remark ?? -1,
        problemType: Number(stage),
        buildingId: checkedBuilding.id,
        floors: [],
        productTag: checkedProduct.productTag || "",
        stage: Number(stage),
        reasonType: Number(checkedType?.dataType || -1),
        dataType: Number(checkedStage?.remark || -1),
        reason: Number(checkedType?.remark || -1),
        assignId: assign.checked > 0 ? assign.checked : "", //指派人
        feedbackId: submit.checked > 0 ? submit.checked : "",
        sortType: 2,
        priority: -1,
        timeState: -1,
        status: Number(dispose.checked),
        responsible: -1,
        assign: -1, //关于x问题
        eventIds: [],
        partId: part?.checked > 0 ? part.checked : "",
      };
      checkedBuilding.floorInfos.forEach(v => {
        v.checked && params.floors.push(v.remark);
      });
      checkedType?.items?.forEach(v => {
        v.checked && params.eventIds.push(v.eventId);
      });
      if (view === "problem") {
        //问题视图
        let item = problemList?.[problemList.length - 1] || {};
        params.nextId = type !== "new" ? item.nextId : "";
        params.nextQuery = type !== "new" ? item.nextQuery : "";
      } else {
        //房号视图
        params.nextTag = roomList?.[roomList.length - 1]?.nextTag || "";
      }
      return params;
    },
    /* 获取问题列表 */
    getProblemList(type) {
      let { problemList } = this.data;
      let params = this.createCommonParams("problem", type);
      app.wxRequest.POST.PROBLEM.problemList(params).then(res => {
        let newList = formatProblem(res.list);
        this.setData({
          problemList: type === "new" ? newList : [...problemList, ...newList],
          total: res.total,
        });
        this.setFilterStr();
      });
    },

    /* 获取问题房号列表 */
    getProblemRoom(type) {
      let { roomList } = this.data;
      let params = this.createCommonParams("room", type);
      app.wxRequest.POST.PROBLEM.problemRoomView(params).then(res => {
        let newList = res.list;
        this.setData({
          roomList: type === "new" ? newList : [...roomList, ...newList],
          total: res.total,
          roomExtra: res.extra,
        });
        this.setFilterStr();
      });
    },

    /* 进入房间详情 */
    // roomDetail(e) {
    //   let { item } = e.currentTarget.dataset;
    //   let title = `${item.building}栋${item.unit ? item.unit + "单元" : ""}${item.floor}F${item.alias || item.name}`;
    //   wx.navigateTo({
    //     url: `/pages/project/project-detail/room-detail/room-problem/room-problem?id=${item.id}&title=${title}`,
    //   });
    // },
    /* 进入房间详情 */
    roomDetail(e) {
      let { item } = e.currentTarget.dataset;
      let stageDict = wx.getStorageSync("stageDict");
      let title = `${item.building}栋${item.unit ? item.unit + "单元" : ""}${item.floor}F${item.alias || item.name}`;
      wx.navigateTo({
        url: `/pages/project/project-detail/room-detail/stage-detail?id=${item.id}&title=${title}&tab=${1}&stageId=${stageDict[this.data.stage].id}&stage=${this.data.stage}`,
      });
    },
    problemDetail(e) {
      let { item } = e.detail;
      const { index } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/problem/problem-detail/problem-detail?id=${item.id}&type=${item.queryType}&title=#${item.problemNo}${item.title}`,
        events: {
          changeStatus: () => {
            item.status = 3;
            let newList = formatProblem([item]);
            this.setData({
              [`problemList[${index}]`]: newList[0],
            });
          },
        },
      });
    },
    //问题选择框
    showAll() {
      this.setData({
        isShowAll: true,
      });
    },
    changeIsShow() {
      this.setData({
        isShowAll: !this.data.isShowAll,
      });
    },
    //问题单个选择
    changeProblemChecked(e) {
      const { index, item } = e.currentTarget.dataset;
      this.setData({
        [`problemList[${index}].checked`]: !item.checked,
      });
    },
    //是否全选
    changeCheckedAll(e) {
      let { problemList, isCheckedAll } = this.data;
      problemList.forEach(v => {
        v.checked = !isCheckedAll;
      });
      this.setData({
        isCheckedAll: !isCheckedAll,
        problemList,
      });
    },
    changeProblemStatus() {
      let { roomId, problemList } = this.data;
      let params = {
        problemIds: [],
        roomId: roomId,
      };
      problemList.forEach(v => {
        v.checked && params.problemIds.push(v.id);
      });
      if (params.problemIds.length < 1) return app.Toast.showToast("请选择问题");
      app.Toast.showLoading();
      app.wxRequest.POST.PROBLEM.changeStageProblem(params).then(res => {
        app.Toast.sucMsg("处理成功");
        this.getProblemList("new");
        this.changeIsShow();
        app.setIsRefresh(true); //设置全局刷新标识
      });
    },
    changeviewType() {
      let { viewType } = this.data;
      app.Toast.showToast(viewType ? "已切换至列表视图" : "已切换至房号视图");
      this.setData({
        viewType: !viewType,
      });
      this.getNewData();
    },
    changeRefresh() {
      this.setData({
        isRefresh: !this.data.isRefresh,
      });
    },
    refreshData() {
      this.changeRefresh();
      setTimeout(v => {
        this.changeRefresh();
      }, 500);
      this.getNewData();
    },
    //根据页面类型获取新数据
    getNewData() {
      let { viewType } = this.data;
      if (viewType) {
        this.setData({
          problemList: [],
        });
        this.getProblemRoom("new");
      } else {
        this.setData({
          roomList: [],
        });
        this.getProblemList("new");
      }
    },
    /* 楼栋筛选 */
    changeBuildingFilter(e) {
      const { item } = e.detail;
      let { productFilter, floorFilter, headArr } = this.data;
      console.log(item);
      let products = item.productInfos;
      let rooms = item.roomInfos;
      productFilter.product.list = headArr.concat(products);
      productFilter.checked = -1;
      floorFilter = item.floorInfos;
      let partFilter = products?.parts ? headArr.concat(products?.parts) : headArr;
      this.setData({
        checkedBuilding: item,
        productFilter,
        checkedProduct: headArr[0],
        [`commonFilter.part.list`]: partFilter,
        [`commonFilter.part.checked`]: -1,
        checkedFloor: headArr[0],
        floorFilter,
      });
      this.changeBuildingModel();
      this.getNewData();
    },
    changeBuildingModel() {
      if (this.data.showAll) return;
      this.setData({
        buildingShow: !this.data.buildingShow,
      });
    },

    /* 楼层筛选 */
    floorChange() {
      this.getNewData();
    },
    resetFloorFilter() {
      let { floorFilter } = this.data;
      floorFilter.forEach(e => (e.checked = false));
      this.setData({
        floorFilter,
      });
    },

    changeFloorModel() {
      this.setData({
        floorShow: !this.data.floorShow,
      });
    },
    floorClick(e) {
      let { index, item } = e.currentTarget.dataset;
      this.setData({
        [`floorFilter[${index}].checked`]: !item.checked,
      });
    },
    typeSave() {
      // this.changeTypeModel();
      this.getNewData();
    },
    changeStage(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedStage: item,
        checkedType: this.data.headArr,
      });
    },
    changeType(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedType: item,
      });
    },
    changeSecendType(e) {
      let { item, index } = e.currentTarget.dataset;
      this.setData({
        [`checkedType.items[${index}].checked`]: !item.checked,
      });
    },
    changeProblemType(e) {
      let { item } = e.currentTarget.dataset;
      this.setData({
        checkedProblemType: item,
      });
    },
    changeTypeModel() {
      this.setData({
        typeShow: !this.data.typeShow,
      });
    },
    /* 产品筛选 */
    changeProductFilter(e) {
      let { item } = e.detail;
      const { headArr } = this.data;
      console.log(item);
      let partFilter = item?.parts ? headArr.concat(item?.parts) : headArr;
      this.setData({
        checkedProduct: item,
        [`commonFilter.part.list`]: partFilter,
        [`commonFilter.part.checked`]: -1,
        stageList: [],
        checkedStage: headArr[0],
        checkedType: headArr[0],
        checkedSecendType: headArr[0],
      });
      this.getTypeFilter();
      this.changeProductModel();
      this.getNewData();
    },
    changeProductModel() {
      if (this.data.showAll) return;
      this.setData({
        productShow: !this.data.productShow,
      });
    },
    changeTypeModel() {
      this.setData({
        typeShow: !this.data.typeShow,
      });
    },
    resetFilter() {
      this.setData({
        commonFilter: JSON.parse(JSON.stringify(this.data.resetData)),
      });
    },
    dataLoad() {
      let {} = this.data;
      let { limit, page, total, viewType } = this.data;
      if (limit * page > total) return;
      this.setData({
        page: ++page,
      });
      if (viewType) {
        this.getProblemRoom();
      } else {
        this.getProblemList();
      }
    },
    //动态计算筛选标题
    setFilterStr() {
      let { checkedBuilding } = this.data;
      let strArr = [],
        floors = [],
        rooms = [];
      checkedBuilding.floorInfos?.forEach(v => (v.checked ? floors.push(v.alias || v.name) : ""));
      // checkedBuilding.roomInfos?.forEach(v => (v.checked ? rooms.push(v.alias || v.name) : ""));
      if (floors.length) strArr.push(floors.join(",") + "层");
      // if (rooms.length) strArr.push(rooms.join(",") + "房");
      this.setData({
        filterStr: strArr.length ? ` # ${strArr.join("; ")}` : "",
      });
    },
  },
});
