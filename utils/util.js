/*
 * @Description:
 * @Author: Jesse
 * @Date: 2020-11-03 10:22:25
 * @LastEditTime: 2022-04-07 14:15:14
 * @LastEditors: Jesse
 */

const formatDate = (timestamp, type = "date", symbol = "-") => {
  let date = new Date(parseInt(timestamp));
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let dateStr = [year, month, day].map(formatNumber).join(symbol);
  let timeStr = type === "time" ? " " + getTime(timestamp) : "";
  return dateStr + timeStr;
};

let timetable = (timestamp, type = "date", symbol = "-", state) => {
  if (timestamp == 0 && state == 1) {
    return "暂无";
  } else if (timestamp == 0) {
    return "";
  }
  let date = new Date(parseInt(timestamp));
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let dateStr = [year, month, day].map(formatNumber).join(symbol);
  let timeStr = type === "time" ? " " + getshi(timestamp) : "";
  return dateStr + timeStr;
};

const getshi = timestamp => {
  let date = new Date(parseInt(timestamp));
  let hour = date.getHours();
  let minute = date.getMinutes();
  return [hour, minute].map(formatNumber).join(":");
};

const getTime = timestamp => {
  if (timestamp == 0) {
    return "—";
  }
  let date = new Date(parseInt(timestamp));
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(":");
};

const changeTimeForm = timestamp => {
  if (timestamp == 0) {
    return "";
  }
  let date = new Date(parseInt(timestamp));
  let thisYear = new Date().getFullYear();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (year === thisYear ? "" : year + "年") + month + "月" + day + "日";
};

const formatProblem = list => {
  let DICT = wx.getStorageSync("DICT");
  let { PROBLEM_STATE, PRODUCT_CATEGORY, PROBLEM_TIME } = DICT;
  list.forEach(v => {
    v.statusLabel = PROBLEM_STATE.find(item => Number(item.remark) === v.status)?.name || "";
    v.productTypeLabel = PRODUCT_CATEGORY.find(item => Number(item.remark) === v.productDataType)?.name || "";
    v.timeLabel = PROBLEM_TIME.find(item => Number(item.remark) === v.warningState)?.name || "";
    // v.expireTimeStr = formatDate(v.warningTime);
    v.expireTimeStr = formatDate(v.expireTime);
    if (v.roomInfos) {
      let arr = [];
      v.roomInfos.forEach((room, i) => {
        if (i > 1) return;
        arr.push(`${room.building}栋${room.unit ? room.unit + "单元" : ""}${room.floor}层${room.alias || room.name || room.room}房`);
      });
      v.roomLabel = arr.join("、") + (v.roomInfos.length > 2 ? "..." : "");
    } else {
      v.roomLabel = `${v.building}栋${v.unit ? v.unit + "单元" : ""}${v.floor}层${v.alias || v.name || v.room}房`;
    }
  });
  return list;
};

const setTitle = (title = "") => {
  let project = wx.getStorageSync("currentProject");
  wx.setNavigationBarTitle({
    title: decodeURIComponent(title) || project.name,
  });
};

//URL取参
const parse_url = url => {
  let pattern = /(\w+)=(\w+)/gi; //定义正则表达式
  let parames = {}; //定义数组
  url.replace(pattern, function (a, b, c) {
    parames[b] = c;
  });
  return parames; //返回这个数组.
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

const toString = Object.prototype.toString;

/**
 * 16进制转10进制
 *
 */
function hexToInt(hex) {
  let len = hex.length,
    a = new Array(len),
    code;
  for (let i = 0; i < len; i++) {
    code = hex.charCodeAt(i);
    if (48 <= code && code < 58) {
      code -= 48;
    } else {
      code = (code & 0xdf) - 65 + 10;
    }
    a[i] = code;
  }
  return a.reduce(function (acc, c) {
    acc = 16 * acc + c;
    return acc;
  }, 0);
}
/**
 * 10进制转16进制
 *
 */
function intToHex(num, width) {
  let hex = "0123456789abcdef";
  let s = "";
  while (num) {
    s = hex.charAt(num % 16) + s;
    num = Math.floor(num / 16);
  }
  if (typeof width === "undefined" || width <= s.length) {
    return "0x" + s;
  }
  let delta = width - s.length;
  let padding = "";
  while (delta-- > 0) {
    padding += "0";
  }
  return "0x" + padding + s;
}

/**
 * 去除两边空格
 *
 * @param {String}str
 * @returns {string}
 */
function trim(str) {
  return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val
 * @returns {boolean}
 */
function isObject(val) {
  return toString.call(val) === "[object object]";
}

/**
 * Determine if a value is a Function
 *
 * @param val
 * @returns {boolean}
 */
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}

/* -------------------------------------------------------- 正则 Start -------------------------------------------------------- */
// 正则
const myReg = {
  tel: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
  email: /^[A-Za-z0-9_-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  special: "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）――|{}【】‘；：”“'。，、？]",
};

// 判断是否为空
const isEmpty = str => {
  return typeof str == "undefined" || str == null || trim(str) == "";
};
// 检查手机号是否正确
const checkPhoneNumber = phone => {
  return myReg.tel.test(phone);
};
// 检查邮箱是否正确
const checkEmail = email => {
  return myReg.email.test(email);
};
const checkSpecialStr = str => {
  return new RegExp(myReg.special).test(str);
};

/* -------------------------------------------------------- 正则 End -------------------------------------------------------- */

/* -------------------------------------------------------- String 扩展方法 Start -------------------------------------------------------- */
// 把 {0} 换成 args 第一个参数，{1} 换成 args 第二个参数
String.prototype.format = function (...args) {
  return this.replace(/\{(\d+)\}/g, (m, i) => args[i]);
};
/* -------------------------------------------------------- String 扩展方法 End -------------------------------------------------------- */

module.exports = {
  hexToInt,
  intToHex,
  isEmpty,
  checkPhoneNumber,
  checkEmail,
  checkSpecialStr,
  isObject,
  parse_url, //正则取URL参数
  isFunction,
  timetable: timetable,
  formatDate: formatDate,
  getTime: getTime,
  changeTimeForm: changeTimeForm,
  formatProblem: formatProblem,
  setTitle: setTitle,
};
