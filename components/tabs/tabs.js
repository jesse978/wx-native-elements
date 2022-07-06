Component({
    externalClasses: ['i-class'],

    relations: {
        '../tab/tab': {
            type: 'child',
            linked () {
                this.changeCurrent();
            },
            linkChanged () {
                this.changeCurrent();
            },
            unlinked () {
                this.changeCurrent();
            }
        }
    },

    properties: {
        current: {
            type: String,
            value: '',
            observer: 'changeCurrent'
        },
        currentColor: {
            type: String,
            value: ''
        },
        textColor: {
          type: String,
          value: ''
      },
        scroll: {
            type: Boolean,
            value: false
        },
        fixed: {
            type: Boolean,
            value: false
        }
    },

    methods: {
        changeCurrent (val = this.data.current) {
            let items = this.getRelationNodes('../tab/tab');
            const len = items.length;

            if (len > 0) {
                items.forEach(item => {
                    item.changeScroll(this.data.scroll);
                    item.changeCurrent(item.data.key === val);
                    item.changeCurrentColor(this.data.currentColor);
                    item.changetextColor(this.data.textColor);
                });
            }
        },
        emitEvent (key) {
            this.triggerEvent('change', { key });
        }
    }
});
