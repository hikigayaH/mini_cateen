// component/nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles: {
      type: Array,
      value: []
      // observer:
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentindex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemclick(event) {
      this.data.currentindex = event.currentTarget.dataset.index;
      this.setData({ currentindex: this.data.currentindex });
      console.log(event);
      let title = event.currentTarget.dataset.item;
      this.triggerEvent("ontabclick", { title })
    }
  }
})
