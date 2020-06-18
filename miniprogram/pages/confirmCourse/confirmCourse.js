// pages/confirmCourse/confirmCourse.js
//审核课程页面
var app = getApp()
var db = wx.cloud.database()
var course_list = db.collection("COURSE_LIST");
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
    course:[],
    disable: false
  },

  
  //进入审核课程详细信息页面
  into_confirmPage: function (e) {
    console.log(e.currentTarget.dataset.coursenum,e.currentTarget.dataset.coursename)
    app.globalData.courseNum = e.currentTarget.dataset.coursenum;
    app.globalData.courseName = e.currentTarget.dataset.coursename;
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    course_list.where({
      Condition:"审核中"
    }).get().then(res => {
      console.log(res.data)
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
  //页面数据更新
  changeData:function(){
    this.onLoad();
    },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  refresh: function () {
    wx.showLoading({
      title: '请稍等',
    })
    courseCollection.where({

    }).get().then(res => {
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