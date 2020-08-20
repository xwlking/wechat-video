export default function Dater (y, m, d) {
  var date = new Date()
  var y = y || date.getFullYear(),
    m = m || date.getMonth() + 1,
    d = d || date.getDate()
  var isLeapYear = function (years) {
    return !!((years % 4 == 0 && years % 100 !== 0) || (years % 400 === 0))
  }
  var getFirstDay = function (y, m, d) {
    var d = new Date(y, m, d)
    d.setDate(1)
    return d.getDay()
  }
  var getMonthDay = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  var prem = [], im = [], nextm = [], lastmd = getMonthDay[m - 1 - 1]

  if (getFirstDay(y, m - 1, d) === 0) {
    for (var i = 6; i >= 0; i--) {
      prem[6 - i] = lastmd - i
    }
  } else {
    for (var i = getFirstDay(y, m - 1, d); i > 0; i--) {
      prem[getFirstDay(y, m - 1, d) - i] = lastmd - i + 1
    }
  }
  for (var i = 0; i < getMonthDay[m - 1]; i++) {
    im[i] = i + 1
  }
  var nextlen = 42 - (prem.length + getMonthDay[m - 1])
  for (var i = 0; i < nextlen; i++) {
    nextm[i] = i + 1
  }
  if (isNaN(prem[0])) {
    for (let i = 0; i < prem.length; i++) {
      prem[i] = 31 - prem.length + i + 1
    }
  }
  this.monthDays = {
    preMonthDays: prem,
    thisMonthDays: im,
    nextMonthDays: nextm,
    day: d,
    month: m,
    year: y
  }
  var arr = []
  for (var i = 0; i < 7; i++) {
    var weekDate = new Date()
    weekDate.setFullYear(y)
    weekDate.setMonth(m - 1)
    weekDate.setDate(d - 1)
    var weekday = weekDate.getDay()// 获取星期几
    var newday = weekDate.getDate() + 1 - weekday + i
    weekDate.setDate(newday - 1)
    arr.push({
      year: weekDate.getFullYear(),
      month: weekDate.getMonth() + 1,
      day: weekDate.getDate() + 1
    })
  }
  this.weekDays = {
    data: arr,
    day: d,
    month: m,
    year: y
  }
  // var array = []
  // for (var i = 0; i < prem.length; i++) {
  //   array.push(`${y}-${m - 1}-${prem[i]}`)
  // }
  // for (var i = 0; i < im.length; i++) {
  //   array.push(`${y}-${m}-${im[i]}`)
  // }
  // for (var i = 0; i < nextm.length; i++) {
  //   array.push(`${y}-${m + 1}-${nextm[i]}`)
  // }
  // console.log(array)
  // var arrayIndex = 0;
  // for (var i = 0; i < array.length; i++) {
  //   if(m === Number(array[i].split('-')[1]) && d === Number(array[i].split('-')[2])) {
  //     arrayIndex = i
  //     break
  //   }
  // }
};

Dater.change = function (anchor, type, time) {
  var date = new Date()
  date.setFullYear(anchor.year, anchor.month - 1, anchor.day)
  switch (type) {
    case 'y': {
      date.setFullYear(date.getFullYear() + time)
      break
    }
    case 'm': {
      date.setMonth(date.getMonth() + time)
      break
    }
    case 'w': {
      date.setDate(date.getDate() + time * 7)
      break
    }
    case 'd': {
      date.setDate(date.getDate() + time)
      break
    }
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}

Dater.getTodayAnchor = function () {
  var date = new Date()
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}
Dater.AnchorToDayString = function (anchor) {
  // return '' + anchor.year + (anchor.month < 10 ? '0' : '') + anchor.month + (anchor.day < 10 ? '0' : '') + anchor.day
  // console.log( `${anchor.year}/${anchor.month < 10 ? '0': ''}${anchor.month}/${anchor.day < 10 ? '0' : ''}${anchor.day}`)
  return `${anchor.year}/${anchor.month < 10 ? '0': ''}${anchor.month}/${anchor.day < 10 ? '0' : ''}${anchor.day}`
}