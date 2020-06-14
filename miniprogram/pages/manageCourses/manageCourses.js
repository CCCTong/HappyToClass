// pages/manageCourses/manageCourses.js
//管理员查看过审课程信息
var app = getApp()
var db = wx.cloud.database()
var courselist = db.collection("COURSE_LIST");
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: [],
    identity:"",
    disable: false
  },
  //搜索显示需要查询的账号
  onSearch(e) {
    console.log(e.detail)
    var identity = this.data.identity
    if (identity == 'CourseNum'){
    courselist.where({
      CourseNum:e.detail
    }).get().then(res=>{
      this.setData({
        course:res.data
      })
    })
  }else{
    courselist.where({
      CourseName:e.detail
    }).get().then(res=>{
      this.setData({
        course:res.data
      })
    })
  }
      
  },
  //取消显示所有用户账号
  onCancel() {
    courselist.get().then(res => {
      this.setData({
        course: res.data
      })
    })
  },
  //确定检索信息
  onChange: function (e) {
    console.log(e.detail)
    this.setData({
      identity: e.detail
    })
   
  },
  into_coursePage: function (e) {
    console.log(e.currentTarget.dataset.coursenum)
    app.globalData.courseNum = e.currentTarget.dataset.coursenum;
    wx.navigateTo({
      url: '../courseDetail/coursesDetail',
    })
  },

  changeData:function(){
    this.onLoad();
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    courselist.get().then(res => {
      this.setData({
        course: res.data
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
        course: res.data
      })
      console.log(this.data.course)
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