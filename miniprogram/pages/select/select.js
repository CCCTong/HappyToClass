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

  select: function (e) {
    let courseName = e.target.id
    var selectInfo = '';
    student_course.where({
      StudentName: app.globalData.username,
      CourseName: courseName
    }).count().then(res => {
      if (res.total != 0) {
        wx.showModal({
          title: '提示',
          content: '不能重复选课',
        })
      } else {
        course_list.where({
          data: {
            CourseName: courseName
          }
        }).get().then(res => {
          if (res.data.num == 0) {
            wx.showModal({
              title: '提示',
              content: '本课程人数已满',
            })
          } else {
            //为“我的课程”添加课程数据
            student_course.where({
              StudentName: app.globalData.username
            }).count().then(res => {
              if (res.total == 0) {
                student_course.add({
                  data: {
                    StudentName: app.globalData.username,
                    CourseName: new Array(courseName)
                  }
                })
              } else {
                wx.cloud.callFunction({
                  name: "addCourseNum",
                  data: {
                    studentName: app.globalData.username,
                    courseName: courseName
                  }
                })
              }
            })
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
   * 选课
   */
  // select:function(e){
  //   console.log(e);
  //   wx.cloud.callFunction({
  //     name:"selectCourse",
  //     data: {
  //       globalData : app.globalData,
  //       e : e
  //     }
  //   }).then(res=>{
  //     console.log(res);
  //     if (res.result == "重复选课"){
  // wx.showModal({
  //   title: '提示',
  //   content: '不能重复选课',
  // })
  //     }else if (res.result == "人数已满"){
  // wx.showModal({
  //   title: '提示',
  //   content: '本课程人数已满',
  // })
  //     }else if (res.result == "选课成功"){
  // wx.showToast({
  //   title: '选课成功',
  // })
  //       this.data.disable = true
  //     }
  //   })
  // },
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
    courseCollection.get().then(res => {
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