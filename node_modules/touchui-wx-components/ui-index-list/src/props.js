module.exports = Behavior({
  properties: {
    data: {
      type: Array,
      observer (val) {
        this.updateAttached()
        this.updateReady()
      }
    },
    checkbox: {
      type: Boolean,
      value: true
    },
    showToast: {
      type: Boolean,
      value: true
    },
    color: {
      type: String
    },
    showTop: {
      type: Boolean,
      value: false
    },
    height: {
      type: [Number, String],
      value: 300
    }
  },
})
