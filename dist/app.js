"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require("./static/utils/system.js");

var _system3 = _interopRequireDefault2(_system);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _system2 = _interopRequireDefault(_system3.default);

var _qqmapWxJssdkMin = require("./static/utils/qqmap-wx-jssdk.min.js");

var _qqmapWxJssdkMin2 = _interopRequireDefault(_qqmapWxJssdkMin);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var thisPage = null;
exports.default = App({
  server: "https://ma.xiaowenlong.com"
  // server: "http://192.168.20.66:6868",
  ,
  globalData: {},
  onLaunch: function onLaunch(options) {
    wx.setStorageSync("scene", options.scene);
    _system3.default.attachInfo();
    thisPage = this;
    thisPage.checkVersion();
  },
  onShow: function onShow() {
    thisPage.networkStatusChangeListening();
  },
  refreshTxnid: function refreshTxnid() {
    var jwt = wx.getStorageSync("jwt");
    wx.request({
      url: thisPage.server + "/miniapp/common/txnid",
      method: "GET",
      header: {
        Authorization: jwt
      },
      success: function success(res) {
        var result = res.data;
        thisPage.globalData.txnId = result.resultObj;
      },
      fail: function fail(e) {
        console.log(e);
      },
      complete: function complete() {}
    });
  },

  /**
   * 微信授权
   */
  registerWechat: function registerWechat(e) {
    return new Promise(function (resolve) {
      wx.getSetting({
        success: function success(res) {
          var authSetting = res.authSetting;
          var userInfoAuth = authSetting["scope.userInfo"];
          if (!userInfoAuth) {
            //未授权用户信息
            return;
          } else {
            var userInfo = e.detail.userInfo;
            if (userInfo) {
              wx.showToast({
                title: "加载中",
                icon: "loading",
                duration: 16000,
                mask: true
              });

              var nickName = userInfo.nickName;
              var avatarUrl = userInfo.avatarUrl;
              var gender = userInfo.gender; //性别 0：未知、1：男、2：女
              var province = userInfo.province;
              var city = userInfo.city;
              var country = userInfo.country;
              var language = userInfo.language;

              var phoneBrand, phoneModel, platform, system, wxVersion;
              //获取设备信息
              wx.getSystemInfo({
                success: function success(res) {
                  phoneBrand = res.brand;
                  phoneModel = res.model;
                  platform = res.platform;
                  system = res.system;
                  wxVersion = res.version;
                }
              });

              //登记微信
              wx.request({
                url: thisPage.server + "/miniapp/lg/user/register/wechat",
                header: {
                  Authorization: wx.getStorageSync("jwt")
                },
                method: "POST",
                data: {
                  nickName: nickName,
                  headImgUrl: avatarUrl,
                  gender: gender,
                  language: language,
                  country: country,
                  province: province,
                  city: city,
                  phoneBrand: phoneBrand,
                  phoneModel: phoneModel,
                  platform: platform,
                  systemVersion: system,
                  wxVersion: wxVersion
                },
                success: function success(res2) {
                  var result = res2.data;
                  if (!result.resultObj) {
                    wx.hideToast();
                  } else if (result.status) {
                    wx.setStorageSync("jwt", result.resultObj.jwt);
                    wx.setStorageSync("registerStatus", result.resultObj.registerStatus);
                    wx.hideToast();
                    resolve();
                  } else {
                    wx.showToast({
                      title: result.message,
                      icon: "none"
                    });
                  }
                },
                fail: function fail(e) {
                  console.log(e);
                },
                complete: function complete() {}
              });
            } else {
              console.log("获取用户信息失败");
            }
          }
        },
        fail: function fail(e) {
          console.log(e);
        },
        complete: function complete() {}
      });
    });
  },

  /**
   * wxCode换取凭证，凭证不存在则用户未注册
   */
  getCertificate: function getCertificate() {
    return new Promise(function (resolve) {
      //QQMapWX必须在开始就初始化
      var qqmapsdk = new _qqmapWxJssdkMin2.default({
        key: "FZIBZ-2WTRX-WXK4W-7XAOQ-P4XQO-BKBBG" // 必填
      });
      //1、获取当前位置坐标
      wx.getLocation({
        type: "wgs84",
        complete: function complete(res) {
          var latitude = res.latitude; //纬度
          var longitude = res.longitude; //经度
          //根据坐标获取当前位置名称:腾讯地图逆地址解析
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            complete: function complete(addressRes) {
              var locationDescription = "未授权位置";
              if (addressRes) {
                var result = addressRes["result"];
                if (result) {
                  var address = result.address;
                  locationDescription = address + ";" + (latitude + "," + longitude);
                }
              }

              var location = locationDescription;
              var scene = wx.getStorageSync("scene");
              wx.removeStorageSync("scene");

              wx.getSystemInfo({
                success: function success(sysInfoRes) {
                  wx.login({
                    success: function success(res1) {
                      var wxCode = res1.code;
                      if (wxCode) {
                        wx.request({
                          url: thisPage.server + "/miniapp/lg/user/certificate/" + wxCode,
                          method: "GET",
                          data: {
                            location: location,
                            scene: scene ? scene : "-",
                            platform: sysInfoRes.platform
                          },
                          success: function success(res) {
                            var status = res.data.status;
                            var message = res.data.message;
                            if (status) {
                              var resultObj = res.data.resultObj;
                              wx.setStorageSync("jwt", resultObj.jwt);
                              wx.setStorageSync("wxUserId", resultObj.wxUserId);
                              wx.setStorageSync("petNickName", resultObj.petNickName);
                              wx.setStorageSync("petHeadImgUrl", resultObj.petHeadImgUrl);
                              wx.setStorageSync("headImgAuditStatus", resultObj.headImgAuditStatus);
                              wx.setStorageSync("superUserFlag", resultObj.superUserFlag);
                              wx.setStorageSync("registerStatus", resultObj.registerStatus);
                              resolve();
                            } else {
                              console.log("登录失败！" + message);
                            }
                          },
                          fail: function fail(e) {
                            console.log(e);
                          },
                          complete: function complete() {}
                        });
                      } else {
                        console.log("登录失败！" + res.errMsg);
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  },
  networkStatusChangeListening: function networkStatusChangeListening() {
    //监听网络状态变化
    wx.onNetworkStatusChange(function (res) {
      var isConnected = res.isConnected;
      var networkType = res.networkType;
      if (!isConnected) {
        //未联网时
        wx.showToast({
          title: "当前网络可能不稳定",
          icon: "none"
        });
      } else {
        if (networkType == "2g" || networkType == "3g") wx.showToast({
          title: "当前网络信号较弱",
          icon: "none"
        });else if (networkType == "unknown") {
          wx.showToast({
            title: "当前网络可能不稳定",
            icon: "none"
          });
        }
      }
    });
  },

  /**
   * 检查版本
   */
  checkVersion: function checkVersion() {
    var updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success: function success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          });
        });

        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showModal({
            title: "更新提示",
            content: "更新失败，是否重新更新？",
            success: function success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          });
        });
      }
    });
  },
  onError: function onError(e) {
    console.log(e);
  }
});