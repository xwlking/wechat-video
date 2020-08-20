export default class SystemHelper {
  static isIos () {
    let systemInfo = wx.getSystemInfoSync()
    return /ios/i.test(systemInfo.system)
  }
  static isAndroid () {
    let systemInfo = wx.getSystemInfoSync()
    return /android/i.test(systemInfo.system)
  }
}