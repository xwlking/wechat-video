"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qqVideo = require("../../static/utils/qqVideo.js");

var _qqVideo2 = _interopRequireDefault(_qqVideo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
var thisPage = null;
exports.default = Page({
  data: {
    vcData: ["v1", "v2", "v3"],
    page: 1,
    size: 10,
    totalPage: 0,
    totalNum: 0,
    videoDataList: [],
    videoPageUrl: "",
    forbidLoadFlag: false
  },
  onLoad: function onLoad() {
    thisPage = this;
    var superUserFlag = wx.getStorageSync("superUserFlag");
    thisPage.setData({ superUserFlag: superUserFlag });
    if (superUserFlag != 1) {
      wx.showModal({
        title: "提示",
        content: "无该页面访问权限",
        confirmText: "访问首页",
        showCancel: false,
        success: function success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/discover"
            });
          }
        }
      });
    }
    thisPage.queryVideoCategoryList();
  },
  reload: function reload() {
    thisPage.setData({ videoDataList: [], totalNum: 0 });
    var page = 1;
    var size = thisPage.data.size;
    thisPage.getVideoList(page, size);
  },
  catchQQVideo: function catchQQVideo() {
    var videoCategoryIds = "";
    var videoCategoryList = thisPage.data.videoCategoryList;
    for (var i = 0, len = videoCategoryList.length; i < len; i++) {
      var ele = videoCategoryList[i];
      if (ele.selectedFlag) {
        videoCategoryIds += ele.id + ",";
      }
    }
    videoCategoryIds = videoCategoryIds.substring(0, videoCategoryIds.length - 1);

    if (!videoCategoryIds) {
      wx.showToast({
        title: "请选择分类",
        icon: "none"
      });
      return;
    }

    var videoPageUrl = thisPage.data.videoPageUrl;
    if (!videoPageUrl) {
      wx.showToast({
        title: "地址不能为空",
        icon: "none"
      });
      return;
    }

    var jwt = wx.getStorageSync("jwt");
    wx.request({
      url: app.server + "/miniapp/lg/super/qq/video?videoPageUrl=" + videoPageUrl + "&videoCategoryIds=" + videoCategoryIds,
      method: "GET",
      header: {
        Authorization: jwt
      },
      success: function success(res) {
        var result = res.data;
        if (result.status) {
          thisPage.reload();
        } else {
          var message = res.data.message;
          wx.showToast({
            title: message,
            icon: "none"
          });
        }
      },
      fail: function fail(res) {
        wx.showToast({
          title: res,
          icon: "none",
          duration: 5000
        });
      },
      complete: function complete(e) {
        thisPage.setData({ videoPageUrl: "" });
      }
    });
  },
  addVideo: function addVideo(id, vid) {
    _qqVideo2.default.getVideoes(vid).then(function (response) {
      var videoInfo = response;
      var jwt = wx.getStorageSync("jwt");
      wx.request({
        url: app.server + "/miniapp/lg/super/qq/video",
        method: "POST",
        data: {
          id: id,
          realSrc: videoInfo.src,
          duration: videoInfo.duration
        },
        header: {
          Authorization: jwt
        },
        success: function success(res) {
          var result = res.data;
          if (result.status) {
            thisPage.reload();
            thisPage.setData({ videoPageUrl: "" });
          } else {
            var message = res.data.message;
            wx.showToast({
              title: message,
              icon: "none"
            });
          }
        },
        fail: function fail(res) {
          wx.showToast({
            title: res,
            icon: "none",
            duration: 5000
          });
        }
      });
    });
  },
  deleteVideo: function deleteVideo(e) {
    var videoId = e.currentTarget.dataset.videoid;
    wx.showModal({
      title: "确认删除吗？",
      success: function success(res) {
        if (res.confirm) {
          var jwt = wx.getStorageSync("jwt");
          wx.request({
            url: app.server + "/miniapp/lg/super/qq/video/" + videoId,
            method: "PUT",
            header: {
              Authorization: jwt
            },
            success: function success(res) {
              var result = res.data;
              if (result.status) {
                thisPage.reload();
              } else {
                var message = res.data.message;
                wx.showToast({
                  title: message,
                  icon: "none"
                });
              }
            },
            fail: function fail(res) {
              wx.showToast({
                title: res,
                icon: "none",
                duration: 5000
              });
            }
          });
        }
      }
    });
  },

  /**
   * 查询分类列表
   */
  queryVideoCategoryList: function queryVideoCategoryList() {
    var jwt = wx.getStorageSync("jwt");
    wx.request({
      url: app.server + "/miniapp/lg/video/category",
      method: "GET",
      header: {
        Authorization: jwt
      },
      data: {
        page: 1,
        size: 10
      },
      success: function success(res) {
        var result = res.data;
        if (result.status) {
          var videoCategoryList = res.data.resultObj;
          thisPage.setData({
            videoCategoryList: videoCategoryList
          });
          thisPage.getVideoList(1, 10);
        } else {
          var message = res.data.message;
          wx.showToast({
            title: message,
            icon: "none"
          });
        }
      },
      fail: function fail(e) {
        // app.requestSeverFailHint();
      },
      complete: function complete(e) {}
    });
  },

  /**
   * 查询视频列表
   */
  getVideoList: function getVideoList(page, size) {
    thisPage.setData({
      forbidLoadFlag: true
    });
    var jwt = wx.getStorageSync("jwt");
    wx.request({
      url: app.server + "/miniapp/lg/super/video",
      method: "GET",
      header: {
        Authorization: jwt
      },
      data: {
        page: page,
        size: size
      },
      success: function success(res) {
        var result = res.data;
        if (result.status) {
          var newDataList = res.data.resultObj.records;
          var totalNum = res.data.resultObj.total;
          var totalPage = parseInt((parseInt(totalNum) - 1) / parseInt(size) + 1); // 计算总页数

          var videoDataList = thisPage.data.videoDataList;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = newDataList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var newData = _step.value;

              videoDataList.push(newData); //底部累加
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          thisPage.setData({
            videoDataList: videoDataList,
            totalPage: totalPage,
            totalNum: totalNum
          });
        } else {
          var message = res.data.message;
          wx.showToast({
            title: message,
            icon: "none"
          });
        }
      },
      fail: function fail(e) {
        // app.requestSeverFailHint();
      },
      complete: function complete(e) {
        thisPage.setData({
          forbidLoadFlag: false
        });
      }
    });
  },

  /**
   *播放视频
   */
  playVideo: function playVideo(e) {
    var videodata = e.currentTarget.dataset.videodata;
    var vid = videodata.vid;

    _qqVideo2.default.getVideoes(vid).then(function (response) {
      var src = response.src;
      var playVideoSrc = "";
      var useTxVideo = false;

      if (src) {
        playVideoSrc = src;
      } else {
        //未获取到视频地址，使用腾讯视频控件播放
        useTxVideo = true;
      }

      thisPage.setData({
        playVideoId: videodata.id,
        playVideoSrc: playVideoSrc,
        useTxVideo: useTxVideo
      });
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function onReachBottom(e) {
    var page = thisPage.data.page;
    var size = thisPage.data.size;
    var totalPage = thisPage.data.totalPage;

    if (thisPage.data.forbidLoadFlag) return; //禁止查询标识
    if (page >= totalPage) return;

    page += 1;
    thisPage.getVideoList(page, size);

    thisPage.setData({
      page: page
    });
  },
  contentInputTextarea: function contentInputTextarea(e) {
    thisPage.setData({
      videoPageUrl: e.detail.value
    });
  },
  selectVc: function selectVc(e) {
    var index = e.currentTarget.dataset.index;
    var videoCategoryList = thisPage.data.videoCategoryList;
    var videoCategory = videoCategoryList[index];
    if (videoCategory.selectedFlag) {
      videoCategory.selectedFlag = false;
    } else {
      videoCategory.selectedFlag = true;
    }
    videoCategoryList[index] = videoCategory;
    thisPage.setData({
      videoCategoryList: videoCategoryList
    });
  }
});