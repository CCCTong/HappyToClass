// 课程详细信息界面
// 身份不一样，则页面展示的数据会不一样
var app = getApp();
var db = wx.cloud.database();
var studentCourseList = db.collection("STUDENT_COURSE"); // 获取学生的选课信息
var courseList = db.collection("COURSE_LIST");
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
    studentData: [], // 选择该课程的学生信息
    spareNum: 0 // 该课程剩余名额
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
        if (res.confirm) { // 教师点击确认，则进删除课程数据部分
          courseList.where({
            CourseNum: page.data.courseNum
          }).remove().then(res => {
            // 继续删除学生选课列表中选择该课程的数据
            studentCourseList.where({
              CourseName: page.data.courseName
            }).remove()

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
        var spareNum = courseData.Num - courseData.StudentNum
        page.setData({
          courseNum: courseData.CourseNum,
          courseName: courseData.CourseName,
          // categor: courseData.Category, // 创建课程时未实现该部分
          credit: courseData.Credit,
          preCourse: courseData.PreCourse,
          // preNum: courseData.PreNum,
          time: courseData.Time,
          // location: courseData.Location,
          num: courseData.Num,
          teacherNum: courseData.TeacherNum,
          teacherName: courseData.TeacherName,
          spareNum: spareNum
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