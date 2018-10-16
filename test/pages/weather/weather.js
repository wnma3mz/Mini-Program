// pages/weather/weather.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weathers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // options
  onLoad: function (options) {
    this.startNotice();
  },

  startNotice: function () {
    var that = this;
    wx.request({
      url: 'http://aider.meizu.com/app/weather/listWeather?cityIds=101240101', //weather
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT   
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.value[0].weathers)
        that.setData({
          weathers: res.data.value[0]
        })
      },
      fail: function () {
        console.log("fail")
        // fail  
      },
      complete: function () {
        console.log('complete')
        // complete  
      },
    })
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

  }
})