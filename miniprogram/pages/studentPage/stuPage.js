Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "",
    today: {},
    motto: 'Hello World'
  },

   myPage: function () {
    wx.navigateTo({
      url: '../myMainPage/MainPage',
    })
  },
    /**
   * 选课操作
   */
  select: function(){
    wx.navigateTo({
      url: '../selectCourse/select',
    })
  },
  /**
   * 查看我的课程
   */
  myCourse: function () {
    wx.navigateTo({
      url: '../myCourses/myCourses',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadInfo();
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
    /**
   * 加载天气信息
   */
  loadInfo: function () {
    var page = this;
    // 调用函数，获得用户地理位置
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // 确定用户的经纬度
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude, longitude);
        // 根据经纬度确定用户所处城市
        page.loadCity(latitude, longitude);
      }
    })
  },
  /**
   * 加载用户所在的城市
   */
  loadCity: function (latitude, longitude) {
    var page = this;
    //调用微信内置函数，确定具体位置
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=D6WOzHaymzVVKvgiy8UbhQEznkgeK6BD&location=' +
        latitude + ',' + longitude + '&output=json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // 确定市区
        console.log(res.data)
        var city = res.data.result.addressComponent.city;
        city = city.replace("市", "");
        page.setData({
          city: city
        });
        page.loadWeather(city);
      }
    })
  },
  /**
   * 加载用户所处地区的天气
   */
  loadWeather: function (city) {
    var page = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + city,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        var future = res.data.data.forecast;
        var todayInfo = future.shift();
        var today = res.data.data;
        today.todayInfo = todayInfo;
        page.setData({
          today: today
        });
        console.log(today.wendu);
      }
    });
  }
})