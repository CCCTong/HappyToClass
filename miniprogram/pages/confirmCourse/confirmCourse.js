// pages/confirmCourse/confirmCourse.js
var app = getApp()
var db = wx.cloud.database()
var course_list = db.collection("COURSE_LIST_temp");
var student_course = db.collection("STUDENT_COURSE");
var student_list = db.collection("STUDENT_LIST");
var teacher_list = db.collection("TEACHER_LIST");
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: [],
    disable: false
  },

  
  
  into_confirmPage: function (e) {
    
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    course_list.get().then(res => {
      this.setData({
        courses: res.data
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  refresh: function () {
    wx.showLoading({
      title: '请稍等',
    })
    courseCollection.get().then(res => {
      this.setData({
        courses: res.data
      })
      console.log(this.data.courses)
    })
    wx.hideLoading()
  },
  refreshAbort: function () {
    wx.showToast({
      title: '刷新成功',
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})