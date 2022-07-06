const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    butxt:{
      type:String,			
      value:'新增组合'			  
    },
    title:{
      type:String,			
      value:'暂无预设楼栋组合'
    },
    describe:{
      type:String,
      value:'请点击下方按钮选择楼栋房号创建组合后使用。'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgRoot: app.imgRoot
  },

  /**
   * 组件的方法列表
   */
  methods: {

    addCombine(){
      this.triggerEvent('channel');
    }

  }
})
