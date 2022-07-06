Component({
    externalClasses: ['i-class'],

    relations: {
        '../tabs/tabs': {
            type: 'parent'
        }
    },

    properties: {
        key: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        dot: {
            type: Boolean,
            value: false
        },
        count: {
            type: Number,
            value: 0
        }
    },

    data: {
        current: false,
        currentColor: '',
        textColor:'',
        scroll: false
    },

    methods: {
        changeCurrent (current) {
            this.setData({ current });
        },
        changeCurrentColor (currentColor) {
            this.setData({ currentColor });
        },
        changetextColor (textColor) {
          this.setData({ textColor });
      },
        changeScroll (scroll) {
            this.setData({ scroll });
        },
        handleClickItem () {
            const parent = this.getRelationNodes('../tabs/tabs')[0];
            parent.emitEvent(this.data.key);
        }
    }
});
