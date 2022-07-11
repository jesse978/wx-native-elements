//自定义错误码
const errCode = {
    5401: {
        msg: "invalid param",
        ui: "参数出错",
        showUI: true,
    },
    5402: {
        msg: "illegal request( 错误的请求 )",
        ui: "非法请求",
        showUI: true,
    },
    5403: "reservation locked( 预约被锁 )",
    5404: {
        msg: "response fail",
        ui: "接口请求响应失败",
        showUI: true,
    },
    5405: {
        msg: "unified order fail",
        ui: "重新获取验证码",
        showUI: true,
    },
    5406: {
        msg: "code invalid",
        ui: "验证码已失效",
        showUI: true,
    },
    // 5407: "not nopay trade",
    5408: {
        msg: "account none",
        ui: "账号不存在",
        showUI: false,
    },
    // 5409: "preview order",
    5410: {
        msg: "invalid mobile",
        ui: "小程序授权码失效",
        showUI: true,
    }, //需要关联手机号
    5412: "verify code invalid",
    5414: {
        msg: "mobile exists",
        ui: "当前手机号已被绑定",
        showUI: true,
    },
    5415: {
        msg: "expire invite id",
        ui: "二维码已过期",
        showUI: true,
    },
    5416: {
        msg: "sign invalid",
        ui: "无效二维码",
        showUI: true,
    },
    // 5417: "wxappid invalid",
    5418: "fee free",
    5419: "accid empty",
    5420: "refund reject",
    5421: "drcontrol locked",
    5422: {
        msg: "verifyCode invalid",
        ui: "验证码错误",
        showUI: true,
    },
    5423: {
        msg: "userName or password invalid",
        ui: "用户名或密码错误",
        showUI: true,
    },
    5424: "refresh token expire", //token重刷过期
    5425: {
        msg: "invalid appid(appid错误)",
        ui: "技术故障，无法拉取数据，请联系客服",
        showUI: true,
    },
    5426: 'none',
    5427: {
        msg: "problem duplicate",
        ui: "问题重复",
        showUI: true,
    },
    5428: {
        msg: "virtual device amount",
        ui: "",
        showUI: true,
    },
    5429: {
        msg: "nopay tradeno",
        ui: "您有一个未支付的订单需要优先处理",
        showUI: true,
    }, //有未完成的订单
    5430: "duplicate request",
    5431: "resources locked",
    5432: 'none',
    5433: 'none',
    5434: 'none',
    5435: "unified trade timeout",
    5436: "ticket invalid",
    5437: {
        msg: "invalid tradeno",
        ui: "订单号异常",
        showUI: true,
    },
    5438: "invalid teamleader",
    5439: "contact name mobile",
    5440: "allow max limit",
    5000: {
        msg: "token invalid",
        ui: "",
        showUI: true,
    },
    5001: "appkey invalid",
    5002: "appsecret invalid",
    5003: "did invalid",
    5004: "nonce null",
    5005: {
        msg: "none authorize",
        ui: "当前身份未授权",
        showUI: true,
    },
    5006: {
        msg: "device has been bound",
        ui: "",
        showUI: true,
    },
    5007: "device is invalid",
    200: "ok",
    "-1": {
        msg: "system error( 系统错误 )",
        ui: "system error",
        showUI: true,
    },

    5105: {
        msg: "json mapping error",
        ui: "json mapping error",
        showUI: true,
    },
    5103: {
        msg: "api not exist",
        ui: "api not exist",
        showUI: true,
    },
    5102: {
        msg: "json error",
        ui: "json数据格式错误",
        showUI: true,
    },
    5429: 'none',

};

// 导出错误码

export default errCode;
