
var moment = require('moment')

module.exports = Behavior({
  properties: {
    value: {
      type: [String, Array],
      value: ['2018/9/2', '2018/10/3'],
      observer (val) {
        if (typeof val === 'string') {
          let [year, month, day] = val.split('/').map((x) => Number(x))
          console.log(day)
          for (let i = 0; i < this.data.monthsArray.length; i++) {
            if (year === this.data.monthsArray[i].year && month ===  this.data.monthsArray[i].month) {
              this.setData({
                monthSwiperIndex: i
              })
              console.log(val)
              let dIndex = this.momentTransToItem(moment(val)).dayIndex
              let mIndex = this.momentTransToItem(moment(val)).monthIndex
              this.selectSingle(mIndex, dIndex)
              break
            }
          }
        } else {
        }
      }
    },
    datePage: {
      type: [String, Number],
      observer (val) {
        console.log(val)
        let [year, month] = val.split('/').map((x) => Number(x))
        console.log(year, month)
        for (let i = 0; i < this.data.monthsArray.length; i++) {
        if (year === this.data.monthsArray[i].year && month ===  this.data.monthsArray[i].month) {
            this.setData({
              monthSwiperIndex: i
            })
            break
          }
        }
      }
    },
    height: { // done
      type: [String, Number],
      value: 340
    },
    themeColor: { // done
      type: String,
    },
    selectRangeMode: { // done
      type: Boolean,
      value: true
    },
    dateRange: { // done
      type: Array,
      value: [6, 6]
    },
    disablePastDays: { //done
      type: Boolean,
      value: true
    },
    disableForeDays: { // done
      type: Boolean,
      value: false
    },
    startShow: { // done
      type: [String, Array],
      value: 'today'
    },
    maxRange: { // done
      type: [Number, String],
      value: 30
    },
    canSelectToday: { //done
      type: Boolean,
      value: true
    },
    startRangeColor: { // done
      type: String,
      value: '#3399FF'
    },
    rangeColor: { // done
      type: String,
      value: 'pink'
    },
    endRangeColor: { // done
      type: String,
      value: 'red'
    },
    headerHeight: {
      type: [Number, String],
      value: 50
    },
    monthTitleStyle: { // done
      type: String,
      value: 'border-bottom:solid 1px #ccc'
    }
  },
})