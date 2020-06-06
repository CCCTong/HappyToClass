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
    courses: [{
      courseName: '软件工程',
      teacherName: 'admin',
      time: '2017.10.10',
      scores: '10',
      num: '10'
    }],
  },



  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var stuName = app.globalData.username;
    var courseName = await db.getMyCoursesName(stuName);
    var info = await db.getCousreInfo(courseName)
    Promise.all(info).then(res=>{
      this.setData({
        courses:res
      })
    })
  },
  dropCourse(e){
    var courseName = e.target.id;
    var courseInfo = db.getCousreInfo(courseName)
    console.log(courseInfo)
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