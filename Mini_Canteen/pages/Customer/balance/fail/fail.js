// pages/Customer/balance/fail/fail.js
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
    this.data.timer = setTimeout(()=>{
      console.log("5000执行")
      wx.navigateBack({
        delta:2
      })
    },5000)
  },
  onUnload: function(){
    console.log("unload"+this.data.timer);
    if(this.data.timer){
      clearTimeout(this.data.timer)
    }
  },
  tapsure(){
    wx.navigateBack({
      delta: 2
    })
  }
})