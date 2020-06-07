// miniprogram/pages/manageCourse/manageCourse.js
const app = getApp();
var db = wx.cloud.database();
var courseCollection = db.collection("course");
var s_c_List = db.collection("user"); // 在s_c数据库创建好之后将集合名称替换,相关字段可以修改

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList:{},
    myID: ""
  },

  /**
   * 加载该老师创建的课程 
   */
  async getCourse(myID) {
    var page = this;
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取该老师创建的课程列表
    var page = this;
    var myID = app.globalData.username;
    var coursesName;
    page.setData({myID:myID})
    var p = await new Promise((resolve,reject)=>{
      courseCollection.where({
        teacherid: myID
      }).get().then(res => {
        coursesName = res.data
        resolve(coursesName)
      }) 
    })
    console.log(coursesName)

    // 根据列表在选课数据库中统计有多少学生选取该课程
    var mycars=new Array(coursesName.length)
    console.log(mycars)
    for(var i=0; i<coursesName.length; i++){
      var p = await new Promise((resolve,reject)=>{
        s_c_List.where({
          uid: coursesName[i].Num
        }).count().then(res => {
          mycars = {num:coursesName[i].Num,
                      courseName:coursesName[i].coursename,
                      cnt:res.total}
          resolve(res.total)
        })
      })
    }
    console.log(mycars)
    page.setData({courseList:mycars})
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