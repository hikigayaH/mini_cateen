// pages/login/login.js
const app = getApp();

Page({
  login(e) {
    let data = e.detail.value;
    wx.request({
      url: app.globalData.host + '/login',
      data: data,
      method: 'POST',
      success: (res) => {
        if(res.data.manager === 1){
          if(res.data.mpass === true){
            wx.redirectTo({
              url: '/pages/Manager/M_home/M_home',
            });
            wx.setStorage({
              key: 'token',
              data: res.data.token
            });
          } else {
            wx.showToast({
              title: '密码错误，重新输入',
              icon: 'none',
              duration: 2000
            })
          }
        } else if (res.data.manager === 0){
          if (res.data.unregister) {
            wx.showToast({
              title: '输入的用户未注册',
              icon: 'none',
              duration: 2000
            })
          } else{
            if (res.data.pass) {
              wx.setStorage({
                key: 'token',
                data: res.data.token
              })
              wx.switchTab({
                url: '../../pages/Customer/home/home'
              })
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        wx.setStorage({
                          key: 'userInfo',
                          data: res.userInfo
                        })
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                      }
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '密码错误，重新输入',
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
      }
    })

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
  }
})