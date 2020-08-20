"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var thisPage = null;
exports.default = Page({
  data: {
    page: 1,
    size: 10,
    pointGoodsList: [],
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
    PADDING_TOP: wx.STATUS_BAR_HEIGHT + "px"
  },
  onLoad: function onLoad(e) {
    thisPage = this;
    app.getCertificate().then(function () {
      var page = thisPage.data.page;
      var size = thisPage.data.size;
      thisPage.queryPointGoodsList(page, size);
    });
  },
  queryPointGoodsList: function queryPointGoodsList(page, size) {
    wx.showToast({
      icon: "loading",
      duration: 16000,
      mask: true
    });
    thisPage.setData({
      forbidLoadFlag: true
    });
    var jwt = wx.getStorageSync("jwt");
    wx.request({
      url: app.server + "/miniapp/point/goods",
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

          var pointGoodsList = thisPage.data.pointGoodsList;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = newDataList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var newData = _step.value;

              pointGoodsList.push(newData); //底部累加
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
            pointGoodsList: pointGoodsList,
            totalPage: totalPage,
            totalNum: totalNum
          });
          wx.hideToast();
        } else {
          var message = res.data.message;
          wx.showToast({
            title: message,
            icon: "none"
          });
          wx.hideToast();
        }
      },
      fail: function fail(e) {
        console.log(e);
      },
      complete: function complete(e) {
        thisPage.setData({
          forbidLoadFlag: false
        });
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function onReachBottom(e) {
    // var page = thisPage.data.page;
    // var size = thisPage.data.size;
    // var totalPage = thisPage.data.totalPage;
    // if (thisPage.data.forbidLoadFlag) return; //禁止查询标识
    // if (page >= totalPage) return;
    // page += 1;
    // thisPage.queryPointGoodsList(page, size);
    // thisPage.setData({
    //   page: page
    // });
  },
  goPointGoodsDetailPage: function goPointGoodsDetailPage(e) {
    var pointgoodsid = e.currentTarget.dataset.pointgoodsid;
    wx.navigateTo({
      url: "/pages/pointGoodsDetail?pointGoodsId=" + pointgoodsid
    });
  },
  goForagePage: function goForagePage() {
    wx.navigateTo({
      url: "/pages/forage?scene=6"
    });
  },
  goRankPage: function goRankPage() {
    wx.navigateTo({
      url: "/pages/rank"
    });
  }
});