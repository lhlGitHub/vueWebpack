import Api from "../lib/Api";
// import Api from 'api-mock-js'

import md5 from "../lib/md5.min";
import pop from "../lib/toast";
// import LoadingModel from "../common/loadingModel.js";
// import Apidefine from './interface'
import setTitle from "./title";
// import WX from "../lib/wx-sdk"
// import WX from "../lib/wx-share"
// if(Boolean(Number(window.GD.URLparams.useMock))){
// 	import('./interface.js').then(e => {
// 		console.log('mock ready')
// 	})
// }
const throttle = (delay, action) => {
  let last = 0;
  return function() {
    let curr = +new Date();
    if (curr - last > delay) {
      action.apply(this, arguments);
      last = curr;
    }
  };
};

const userAgent = navigator.userAgent.toLowerCase();

const isMobile = /mobile/i.test(userAgent);

const isAndroid = /android/i.test(userAgent);

const isIOS = /iphone|ipad|ipod/i.test(userAgent);

const systemVersion =
  isMobile &&
  parseInt(
    navigator.userAgent
      .toLowerCase()
      .match(/(os|android).\d/g)[0]
      .slice(-1)
  );

const isLowAndroid = isAndroid ? systemVersion < 5 : false;

const isLowIOS = isIOS ? systemVersion > 4 && systemVersion < 9 : false;

const isWX = /micromessenger/i.test(userAgent);

const sleep = (time = 1000) =>
  new Promise(resolve => setTimeout(resolve, time));

const getLocal = key => JSON.parse(localStorage.getItem(key) || "{}");
const saveLocal = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));
const removeLocal = key => localStorage.removeItem(key);

const getSession = key => JSON.parse(sessionStorage.getItem(key) || "{}");
const saveSession = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value));
const removeSession = key => sessionStorage.removeItem(key);

let params = window.GD.URLparams;
let fromGame = {
  //公共参数
  from_id: params.from || "0", //来源渠道id
  // 'game_id': params.game_id || localData.game_id || '',
  param: params.param || "test1",
  pf: isAndroid ? 1 : isIOS ? 2 : 3 //1/2/3 =>安卓/ios/其他
  //	'type': !isMobile ? 1 : (isWX ? 2 : 3) //1PC2微信3移动端
  // 'callback':'cors',
};

Api.config({
  methods: "GET", // GET POST ...
  dataType: "json", //json || jsonp
  // domain: domain,
  domain: "http://localhost:4000/getList",
  useMock: Number(params.useMock) || false,
  urlModel: 1,
  debug: Number(params.debug) || false,
  filter(obj) {
    const deal = obj => {
      let signature = "";
      let keys = ["ct", "ac", "from_id", "_t"].sort();
      keys.forEach(key => (signature += "&" + key + "=" + obj[key]));
      signature = signature.replace("&", "");
      signature += "3kwan_wechat_!@#$%^&*";
      return {
        ...obj,
        signature: md5(signature).toLocaleUpperCase()
      };
    };
    return deal({
      ...obj,
      _t: new Date().getTime() 
    });
  }
});

let fixIosTime = time => {
  if (fromGame.pf == "2" && typeof time != "number") {
    return time.replace(/-/g, function($0) {
      return ($0 = "/");
    });
  } else {
    return time;
  }
};


let scrollTop;
const addFixed = () => {
  // 添加防穿透
  if (document.body.style.position == "fixed") {
    // console.log(22222222)
    return;
  }
  scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.position = "fixed";
  document.body.style.top = -scrollTop + "px";
  // console.log('scrollTop',-scrollTop)
};

const removeFixed = () => {
  // 删除防穿透
  document.body.style.position = "static";
  document.body.style.top = "0px";
  window.scrollTo(0, scrollTop);
};
const showToast = msg => {
  return new pop.toast(msg, 2000);
};

const checkResCode = res => {
  //接口错误处理
  
  
};

const ajax = (...arg) => {
  //接口请求
  return new Promise((resolve, reject) => {
    Api.require(...arg)
      .then(res => {
        if (res.code != 0) {
          checkResCode(res);
        }
        resolve(res);
      })
      .catch(e => {
        // console.log(e)
        console.log("you reject");
        console.log("now error");
        //			window.location.href="./404.html"
      });
  });
};

// const count = (id, href = location.href) => {
//   Api.require("count", {
//     ct: "logapi",
//     ac: "page",
//     event_id: id,
//     url: encodeURIComponent(href),
//     ...fromGame
//   });
// };

window.routeTab = "";
export default {
  addFixed,
  removeFixed,
  // showError,
  params,
  showToast,
  // count,
  ajax,
  isAndroid,
  isIOS,
  isLowAndroid,
  isLowIOS,
  isWX,
  sleep,
  getLocal,
  saveLocal,
  removeLocal,
  getSession,
  saveSession,
  removeSession,
  fromGame,
  checkResCode,
  fixIosTime,
  md5,
  // WX,
  setTitle
};
