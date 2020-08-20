module.exports = Behavior({
  properties: {
    width: {
      type: [Number, String],
    },
    value: {
      type: [Number, String]
    },
    min: {
      type: [Number, String],
      value: 0
    },
    max: {
      type: [Number, String],
      value: 1000
    },
    step: {
      type: [Number, String],
      value: 100
    },
    keyStep: {
      type: [Number, String],
      value: 500
    },
    pointerWidth: {
      type: [Number, String],
      value: 2
    },
    pointerColor: {
      type: String,
      value: 'red'
    },
    stepWidth: {
      type: [Number, String],
      value: 10
    },
    lineWidth: {
      type: [Number, String],
      value: 1
    },
    lineHeight: {
      type: [Number, String] // not don
    },
    keyLineHeight: { // not
      type: [Number, String]
    },
    height: {
      type: [Number, String],
      value: 50
    },
    showNumber: {
      type: Boolean,
      value: true
    },
    mode: {
      type: String, // not done
      value: 'bottom'
    },
    numberColor: {
      type: String, // no use
      value: '#E0E0E0'
    },
    color: { // no use
      type: String,
      value: '#E0E0E0'
    },
    numberSize: {
      type: [Number, String],
      value: 10
    },
    numberPadding: {
      type: Number,
      value: 5
    },
    valueStyle: {
      type: [String, Object],
      value: ''
    }
  },
})