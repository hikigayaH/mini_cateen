// pages/Customer/profile/balance/balance.js
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
    console.log(options.query);
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('sendfund',(user)=>{
      this.setData({
        fund: (user.fund).toFixed(2)
      })
    })
  },
  naviback(){
    wx.navigateBack({
      delta:1
    })
  }
})