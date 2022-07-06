// components/qt-week-select/qt-week-select.js
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    repeDate: {
      type: Array,
      value: [],
    },
    title:{
      type:String,
      value:'重复'
    },
    showTitle:{
      type:[Boolean,Number],
      value:true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    repetitionDate: '单次',
    dateList: [{
        name: '日',
        value: 1
      },
      {
        name: '一',
        value: 2,
      },
      {
        name: '二',
        value: 3
      },
      {
        name: '三',
        value: 4
      },
      {
        name: '四',
        value: 5
      },
      {
        name: '五',
        value: 6
      },
      {
        name: '六',
        value: 7
      },
    ],
  },
  observers: {
    'repeDate': function(repeArr) {
      let repetitionDate ='',dateList=this.data.dateList
      if(repeArr.length<1){
          repetitionDate='单次'
      }else if(repeArr.length>6){
        repetitionDate='每天'
        dateList.map(v=>{
          v.checked =true
        })
      }else{
        let arr=[]
        dateList.map(item=>{
          if(repeArr.indexOf(item.value)!==-1){
            item.checked =true
            arr.push('周'+item.name)
          }
        })
        repetitionDate = arr.join(' ')
      }
      this.setData({
        repetitionDate,
        dateList
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //选中日期
    itemClick({
      currentTarget: {
        dataset: {
          value,
          index=0
        }
      }
    }) {
      let {repeDate,dateList}=this.data
      dateList[index].checked =!dateList[index].checked
      repeDate.indexOf(value)!==-1 ? repeDate.splice(repeDate.indexOf(value),1) : repeDate.push(value)
      this.setData({
        dateList,
        repeDate
      })
      let arr =repeDate.sort((a,b)=>a-b)
      this.triggerEvent('dataClick',arr)
    },
  }
})