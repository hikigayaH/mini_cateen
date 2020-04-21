// pages/register/register.js
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  register(e) {
    let data = e.detail.value;
    console.log(data)
    if (data.userid === '' || data.psw_f === '' || data.psw_s === '') {
      wx.showToast({
        title: '输入信息不能为空，请重新输入',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    } else if (data.psw_f !== data.psw_s) {
      wx.showToast({
        title: '输入密码不一致，请重新输入',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }else{
      wx.request({
        url: app.globalData.host+'/register',
        data: data,
        method: "POST",
        success: (res)=>{
          console.log(res);
          if (res.data.isregistered === true){
            wx.showToast({
              title: '此用户已经被注册',
              icon: 'none',
              duration: 2000
            })
          }else{
            if(res.data.success){
              wx.navigateTo({
                url: './success/success',
              })
            }else{
              console.log('注册出错')
            }
          }
        }
      })
    }
  },
  handlePfocus() {
    this.setData({
      PclassName: 'focus'
    })
  },
  handleUfocus() {
    this.setData({
      UclassName: 'focus'
    })
  },
  handlePAfocus() {
    this.setData({
      PAclassName: 'focus'
    })
  },
  handlePblur(event) {
    if (event.detail.value === '') {
      this.setData({
        PclassName: ''
      })
    }
  },
  handleUblur(event) {
    if (event.detail.value === '') {
      this.setData({
        UclassName: ''
      })
    }
  },
  handlePAblur(event) {
    if (event.detail.value === '') {
      this.setData({
        PAclassName: ''
      })
    }
  }
})