// pages/select/select.js
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
    disable: false
  },
  /**
   * 选课操作
   */
  select: function (e) {
    let courseName = e.target.id
    var selectInfo = '';
    // 通过找到学生名字和对应课程
    student_course.where({
      StudentName: app.globalData.username,
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
          data: {
            CourseName: courseName
          }
        }).get().then(res => {
          if (res.data.Num == 0) {
            wx.showModal({
              title: '提示',
              content: '本课程人数已满',
            })
          } else {
            //在学生选课表里添加数据
            student_course.where({
              StudentName: app.globalData.username
            }).count().then(res => {
              if (res.total == 0) {
                student_course.add({
                  data: {
                    StudentNum: app.globalData.uid,
                    CourseName: new Array(courseName)
                  }
                })
              } else {
                // 选课成功在云函数里pull操作
                wx.cloud.callFunction({
                  name: "addCourseNum",
                  data: {
                    studentName: app.globalData.username,
                    courseName: courseName
                  }
                })
              }
            })
            // 修改数据库值
            wx.cloud.callFunction({
              name: "minusCourseNum",
              data: {
                courseName: courseName
              }
            }).then(res => {
              wx.showToast({
                title: '选课成功',
              })
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
    console.log(e.currentTarget.dataset.coursename)
    app.globalData.courseName = e.currentTarget.dataset.coursename
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
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