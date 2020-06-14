// miniprogram/pages/manageCourse/manageCourse.js
var app = getApp();
var db = wx.cloud.database();
var course_list = db.collection("COURSE_LIST"); // 集合名修改之后此处需修改
var s_c_List = db.collection("user"); // 在s_c数据库创建好之后将集合名称替换,相关字段可以修改

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: {},
    myID: ""
  },

  /**
   * 跳转到课程详细界面
   */
  toCourseDetail: function(e) {
    console.log(e.currentTarget.dataset.coursenum)
    app.globalData.courseNum = e.currentTarget.dataset.coursenum;
    wx.navigateTo({
      url: '../courseDetail/detail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取该老师创建的课程列表
    var page = this;
    var myID = app.globalData.uid;
    var coursesName;
    page.setData({
      myID: myID
    })
    // 获取该教师创建的所有课程
    var p = await new Promise((resolve, reject) => {
      course_list.where({
        TeacherNum: myID // 根据教师编号检索
      }).get().then(res => {
        page.setData({courseList: res.data})
        console.log(res.data)
        resolve(coursesName)
      })
    })
  },
  /**
   * 需要重新刷新课程的数据
   */
  changeData:function(){
    this.onLoad();
    },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async refresh() {

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
})