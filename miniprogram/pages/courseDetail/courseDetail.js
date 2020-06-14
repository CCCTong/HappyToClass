// 未过审课程详细信息界面

var app = getApp();
var db = wx.cloud.database();
var CourseList = db.collection("COURSE_LIST"); //已审核课程表
var courseList = db.collection("COURSE_LIST_temp");//未审核课程表
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
      content: '确定要删除本课程吗？',
      success(res) {
        if (res.confirm) { // 管理员点击确认，则进删除课程数据部分
          courseList.where({
            CourseNum: page.data.courseNum
          }).remove().then(res => {

            var flag = res.stats.removed // 是否成功删除
            if (flag) {
              // 删除成功，返回课程管理界面
              page.changeParentData() // 刷新管理课程界面的数据
              wx.navigateBack({
                delta: 1, // 返回上一级页面。
              })
              wx.showModal({
                title: '提示',
                content: '已删除课程'
              })
            }
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
    console.log(1)
    wx.showModal({
      title: '提示',
      content: '确定要确认本课程吗？',
      success(res) {
      if (res.confirm){
        //确认课程
        courseList.where({
        CourseNum: courseNum,
        CourseName:courseName
      }).get().then(res => {
        var courseData = res.data[0]
       
        CourseList.add({
          data: {
            CourseNum: courseNum,
            CourseName: courseName,
            Credit: courseData.Credit,
            Time: time,
            Location:location,
            MaxNum: courseData.Num,// 选择该课程的学生人数
            TeacherNum:courseData.TeacherNum,
            TeacherName:courseData.TeacherName,
              }
            })
              //删除COURST_LIST_temp中数据
              courseList.where({
                CourseNum: page.data.courseNum
              }).remove()
                  // 删除成功，返回课程管理界面
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