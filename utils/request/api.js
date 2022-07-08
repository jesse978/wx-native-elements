/*
 * @Description:
 * @Author: Jesse
 * @Date: 2020-11-03 10:33:14
 * @LastEditTime: 2022-03-30 09:45:54
 * @LastEditors: Jesse
 */
import wxRequest from "./wxRequest.js";
import errCode from "./errorCode.js";

wxRequest.config.vendor = "";

// 基础路径
wxRequest.config.baseUrl = "https://xxxxx/";

// 后端接口版本号（会和基础路径拼接在一起）
wxRequest.config.version = "";

// 全局错误处理
wxRequest.config.ERROR = errCode;

// 获取 TOKEN URL
wxRequest.config.TOKENUrl = `auth/${wxRequest.config.appid}/token`;

// 成功获取 TOKEN 后的处理函数
wxRequest.config.tokenSuccessFn = res => {
    // console.log("1、成功获取TOKEN数据 -----------", res);
    wxRequest.tokenInfo = res;
};

// GET 请求列表
wxRequest.config.getList = {
    USER: {
        getPasswordCode: "user/{0}/xxx", //获取验证码（修改密码）
        getVerifyCode: "verify/code", //获取验证码（手机更新）
    },

};

// POST 请求列表
wxRequest.config.postList = {
    UPLOAD: {
        fileConfig: "upload/{0}/file/config", //上传文件配置信息
        ossTemporaryConfig: "upload/{0}/token/test", //oss临时配置
    },
};

// 处理 URL（不变），一定要写（主要是用来把 postList 和 getList 转换为下面请求的使用方式）
wxRequest.urlDispose(wxRequest.config.postList, "POST");
wxRequest.urlDispose(wxRequest.config.getList, "GET");
