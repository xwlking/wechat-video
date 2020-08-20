export default class BaseElement {
  constructor (vm) {
    this.vm = vm
  }
  setData (data) {
    this.vm.setData(data)
  }
}