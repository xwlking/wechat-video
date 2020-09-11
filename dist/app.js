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