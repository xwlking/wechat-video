'use strict';

var count = 0;

// 用来装视频列表
var videoSrcArr = new Array();

var qqVideo = {
  getVideoes: function getVideoes(vid) {
    count = 0;
    videoSrcArr = new Array();
    var that = this;
    var videoUrl = 'https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=' + vid;
    var host;
    return new Promise(function (resolve) {
      wx.request({
        url: videoUrl,
        success: function success(res) {
          var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
          var dataJson1 = dataJson.replace(/;qwe/, '');
          var data = JSON.parse(dataJson1);
          if (!data.vl) {
            resolve("");
            return;
          }
          var fn_pre = data.vl.vi[0].lnk;
          host = data['vl']['vi'][0]['ul']['ui'][0]['url'];
          var streams = data['fl']['fi'];
          var seg_cnt = data['vl']['vi'][0]['cl']['fc'];
          if (parseInt(seg_cnt) == 0) {
            seg_cnt = 1;
          }
          var best_quality = streams[streams.length - 1]['name'];
          var part_format_id = streams[streams.length - 1]['id'];
          // var part_format_id = streams[0]['id']
          for (var i = 1; i < seg_cnt + 1; i++) {
            // var filename = fn_pre + '.p' + (part_format_id % 10000) + '.' + i + '.mp4';
            var filename = fn_pre + '.p' + part_format_id + '.' + i + '.mp4';
            requestVideoUrls(part_format_id, vid, filename, host, seg_cnt).then(function (response) {
              resolve({
                "src": response[0],
                "duration": data.preview
              });
            });
          }
        }
      });
    });
  }
};

function requestVideoUrls(part_format_id, vid, fileName, host, videoCount) {
  var keyApi = "https://vv.video.qq.com/getkey?otype=json&platform=11&format=" + part_format_id + "&vid=" + vid + "&filename=" + fileName + "&appver=3.2.19.333";

  return new Promise(function (resolve) {
    wx.request({
      url: keyApi,
      success: function success(res) {
        var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
        var dataJson1 = dataJson.replace(/;qwe/, '');
        var data = JSON.parse(dataJson1);
        if (data.key != undefined) {
          var vkey = data['key'];
          var url = host + fileName + '?vkey=' + vkey;
          var vidoeSrc = String(url);
          videoSrcArr.push(vidoeSrc);
        }
        count++;
        // 判断视频是否全部获取，获取全部视频再返回
        if (count == videoCount) {
          if (videoSrcArr.length == 0) {
            var videoUrl = "https://h5vv.video.qq.com/getinfo?encver=300&_qv_rmtv2=4479338b32b684b05e005a2a99001702&defn=auto&platform=4210801&otype=json&sdtfrom=v4169&_rnd=1538474481&appVer=7&vid=" + vid + "&newnettype=0";
            wx.request({
              url: videoUrl,
              success: function success(res) {
                var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
                var dataJson1 = dataJson.replace(/;qwe/, '');
                var data = JSON.parse(dataJson1);
                // var fn_pre = data.vl.vi[0].lnk
                host = data['vl']['vi'][0]['ul']['ui'][0]['url'];
                var fn = data['vl']['vi'][0]["fn"];
                var fvkey = data['vl']['vi'][0]["fvkey"];
                var url = host + fn + "?vkey=" + fvkey;
                videoSrcArr.push(url);
                resolve(videoSrcArr);
              }
            });
          } else resolve(videoSrcArr);
        }
      }
    });
  });
}
module.exports = qqVideo;