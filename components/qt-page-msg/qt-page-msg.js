const app = getApp();

Component({
    externalClasses: ['qt-class'],

    properties: {
        // 提示文字
        msg: {
            type: String,
            value: '暂无数据'
        },
        icon:{
          type: String,
          value: 'not_log'
        },
    },

    data: {
        imgRoot: app.imgRoot
    }
});
