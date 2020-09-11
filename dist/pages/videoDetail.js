"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qqVideo = require("../static/utils/qqVideo.js");

var _qqVideo2 = _interopRequireDefault(_qqVideo);

var _data = require("../static/data/data.js");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
var thisPage = null;
exports.default = Page({
  data: {
    contentHeight: wx.DEFAULT_CONTENT_HEIGHT - 211 - 46 + "px",
    page: 1,
    size: 10,
    totalNum: 0,
    videoDataList: [],
    playVideoData: {}
  },
  onLoad: function onLoad(e) {
    thisPage = this;
    var playVideoData = thisPage.data.playVideoData;
    playVideoData.id = e.id;
    playVideoData.title = e.title;
    playVideoData.coverImg = e.coverImg;
    playVideoData.vid = e.vid;
    playVideoData.videoCategoryId = e.videoCategoryId;
    thisPage.bulidVideoSrc(playVideoData);

    var page = parseInt(e.page);
    var size = thisPage.data.size;
    thisPage.setData({
      page: page,
      videoCategoryId: playVideoData.videoCategoryId,
      playVideoData: playVideoData
    });

    if (getCurrentPages().length == 1) {
      thisPage.getVideoList(page, size);
      thisPage.autoPlay();
    } else {
      thisPage.getVideoList(page, size);
      thisPage.autoPlay();
    }
  },
  autoPlay: function autoPlay() {
    if (wx.getStorageSync("notWifiPlayVideo")) return thisPage.setData({ autoplay: true });

    wx.getNetworkType({
      success: function success(e) {
        if (e.networkType != "wifi") {
          wx.showModal({
            title: "提示",
            content: "当前非WIFI环境，是否继续播放？",
            success: function success(res) {
              if (res.confirm) {
                wx.setStorage({ key: "notWifiPlayVideo", data: true });
                thisPage.setData({ autoplay: true });
                var videoContext = wx.createVideoContext("myVideo", thisPage);
                videoContext.play();
              } else thisPage.setData({ autoplay: false });
            }
          });
        } else thisPage.setData({ autoplay: true });
      }
    });
  },

  /**
   *组装视频数据对象
   */
  bulidVideoSrc: function bulidVideoSrc(playVideoData) {
    _qqVideo2.default.getVideoes(playVideoData.vid).then(function (response) {
      var src = response.src;
      var useTxVideo = false;
      if (src) {
        playVideoData.realSrc = src;
      } else {
        //未获取到视频地址，使用腾讯视频控件播放
        playVideoData.useTxVideo = true;
      }
      thisPage.setData({ playVideoData: playVideoData });
    });
  },

  /**
   * 查询视频列表
   */
  getVideoList: function getVideoList(page, size) {
    var totalNum = 60;
    // 计算总页数
    var totalPage = parseInt((parseInt(totalNum) - 1) / parseInt(size) + 1);
    var startIndex = 10 * page;
    var endIndex = 10 * page + 10;
    var videoList = _data2.default.videoList;
    var newDataList = videoList[thisPage.data.videoCategoryId].slice(startIndex, endIndex);
    var videoDataList = thisPage.data.videoDataList;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = newDataList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var newData = _step.value;

        newData.videoCategoryId = thisPage.data.videoCategoryId;
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
      totalNum: totalNum,
      buttomTextFlag: page >= totalPage - 1 ? 2 : 1,
      moreDataText: page >= totalPage - 1 ? "人家也是有底线的" : "点击加载更多"
    });
  },

  /**
   * 加载更多相关视频
   */
  loadMore: function loadMore() {
    var page = thisPage.data.page;
    var size = thisPage.data.size;
    var totalPage = thisPage.data.totalPage;

    if (thisPage.data.forbidLoadFlag) return; //禁止查询标识
    if (page >= totalPage - 1) return;

    thisPage.setData({ moreDataText: "加载中..." });

    page += 1;
    thisPage.getVideoList(page, size);

    thisPage.setData({
      page: page
    });
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
    var playVideoData = e.currentTarget.dataset.videodata;
    var index = e.currentTarget.dataset.index;
    var vid = playVideoData.vid;

    if (playVideoData.id == thisPage.data.playVideoData.id) return;

    _qqVideo2.default.getVideoes(vid).then(function (response) {
      var src = response.src;
      if (src) {
        playVideoData.realSrc = src;
      } else {
        //未获取到视频地址，使用腾讯视频控件播放
        playVideoData.useTxVideo = true;
      }

      playVideoData.viewCount = playVideoData.viewCount + 1;
      thisPage.setData({
        playVideoData: playVideoData,
        autoplay: true
      });
    });
  },

  /**
   * 分享信息
   */
  onShareAppMessage: function onShareAppMessage(e) {
    var videodata = thisPage.data.playVideoData;
    var page = thisPage.data.page;
    var title = videodata.title;
    var path = "/pages/videoDetail?id=" + videodata.id + "&title=" + videodata.title + "&coverImg=" + videodata.coverImg + "&vid=" + videodata.vid + "&page=" + page + "&videoCategoryId=" + videodata.videoCategoryId;

    return {
      title: title,
      path: path,
      imageUrl: videodata.coverImg
    };
  }
});