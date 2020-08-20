"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qqVideo = require("../static/utils/qqVideo.js");

var _qqVideo2 = _interopRequireDefault(_qqVideo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
var thisPage = null;
exports.default = Page({
  data: {
    scrollViewIndex: 0,
    scrollViewDataArr: [],
    contentHeight: wx.DEFAULT_CONTENT_HEIGHT - 40 + "px",
    size: 10,
    dataJoinWay: "",
    forbidLoadFlag: false,
    showBackTopFlag: false,
    superUserFlag: 2,
    inkBarStyle: {
      display: "none"
    },
    tabStyle: _defineProperty({
      color: "#fff",
      padding: "6rpx 30rpx",
      // "font-weight": "500",
      "font-size": "34rpx"
    }, "color", "#eeeeee"),
    activeTabStyle: {
      color: "#10B0D0",
      "font-weight": "bold",
      "font-size": "45rpx"
    }
  },
  onLoad: function onLoad(e) {
    thisPage = this;
    app.getCertificate().then(function () {
      thisPage.queryVideoCategoryList();
      thisPage.setData({
        superUserFlag: wx.getStorageSync("superUserFlag")
      });
    });
  },
  handleTabsChange: function handleTabsChange(e) {
    var scrollViewDataArr = thisPage.data.scrollViewDataArr;
    var scrollViewIndex = thisPage.data.scrollViewIndex;
    scrollViewDataArr[scrollViewIndex].playVideoId = 0;
    var index = e.detail.index;
    if (!index) index = 0;
    thisPage.setData({
      scrollViewIndex: index,
      scrollViewDataArr: scrollViewDataArr
    });
  },
  handleTabsContentChange: function handleTabsContentChange(e) {
    var scrollViewDataArr = thisPage.data.scrollViewDataArr;
    var scrollViewIndex = thisPage.data.scrollViewIndex;
    scrollViewDataArr[scrollViewIndex].playVideoId = 0;
    var index = e.detail.current;
    if (!index) index = 0;
    thisPage.setData({
      scrollViewIndex: index,
      scrollViewDataArr: scrollViewDataArr
    });

    if (scrollViewDataArr[index].videoDataList.length == 0) {
      var page = scrollViewDataArr[index].page;
      var size = thisPage.data.size;
      thisPage.getVideoList(scrollViewDataArr[index].videoCategoryId, page, size);
    }
  },

  //初始化ScrollView组件内参数
  initScrollViewParam: function initScrollViewParam(videoCategoryList) {
    var scrollViewDataArr = [];
    for (var i = 0, len = videoCategoryList.length; i < len; i++) {
      scrollViewDataArr.push({
        page: 1,
        videoDataList: [],
        totalPage: 0,
        totalNum: 0,
        buttomTextFlag: 0,
        triggered: false,
        playVideoId: 0,
        playVideoSrc: "",
        videoCategoryId: videoCategoryList[i].id
      });
      thisPage.setData({ scrollViewDataArr: scrollViewDataArr });
    }
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
          thisPage.initScrollViewParam(videoCategoryList);
          thisPage.getVideoList(videoCategoryList[0].id, 1, 10);
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
  getVideoList: function getVideoList(videoCategoryId, page, size) {
    thisPage.setData({
      forbidLoadFlag: true
    });
    var jwt = wx.getStorageSync("jwt");
    wx.request({
      url: app.server + "/miniapp/lg/video",
      method: "GET",
      header: {
        Authorization: jwt
      },
      data: {
        videoCategoryId: videoCategoryId,
        page: page,
        size: size
      },
      success: function success(res) {
        var result = res.data;
        if (result.status) {
          var newDataList = res.data.resultObj.records;
          var totalNum = res.data.resultObj.total;
          // 计算总页数
          var totalPage = parseInt((parseInt(totalNum) - 1) / parseInt(size) + 1);

          var scrollViewIndex = thisPage.data.scrollViewIndex;
          var scrollViewDataArr = thisPage.data.scrollViewDataArr;

          if (page == 1) {
            scrollViewDataArr[scrollViewIndex].videoDataList = newDataList;
          } else {
            var dataJoinWay = thisPage.data.dataJoinWay;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = newDataList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var newData = _step.value;

                if (dataJoinWay == "top") {
                  scrollViewDataArr[scrollViewIndex].videoDataList.unshift(newData); //头部累加
                } else if (dataJoinWay == "bottom") {
                  scrollViewDataArr[scrollViewIndex].videoDataList.push(newData); //底部累加
                }
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
          }

          scrollViewDataArr[scrollViewIndex].playVideoId = 0;
          scrollViewDataArr[scrollViewIndex].triggered = false;
          scrollViewDataArr[scrollViewIndex].totalPage = totalPage;
          scrollViewDataArr[scrollViewIndex].totalNum = totalNum;
          scrollViewDataArr[scrollViewIndex].buttomTextFlag = page >= totalPage ? 2 : 1;

          thisPage.setData({
            scrollViewDataArr: scrollViewDataArr
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
          forbidLoadFlag: false,
          dataJoinWay: ""
        });
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  bindscrolltolower: function bindscrolltolower(e) {
    var scrollViewIndex = thisPage.data.scrollViewIndex;
    var scrollViewDataArr = thisPage.data.scrollViewDataArr;
    var page = thisPage.data.scrollViewDataArr[scrollViewIndex].page;
    var size = thisPage.data.size;
    var totalPage = thisPage.data.scrollViewDataArr[scrollViewIndex].totalPage;
    var videoCategoryId = thisPage.data.scrollViewDataArr[scrollViewIndex].videoCategoryId;

    if (thisPage.data.forbidLoadFlagTab) return; //禁止查询标识
    if (page >= totalPage) return;

    page += 1;
    scrollViewDataArr[scrollViewIndex].page = page;
    thisPage.setData({
      scrollViewDataArr: scrollViewDataArr,
      dataJoinWay: "bottom"
    });
    thisPage.getVideoList(videoCategoryId, page, size);
  },

  /**
   * 下拉刷新
   */
  bindrefresherrefresh: function bindrefresherrefresh() {
    var scrollViewIndex = thisPage.data.scrollViewIndex;
    var scrollViewDataArr = thisPage.data.scrollViewDataArr;
    var page = thisPage.data.scrollViewDataArr[scrollViewIndex].page;
    var size = thisPage.data.size;
    var totalPage = thisPage.data.scrollViewDataArr[scrollViewIndex].totalPage;
    var videoCategoryId = thisPage.data.scrollViewDataArr[scrollViewIndex].videoCategoryId;

    if (thisPage.data.forbidLoadFlagTab) return; //禁止查询标识

    scrollViewDataArr[scrollViewIndex].triggered = true;

    if (page >= totalPage) page = 1;else page += 1;

    scrollViewDataArr[scrollViewIndex].page = page;
    thisPage.setData({
      scrollViewDataArr: scrollViewDataArr,
      dataJoinWay: "top"
    });
    thisPage.getVideoList(videoCategoryId, page, size);
  },
  hintNetwork: function hintNetwork(videoParam) {
    if (wx.getStorageSync("notWifiPlayVideo")) return thisPage.playVideo(videoParam);

    wx.getNetworkType({
      success: function success(e) {
        if (e.networkType != "wifi") {
          wx.showModal({
            title: "提示",
            content: "当前非WIFI环境，是否继续播放？",
            success: function success(res) {
              if (res.confirm) {
                wx.setStorage({ key: "notWifiPlayVideo", data: true });
                thisPage.playVideo(videoParam);
              }
            }
          });
        } else thisPage.playVideo(videoParam);
      }
    });
  },

  /**
   *播放视频
   */
  playVideo: function playVideo(e) {
    var vid = e.currentTarget.dataset.vid;
    var playVideoId = e.currentTarget.dataset.playvideoid;
    var index = e.currentTarget.dataset.index;
    var scrollViewIndex = thisPage.data.scrollViewIndex;
    var scrollViewDataArr = thisPage.data.scrollViewDataArr;
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
      scrollViewDataArr[scrollViewIndex].playVideoId = playVideoId;
      scrollViewDataArr[scrollViewIndex].playVideoSrc = playVideoSrc;
      thisPage.setData({
        scrollViewDataArr: scrollViewDataArr,
        useTxVideo: useTxVideo
      });
      thisPage.videoViewStat(playVideoId, index);
    });
  },

  /**
   *进入详情页
   */
  goVideoDetailPage: function goVideoDetailPage(e) {
    var videodata = e.currentTarget.dataset.videodata;
    // console.log(videodata);
    var index = e.currentTarget.dataset.index;
    var page = thisPage.data.page;
    var scrollViewIndex = thisPage.data.scrollViewIndex;
    var scrollViewDataArr = thisPage.data.scrollViewDataArr;
    wx.navigateTo({
      url: "/pages/videoDetail?id=" + videodata.id + "&title=" + videodata.title + "&coverImg=" + videodata.coverImg + "&vid=" + videodata.vid + "&page=" + scrollViewDataArr[scrollViewIndex].page + "&videoCategoryId=" + scrollViewDataArr[scrollViewIndex].videoCategoryId
    });
  },

  /**
   * 视频浏览统计
   */
  videoViewStat: function videoViewStat(videoId, index) {
    wx.request({
      header: {
        Authorization: wx.getStorageSync("jwt")
      },
      method: "PUT",
      url: app.server + "/miniapp/lg/video/count/" + videoId,
      success: function success(res) {
        var status = res.data.status;
        var message = res.data.message;
        if (status) {
          var scrollViewIndex = thisPage.data.scrollViewIndex;
          var scrollViewDataArr = thisPage.data.scrollViewDataArr;
          scrollViewDataArr[scrollViewIndex].videoDataList[index].viewCount = res.data.resultObj;
          thisPage.setData({ scrollViewDataArr: scrollViewDataArr });
        } else {
          app.showToastNoneIcon(message);
        }
      },
      fail: function fail(e) {
        console.log(e);
      },
      complete: function complete() {}
    });
  },
  onHide: function onHide() {
    var scrollViewIndex = thisPage.data.scrollViewIndex;
    var scrollViewDataArr = thisPage.data.scrollViewDataArr;
    scrollViewDataArr[scrollViewIndex].playVideoId = 0;
    thisPage.setData({ scrollViewDataArr: scrollViewDataArr });
  },
  goVideoPage: function goVideoPage() {
    var superUserFlag = wx.getStorageSync("superUserFlag");
    if (superUserFlag != 1) return;
    wx.navigateTo({
      url: "/pages/super/video"
    });
  },

  /**
   * 分享信息
   */
  onShareAppMessage: function onShareAppMessage(e) {
    if (e.from == "button") {
      var id = e.target.dataset.videodata.id;
      var title = e.target.dataset.videodata.title;
      var coverImg = e.target.dataset.videodata.coverImg;
      var vid = e.target.dataset.videodata.vid;
      var scrollViewIndex = thisPage.data.scrollViewIndex;
      var page = thisPage.data.scrollViewDataArr[scrollViewIndex].page;
      var videoCategoryId = thisPage.data.scrollViewDataArr[scrollViewIndex].videoCategoryId;
      var path = "/pages/videoDetail?id=" + id + "&title=" + title + "&coverImg=" + coverImg + "&vid=" + vid + "&page=" + page + "&videoCategoryId=" + videoCategoryId;

      return {
        title: title,
        path: path,
        imageUrl: coverImg
      };
    }
  }
});