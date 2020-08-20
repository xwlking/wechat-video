"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var thisPage = null;
exports.default = Component({
  properties: {
    title: {
      type: String,
      value: "流光小视频"
    },
    backIcon: {
      type: Boolean,
      value: true
    },
    bgColor: {
      type: String,
      value: "white"
    },
    titleColor: {
      type: String,
      value: "black"
    },
    borderBottom: {
      type: Boolean,
      value: true
    },
    arrowColor: {
      type: String,
      value: "#333333"
    }
  },
  data: {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
    navBarStyle: {
      backgroundColor: "#fbf195"
    }
  },
  methods: {
    navigateBack: function navigateBack() {
      var pages = getCurrentPages();
      if (pages.length == 1) {
        wx.reLaunch({
          url: "/pages/index"
        });
      } else wx.navigateBack();
    }
  }
});