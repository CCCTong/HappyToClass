// 课程详细信息界面
// 身份不一样，则页面展示的数据会不一样
var app = getApp();
var db = wx.cloud.database();
var studentCourseList = db.collection("STUDENT_COURSE"); // 获取学生的选课信息
var c_s_List = db.collection("COURSE_STUDENT");
var courseList = db.collection("COURSE_LIST");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: "",
    courseNum: "",
    courseName: "",
    credit: "",
    time: "",
    location: "",
    maxNum: "",
    teacherNum: "",
    teacherName: "",
    studentData: [], // 选择该课程的学生信息
    spareNum: 0, // 该课程剩余名额
    isTeacher: false // 判断身份是否为教师
  },

  /**
   * 删除课程
   */
  async reCourse(e) {
    var page = this
    wx.showModal({
      title: '提示',
      content: '确定要重新申请本课程吗？',
      success(res) {
        if (res.confirm) { // 教师点击确认，则进重新申请课程部分
          courseList.where({
            CourseNum: page.data.courseNum
          }).remove().then(res => {
            wx.redirectTo({
              url: '../createCourse/createCourse',
            })
          })
        }
      }
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
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    var page = this
    var courseNum = app.globalData.courseNum
    // 根据课程号，在数据库中检索该课程相关信息
    var p = await new Promise((resolve, reject) => {
      courseList.where({
        CourseNum: courseNum
      }).get().then(res => {
        var courseData = res.data[0]
        console.log(courseData)
        // 保存检索到的信息，便于显示
        page.setData({
          courseNum: courseData.CourseNum,
          courseName: courseData.CourseName,
          credit: courseData.Credit,
          time: courseData.Time,
          location: courseData.Location,
          maxNum: courseData.MaxNum,
          spareNum: courseData.Num,
          teacherNum: courseData.TeacherNum,
          teacherName: courseData.TeacherName,
          spareNum: courseData.Num,
          Condition:courseData.Condition,
          isTeacher:(app.globalData.identity == 'teacher')
        })
        resolve(courseData)
      })
    })

    // 检索选择该课程的学生相关信息：姓名、学号
    studentCourseList.where({
      CourseName:page.data.courseName
    }).get().then(res => {
      var studentData = res.data
      console.log(studentData)
      page.setData({studentData: studentData})
      console.log(page.data.studentData)
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