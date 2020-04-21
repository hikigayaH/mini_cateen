// pages/Customer/profile/personal/personal.js
const app = getApp();
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
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('senduserinfo', (user) => {
      this.data.userdata = user;
      // let ugender_str = '';
      // if(user.ugender===0){
      //   ugender_str = '女';
      // }
      // else if (user.ugender === 1) {
      //   ugender_str = '男';
      // }
      let female = 0;
      let man = 0;
      if(user.ugender===0){
        female = 1;
      }
      else if (user.ugender === 1) {
        man = 1;
      }
      this.setData({
        userid: user.userid,
        // usergender: ugender_str,
        username: user.uname,
        man,
        female
      })
    })
  },

  onUnload: function(){
    clearTimeout(this.data.timer);
  },

  changeinfo(e) {
    let data = e.detail.value;
    data.ugender = this.data.ugender;
    console.log(data);
    // if(data.ugender !== '男' && data.ugender !== '女' ){
    //   wx.showToast({
    //     title: '性别输入错误',
    //     icon: 'none',
    //     duration: 1500
    //   })
    // }else{
      let token = wx.getStorageSync('token');
      if(token){
        wx.request({
          url: app.globalData.host + '/profile/personal',
          method: 'POST',
          header: {
            Authorization: 'Bearer ' + token
          },
          data: data,
          success: (res)=>{
            console.log(res);
            if(res.statusCode === 200){
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1500
              });
              this.data.timer = setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2300)
            }else{
              console.log('error');
            }
          }
        })
      }else{
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000,
          success: () => {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        })
      }
    // }
  },

  radioChange(e){
    this.data.ugender = e.detail.value;
  },

  handleOfocus() {
    this.setData({
      Oactive: 1
    })
  },
  handleOblur() {
    this.setData({
      Oactive: 0
    })
  },
  // handleNfocus() {
  //   this.setData({
  //     Nactive: 1
  //   })
  // },
  // handleNblur() {
  //   this.setData({
  //     Nactive: 0
  //   })
  // },
  handleSfocus() {
    this.setData({
      Sactive: 1
    })
  },
  handleSblur() {
    this.setData({
      Sactive: 0
    })
  }
})