export default function (obj) {
  let rstr = '@_@_@_@_@_@_@_'
  let str = JSON.stringify(obj)
  if (str) {
    let arr = str.match(/\(.*?\)/g)
    let newStr = str.replace(/\(.*?\)/g, '@_@_@_@_@_@_@_').replace(/"|{|}/g, '').replace(/,/g, ';')
    if (arr && arr.length) {
      arr.forEach((item, index) => {
        newStr = newStr.replace('@_@_@_@_@_@_@_', item)
      })
    }
    return newStr
  } else {
    return ''
  }
}