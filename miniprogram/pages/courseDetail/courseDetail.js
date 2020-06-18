// 未过审课程详细信息界面

var app = getApp();
var db = wx.cloud.database();

var courseList = db.collection("COURSE_LIST");//未审核课程表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: "",
    courseNum: "",
    courseName: "",
    categor: "",
    credit: "",
    preCourse: "",
    preNum: "",
    time: "",
    location: "",
    num: "",
    teacherNum: "",
    teacherName: "",
  },
  //录入上课时间
  setTime: function (e) {
    this.setData({
      Time: e.detail
    })

  },
  //录入上课地点
  setLocation: function (e) {
    this.setData({
      Location: e.detail
    })

  },
  /**
   * 删除课程
   */
  async removeCourse(e) {
    var page = this
    wx.showModal({
      title: '提示',
      content: '确定审核不通过吗？',
      success(res) {
        if (res.confirm) { // 管理员点击确认，则进入审核不通过操作
          courseList.where({
            CourseNum: page.data.courseNum
          }).update({
            data:{
              Condition:"未通过审核"
            }
          }).then(res => {
         
           
              // 操作成功，返回课程管理界面
              page.changeParentData() // 刷新管理课程界面的数据
              wx.navigateBack({
                delta: 1, // 返回上一级页面。
              })
              /*wx.showModal({
                title: '提示',
                content: '已课程'
              })*/
            
          })
        }
      }
    })
  },

  async confirmCourse(e){
    var page = this
    var courseNum = app.globalData.courseNum
    var courseName = app.globalData.courseName
    var time = this.data.Time
    var location = this.data.Location
    wx.showModal({
      title: '提示',
      content: '要确认本课程吗？',
      success(res) {
      if (res.confirm){
        //确认课程
        
        courseList.where({
        CourseNum:courseNum,
        CourseName:courseName,
      }).update({
        data:{
        Condition:"通过审核",
        Time:time,
        Location:location
        }
      }).then(res => {
          page.changeParentData() // 刷新管理课程界面的数据
          wx.navigateBack({
          delta: 1, // 返回上一级页面。
           })
          })
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    var page = this
    var courseNum = app.globalData.courseNum
    var courseName = app.globalData.courseName
    // 根据课程号，在数据库中检索该课程相关信息
    var p = await new Promise((resolve, reject) => {
      courseList.where({
        CourseNum: courseNum,
        CourseName:courseName
      }).get().then(res => {
        var courseData = res.data[0]
        console.log(courseData)
        // 保存检索到的信息，便于显示
        page.setData({
          courseNum: courseData.CourseNum,
          courseName: courseData.CourseName,
          Credit: courseData.Credit,
          Num: courseData.Num,
          teacherName: courseData.TeacherName,
        })
        resolve(courseData)
      })
    })


  },
  changeParentData: function () {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法
    }
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