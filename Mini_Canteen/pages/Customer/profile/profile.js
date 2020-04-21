// pages/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let nickname = '';
    let sculpture = '';
    if (userInfo) {
      nickname = userInfo.nickName;
      sculpture = userInfo.avatarUrl;
    }
    else {
      nickname = '待登录';
      sculpture = '/asset/icon/profile.png';
    }
    if (wx.getStorageSync("token")) {
      wx.request({
        url: app.globalData.host + '/profile',
        method: 'POST',
        header: {
          Authorization: 'Bearer ' + wx.getStorageSync('token')
        },
        success: (res) => {
          this.data.userdata = res.data;
        }
      })
      this.setData({
        isloaded: true
      })
    }
    else {
      this.setData({
        isloaded: false
      })
    }
    this.setData({
      imageurl: sculpture,
      nickName: nickname,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapBalance(){
    console.log(this.data.userdata)
    if (wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/Customer/profile/balance/balance',
        success: (res)=>{
          console.log(this.data.userdata);
          res.eventChannel.emit('sendfund',{fund: this.data.userdata.ubalance})
        } 
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  taplogin(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  tapexitlogin(){
    wx.clearStorageSync('token');
    wx.clearStorageSync('userInfo');
    this.setData({
      imageurl: '/asset/icon/profile.png',
      nickName: '待登录',
      isloaded: false
    })
  },
  tapAccount(){
    console.log(this.data.userdata)
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/Customer/profile/acount/acount',
        success: (res) => {
          console.log(this.data.userdata);
          res.eventChannel.emit('senduserid', { userid: this.data.userdata.userid })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  tapPersonal() {
    console.log(this.data.userdata)
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/Customer/profile/personal/personal',
        success: (res) => {
          res.eventChannel.emit('senduserinfo', this.data.userdata)
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
})