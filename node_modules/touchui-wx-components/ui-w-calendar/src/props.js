module.exports = Behavior({
  properties: {
    value: {
      type: [String, Array],
      observer (val) {
        
      }
    },
    height: { // done
      type: [String, Number],
      value: 340
    },
    themeColor: { // done
      type: String
    },
    selectRangeMode: { // done
      type: Boolean,
      value: true
    },
    dateRange: { // done
      type: Array,
      value: [1,1]
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
      value: false
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