// miniprogram/pages/myCourses/myCourses.js
// import DataBaseManager from /miniprogram/dbModule.js;
var app = getApp()
var dbModule = require('../../my_modules/dataBaseManager.js')
var db = new dbModule.DataBaseManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: [],
  },

  DropCourse(e) {
    console.log(app.globalData.openid);
    db.DropCourse(e);
    wx.showToast({
      title: '退选成功',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var stuName = app.globalData.username;
    console.log(stuName)
    var courseName = await db.GetMyCoursesName(stuName);
    var info = await db.GetCousreInfo(courseName)
    console.log(info)
    // 加载页面之后渲染课程
    Promise.all(info).then(res => {
      this.setData({
        courses: res
      })
    })
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

  }
})