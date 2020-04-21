// pages/Customer/cart/cart.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: app.globalData.host + '/mmenus/loadpic?',
    cart_list: [],
    total_money: 0,
    total_num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('show')
    const a = this.data;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      // console.log(this)
      a.cart_list = data.cart_list;
      a.total_money = data.total_money;
      a.total_num = data.total_num;
      this.setData({
        total_money: a.total_money,
        total_num: a.total_num,
        cart_list: a.cart_list
      })
    })
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
  //Longtap删除列表中商品
  onLongpressDelete(e) {
    const eventChannel = this.getOpenerEventChannel();
    const a = this.data;
    console.log(e);
    const P_this = this;
    wx.showModal({
      title: '提示',
      content: '删除所选商品',
      cancelColor: '',
      confirmColor: '',
      success(res) {
        console.log(res);
        if (res.confirm) {
          const cart_index = e.currentTarget.dataset.cart_index;
          a.total_num -= a.cart_list[cart_index].num;
          a.total_money -= a.cart_list[cart_index].price * a.cart_list[cart_index].num;
          a.cart_list.splice(cart_index, 1);
          P_this.setData({
            cart_list: a.cart_list,
            total_money: a.total_money,
            total_num: a.total_num
          });
          eventChannel.emit('acceptDataFromOpenedPage', {
            cart_list: a.cart_list,
            total_money: a.total_money,
            total_num: a.total_num
          });
        } else if (res.cancel) {
          //do nothing
        }
      },
      fail(res) {

      }
    })
  },
  //增加商品份数
  onTapAdd(e) {
    console.log(e);
    const a = this.data;
    const index = e.currentTarget.dataset.index;
    a.cart_list[index].num++;
    a.total_money += a.cart_list[index].price;
    a.total_num++;
    this.setData({
      [`cart_list[${index}].num`]: a.cart_list[index].num,
      total_money: a.total_money,
      total_num: a.total_num
    })
    console.log(a.cart_list)
  },
  //减少商品份数
  onTapSub(e) {
    console.log(e);
    const a = this.data;
    const index = e.currentTarget.dataset.index;
    if (a.cart_list[index].num > 1) {
      a.cart_list[index].num--;
      a.total_money -= a.cart_list[index].price;
      a.total_num--;
      this.setData({
        [`cart_list[${index}].num`]: a.cart_list[index].num,
        total_money: a.total_money,
        total_num: a.total_num
      })
    }
    console.log(a.cart_list)
  },
  //结算
  goBalance() {
    const eventChannel = this.getOpenerEventChannel();
    let a = this.data;
    if (a.total_num !== 0) {
      //购物车为空时，点击无反应
      if (wx.getStorageSync('token')) {
        wx: wx.showModal({
          title: '提示',
          content: '确认支付',
          showCancel: true,
          cancelColor: 'red',
          confirmColor: 'green',
          success: function(res) {
            console.log(res);
            //减少用户余额，同时保存到数据库，服务器返回一个状态码
            //创建订单，保存订单信息到数据库

            if (res.confirm === true) {
              wx.request({
                url: app.globalData.host + '/pay',
                method: 'POST',
                header: {
                  Authorization: 'Bearer ' + wx.getStorageSync('token')
                },
                data: {
                  cart_list: a.cart_list,
                  total_money: a.total_money,
                  total_num: a.total_num
                },
                success: (res) => {
                  console.log(res.data);
                  if (res.data.success) {
                    wx.navigateTo({
                      url: '/pages/Customer/balance/success/success',
                      success: (res) => {
                        a.cart_list = [];
                        a.total_money = 0;
                        a.total_num = 0;
                        eventChannel.emit('paidOK', {
                          cart_list: a.cart_list,
                          total_money: a.total_money,
                          total_num: a.total_num
                        })
                      }
                    })
                  } else {
                    wx.navigateTo({
                      url: '/pages/Customer/balance/fail/fail',
                    })
                  }

                },
                fail: (res) => {
                  console.log("请求失败")
                }
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      else {
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

    }
  }
})