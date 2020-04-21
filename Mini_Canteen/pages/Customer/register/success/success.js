// pages/Customer/register/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.timer = setTimeout.call(this, () => {
      wx.navigateBack({
        delta: 2
      })
    }, 2000)
  },
  onUnload: function () {
    // console.log("onHide" + this.data.timer);
    if (this.data.timer) {
      clearTimeout(this.data.timer)
    }
  },
  tapsure() {
    wx.navigateBack({
      delta: 2
    })
  }
})