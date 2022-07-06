Component({
    externalClasses: ['qt-class'],

    options: {
        addGlobalClass: true
    },

    properties: {
        // 是否禁用
        disabled: {
            type: Boolean,
            value: false
        },
        // 是否镂空
        hollow: {
            type: Boolean,
            value: false
        },
        type:{
          type:String,
          value:'primary'
        },
        hoverClass: {
            type: String,
            value: ''
        }
    },
    methods: {
        // 点击事件
        handleTap () {
            if (this.data.disabled) return false;
            this.triggerEvent('click');
        }
    }
});
