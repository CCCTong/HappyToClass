// pages/select/select.js
var app = getApp()
var db = wx.cloud.database()
var course_list = db.collection("COURSE_LIST");
var student_course = db.collection("STUDENT_COURSE");
var course_student = db.collection("COURSE_STUDENT");
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
  /**
   * 选课操作
   */
  select: function (e) {
    let courseName = e.target.id
    let courseNum = e.currentTarget.dataset.coursenum
    // 通过找到学生名字和对应课程
    student_course.where({
      StudentNum: app.globalData.uid,
      CourseName: courseName
    }).count().then(res => {
      // 找到了相同名称的课程
      if (res.total != 0) {
        wx.showModal({
          title: '提示',
          content: '不能重复选课',
        })
      } else {
        // 检查是否还有余下的选人空间
        course_list.where({
          CourseName: courseName
        }).get().then(res => {
          console.log(res.data);
          if (res.data[0].Num === 0) {
            wx.showModal({
              title: '提示',
              content: '本课程人数已满',
            })
          } else {
            //在学生选课表里添加数据
            student_course.where({
              StudentNum: app.globalData.uid
            }).count().then(res => {
              if (res.total == 0) {
                student_course.add({
                  data: {
                    StudentName : app.globalData.username,
                    StudentNum: app.globalData.uid,
                    CourseName: new Array(courseName),
                    CourseNum: new Array(courseNum),
                  }
                })
              } else {
                // 选课成功在云函数里pull操作
                wx.cloud.callFunction({
                  name: "addCourseNum",
                  data: {
                    studentNum: app.globalData.uid,
                    courseName: courseName,
                    courseNum: courseNum
                  }
                })
              }
            })
            // 修改课程对应的表
            course_student.where({
              CourseName: courseName
            }).count().then(res => {
              if (res.total == 0) {
                course_student.add({
                  data: {
                    StudentName: new Array(app.globalData.username),
                    StudentNum: new Array(app.globalData.uid),
                    CourseName: courseName,
                    CourseNum: courseNum
                  }
                })
              } else {
                // 选课成功在云函数里pull操作
                wx.cloud.callFunction({
                  name: "addStudentNum",
                  data: {
                    studentName: app.globalData.username,
                    studentNum : app.globalData.uid,
                    courseName: courseName,
                    courseNum: courseNum
                  }
                })
              }
            })
            // 修改数据库值
            wx.cloud.callFunction({
              name: "minusCourseNum",
              data: {
                courseName: courseName,
                courseNum: courseNum
              }
            }).then(res => {
              wx.showToast({
                title: '选课成功',
              })
              this.onLoad() // 选课成功之后刷新数据
            })
            this.data.disable = true
          }
        })
      }
    })
  },

  /**
   * 跳转到课程详细页面
   */
  into_coursePage: function (e) {
    console.log(e.currentTarget.dataset.coursenum)
    app.globalData.courseNum = e.currentTarget.dataset.coursenum;
    wx.navigateTo({
      url: '../courseDetail/detail',
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
    course_list.get().then(res => {
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