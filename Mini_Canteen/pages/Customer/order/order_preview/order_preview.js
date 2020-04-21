// pages/order/order.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_list: [],
    pagenum: 0,
    first: false
  },

  onLoad: function() {
    this.data.first = true;
    const page = this;
    if (wx.getStorageSync('token')) {
      wx.showLoading({
        title: '加载中.....',
      })
      wx.request({
        url: app.globalData.host + '/bill',
        method: 'POST',
        header: {
          Authorization: 'Bearer ' + wx.getStorageSync('token')
        },
        data: {
          pagenum: this.data.pagenum
        },
        success: (res) => {
          // this.data.pagenum = res.data.page;
          this.data.order_list = res.data;
          this.data.order_list.map(function(item) {
            item.fund = item.fund.toFixed(2);
            item.buildtime = page.showformatTime(item.buildtime, "Not_zh");
            item.status = page.returnStatusText(item);
            item.order_time = page.showformatTime(item.buildtime, "zh_CN");
            item.effecttime = page.showformatTime(item.effecttime, "Not_zh");
          })
          this.data.pagenum++;
          wx.hideLoading();
          this.setData({
            order_list: this.data.order_list
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      setTimeout(function(){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      },2100)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const page = this;
    if (this.data.first !== true) {
      console.log("oronshow");
      if (wx.getStorageSync('token')) {
        wx.showLoading({
          title: '加载中.....',
        })
        wx.request({
          url: app.globalData.host + '/bill',
          method: 'POST',
          header: {
            Authorization: 'Bearer ' + wx.getStorageSync('token')
          },
          data: {
            pagenum: this.data.pagenum
          },
          success: (res) => {
            // this.data.pagenum = res.data.page;
            this.data.order_list = res.data;
            this.data.order_list.map(function(item) {
              item.fund = item.fund.toFixed(2);
              item.buildtime = page.showformatTime(item.buildtime, "Not_zh");
              item.status = page.returnStatusText(item);
              item.order_time = page.showformatTime(item.buildtime, "zh_CN");
              item.effecttime = page.showformatTime(item.effecttime, "Not_zh");
            })
            wx.hideLoading();
            this.setData({
              order_list: this.data.order_list
            })
          }
        })
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 2100)
      }
    }
    this.data.first = false;
  },

  showformatTime(time, style) {
    const order_time = new Date(time)
    const nowDate = new Date()
    //订单时间
    const year = order_time.getFullYear()
    const month = order_time.getMonth() + 1
    const date = order_time.getDate()
    const day = order_time.getDay()
    let hour = order_time.getHours()
    const minute = order_time.getMinutes()
    const second = order_time.getSeconds()
    let oT_timestamp = order_time.valueOf
    //当前时间
    const now_year = nowDate.getFullYear()
    const now_month = nowDate.getMonth() + 1
    const now_date = nowDate.getDate()
    const now_day = nowDate.getDay()
    const now_hour = nowDate.getHours()
    const now_minute = nowDate.getMinutes()
    //当前所在星期的开始时间
    if (style === "zh_CN") {
      let weekStartDate = new Date(now_year, now_month, now_date - now_day + 1);
      let wSD_timestamp = weekStartDate.valueOf()

      let timequantum = ""
      if (hour < 6) {
        timequantum = "凌晨"
      } else if (hour >= 6 && hour < 12) {
        timequantum = "早上"
      } else if (hour == 12) {
        timequantum = "中午"
      } else if (hour > 12 && hour < 18) {
        timequantum = "下午";
        hour -= 12;
      } else {
        timequantum = "晚上"
        hour -= 12;
      }

      let week_name = ""
      switch (day) {
        case 0:
          week_name = "周日"
          break;
        case 1:
          week_name = "周一"
          break;
        case 2:
          week_name = "周二"
          break;
        case 3:
          week_name = "周三"
          break;
        case 4:
          week_name = "周四"
          break;
        case 5:
          week_name = "周五"
          break;
        case 6:
          week_name = "周六"
          break;
      }

      if (now_year === year) {
        if (oT_timestamp >= wSD_timestamp && date !== now_date) {
          return week_name + " " + timequantum + " " + hour + ":" + minute
        } else if (oT_timestamp >= wSD_timestamp && date === now_date) {
          return timequantum + " " + hour + ":" + (minute < 10 ? ("0" + minute) : minute)
        } else {
          return month + "月" + date + "日" + " " + timequantum + " " + hour + ":" + (minute < 10 ? ("0" + minute) : minute)
        }
      } else {
        return year + "年" + month + "月" + date + "日" + " " + timequantum + " " + hour + ":" + (minute < 10 ? ("0" + minute) : minute)
      }
    } else if (style === "Not_zh") {
      return year + "-" + (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date) + " " + hour + ":" + (minute < 10 ? ("0" + minute) : minute) + ":" + (second < 10 ? "0" + second : second)
    } else {
      console.log("请输入正确的参数,可选择的参数有：'zh_CN' 'Not_zh'")
    }
  },

  returnStatusText(order_item) {
    // const a = this.data;
    const usetime = new Date(order_item.effecttime).valueOf();
    const nowtime = Date.now();
    const rest = usetime - nowtime;
    if (rest < 0) {
      return "已失效"
    } else if (0 <= rest && rest <= 33 * 60 * 60 * 1000) {
      return "等待使用(不可更改)"
    } else if (rest > 33 * 60 * 60 * 1000) {
      return "订单已确认(可更改)"
    }
  },

  onReachBottom() {
    const page = this;
    console.log("lower");
    if (wx.getStorageSync('token')) {
      wx.showLoading({
        title: '加载中.....',
      })
      wx.request({
        url: app.globalData.host + '/bill',
        method: 'POST',
        header: {
          Authorization: 'Bearer ' + wx.getStorageSync('token')
        },
        data: {
          pagenum: this.data.pagenum
        },
        success: (res) => {
          this.data.order_list = res.data;
          this.data.order_list.map(function(item) {
            item.fund = item.fund.toFixed(2);
            item.buildtime = page.showformatTime(item.buildtime, "Not_zh");
            item.status = page.returnStatusText(item);
            item.order_time = page.showformatTime(item.buildtime, "zh_CN");
            item.effecttime = page.showformatTime(item.effecttime, "Not_zh");
          })
          this.data.pagenum++;
          wx.hideLoading();
          this.setData({
            order_list: this.data.order_list
          })
        }
      })
    } else {
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
})