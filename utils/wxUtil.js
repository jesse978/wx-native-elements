import wxRequest from "../utils/request/wxRequest"

let regeneratorRuntime = require("./request/runtime")

class wxUtil {
    /**
     * 把小程序接口封装成 Promise
     * @param {String} name 接口名称
     * @param {Object} options 调用接口参数
     * @returns {Promise}
     */
    static api(name, options) {
        return new Promise((success, fail) => {
            let obj = {
                ...options,
                ...{
                    success,
                    fail,
                },
            }
            wx[name](obj)
        })
    }

    // authorizeLocation 授权获取当前地址
    static async authorizeLocation() {
        try {
            let res = await this.api("getSetting")
            if (!res.authSetting["scope.userLocation"]) {
                // 如果用户未授权获取地址
                wx.authorize({
                    scope: "scope.userLocation",
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    static async getLongTudeAndLatitude() {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: res => {
                    // 如果用户已授权，直接获取地址打开地图
                    if (res.authSetting["scope.userLocation"]) {
                        wx.getLocation({
                            type: "gcj02",
                            success: function (res) {
                                console.log("wx.getLocation_success:", res)
                                resolve(res)
                            },
                            fail: function (res) {
                                console.log("wx.getLocation_fail :", res)
                                reject(res)
                            },
                        })
                    } else {
                        reject(res)
                    }
                },
            })
        })
    }

    // 扫码
    static async scanCode(scanType = ["barCode", "qrCode"]) {
        return this.api("scanCode", {
            scanType,
        })
    }

    /**
     * 选择照片，返回照片临时路径
     *
     * @param {String} type 选择照片方式，可选 camera(相机) || album 相册
     * @param {Function} callback
     * @returns {Promise<void>}
     */
    static async chooseImage({type, count = 1}, callback) {
        let _this = this
        try {
            let res = await _this.api("chooseImage", {
                count,
                sizeType: ["compressed"],
                sourceType: [type],
            })
            console.log(res, "1111")
            // tempFilePath可以作为img标签的src属性显示图片
            callback(res.tempFilePaths)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 获取文件上传配置信息存储到本地
     * @param {*} tempFilePaths
     *
     */
    static async getFileConfig(id) {
        // let id = app.globalData.currentCompany.mchid;
        return new Promise((resolve, reject) => {
            wxRequest.GET.UPLOAD.fileConfig({
                id: id !== "0" ? id : "",
            }).then(res => {
                console.log(res)
                resolve(res)
            })
        })
    }

    /**
     * 图片上传
     * @param {tempFilePaths} 图片路径
     * @param {id} 商户ID
     * @returns {Promise<void>}
     */
    static async uploadImage(tempFilePaths, id) {
        let fileConfig = await this.getFileConfig(id)
        let timestamp = new Date().getTime(),
            imgOnlineUrl
        let suffix = tempFilePaths[0].substring(tempFilePaths[0].length - 4, tempFilePaths[0].length) //重命名，使用时间戳命名
        let Imgurl = fileConfig.realhost // 上传地址

        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: Imgurl,
                filePath: tempFilePaths[0],
                name: "file",
                formData: {
                    key: fileConfig.dir + "/" + timestamp + suffix,
                    policy: fileConfig.policy,
                    OSSAccessKeyId: fileConfig.accessid,
                    success_action_status: "200",
                    signature: fileConfig.signature,
                },
                success(res) {
                    const data = res.data
                    imgOnlineUrl = Imgurl + "/" + fileConfig.dir + "/" + timestamp + suffix //返回图片在线地址用于传参
                    console.log(imgOnlineUrl)
                    resolve({name: timestamp + suffix, url: imgOnlineUrl})
                    // do something
                },
                fail(res) {
                    reject(res)
                },
            })
        })
    }

    /**
     * 图片批量上传
     * @param {tempFilePaths} 图片路径
     * @param {id} 商户ID
     * @returns {Promise<void>}
     */
    static async bathUploadImage(tempFilePaths, id) {
        let fileConfig = await this.getFileConfig(id), imgOnlineUrl, uploadArr = []
        let Imgurl = fileConfig.realhost // 上传地址
        tempFilePaths.forEach((temp, i) => {
            let timestamp = new Date().getTime() + i //根据时间戳加index构造唯一id
            let suffix = temp.substring(temp.length - 4, temp.length) //重命名，使用时间戳命名
            uploadArr.push(
                new Promise((resolve, reject) => {
                    wx.uploadFile({
                        url: Imgurl,
                        filePath: temp,
                        name: "file",
                        formData: {
                            key: fileConfig.dir + "/" + timestamp + suffix,
                            policy: fileConfig.policy,
                            OSSAccessKeyId: fileConfig.accessid,
                            success_action_status: "200",
                            signature: fileConfig.signature,
                        },
                        success(res) {
                            const data = res.data
                            imgOnlineUrl = Imgurl + "/" + fileConfig.dir + "/" + timestamp + suffix //返回图片在线地址用于传参
                            console.log(imgOnlineUrl)
                            resolve({name: timestamp + suffix, url: imgOnlineUrl})
                            // do something
                        },
                        fail(res) {
                            reject(res)
                        },
                    })
                })
            )
        })
        return Promise.all(uploadArr)
    }

    /**
     * 操作菜单选择照片
     * @param {Number} options 可选择的方式
     * @param {Function} successCb 成功回调函数
     * @returns {Promise<void>}
     */
    static async chooseBgImage(successCb, options = {}) {
        let {index = 3, count = 1} = options
        let {tapIndex} = await this.api("showActionSheet", {
            itemList: ["拍照", "从相册选择"].splice(0, index),
        })

        switch (tapIndex) {
            case 0:
                this.chooseImage({type: "camera", count}, res => successCb(res))
                break
            case 1:
                this.chooseImage({type: "album", count}, res => successCb(res))
                break
            case 2:
                break
        }
    }

    /**
     * @param  data 需要转换数据
     * @param {Boolean} oldData 转换类型 true:转换为后台int型数据 false:转换为数组类型
     */
    static transformAccessMode(oldData, type) {
        if (type) {
            let newData = 0
            oldData.map(v => {
                newData += parseInt(v)
            })
            return newData
        } else {
            let newData = []
            switch (parseInt(oldData)) {
                case 7:
                    newData = [1, 2, 4]
                    break
                case 6:
                    newData = [2, 4]
                    break
                case 5:
                    newData = [1, 4]
                    break
                case 4:
                    newData = [4]
                    break
                default:
                    newData = []
            }
            return newData
        }
    }
}

/*
 * Toast 提示信息对象
 * */
let ToastTimer = null
const Toast = {
    /**
     * 显示 loading
     * @param {String} title 提示内容
     * @param {Boolean} mask 是否显示蒙层
     */
    showLoading(title = "加载中", mask = true) {
        wx.showLoading({
            title,
            mask,
        })
        ToastTimer = setTimeout(() => {
            wx.hideLoading()
            // this.showToast('请求错误')
        }, 10000)
    },
    /**
     * hideLoading 隐藏 loading
     * */
    hideLoading() {
        this.clearToastTimer()
        wx.hideLoading({})
    },
    /**
     * sucMsg 成功消息提示
     * @params { String } title 提示内容
     * */
    sucMsg(title) {
        this.clearToastTimer()
        wx.showToast({
            title,
            duration: 1000,
        })
    },

    errMsg(title) {
        this.clearToastTimer()
        wx.showToast({
            icon: 'error',
            title,
            duration: 1000,
        })
    },

    showToast(title, duration = 1500) {
        this.clearToastTimer()
        wx.showToast({
            title,
            icon: "none",
            duration,
        })
    },
    //清除超时错误提示
    clearToastTimer() {
        if (ToastTimer) {
            clearTimeout(ToastTimer)
            ToastTimer = null
        }
    },
}

export {
    wxUtil,
    Toast, // 提示信息
}
