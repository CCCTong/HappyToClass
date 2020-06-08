// miniprogram/pages/createCourse/createCourse.js

const db = wx.cloud.database()
const course_list = db.collection("COURSE_LIST")
var user = (wx.getStorageSync('user') || [])

Page({


  /**
   * 页面的初始数据
   */
  data: {
    courseName: "",
    courseNum: "",
    teacherName: user.username,
    teacherNum: user.uid,
    category: "",
    credit: "",
    preCourse: "",
    preNum: "",
    time: "",
    location: "",
    num: 0,
    categoryList: ['选修课', '必修课'],
    show: false
  },


  /*** 
   * 设置课程名，课程号，种类，学分，，先修课程，人数
   */
  setcourseName: function (e) {
    this.setData({
      courseName: e.detail
    })

  },
  setcourseNum: function (e) {
    this.setData({
      courseNum: e.detail
    })

  },
  setCredit: function (e) {
    this.setData({
      credit: e.detail
    })

  },
  setCategory: function (e) {
    this.setData({
      category: e.detail
    })

  },
  setpreCourse: function (e) {
    this.setData({
      preCourse: e.detail
    })

  },
  setnum: function (e) {
    this.setData({
      num: e.detail
    })

  },

  /**
   * 检查信息是否完整
   */
  judge: function (courseName, courseNum, credit, category, preCourse, preNum, num) {
    var flag = false
    if (courseName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入课程名',
      })
      flag = true
    } else if (credit == "") {
      wx.showModal({
        title: '提示',
        content: '请输入课程学分',
      })
      flag = true
    } else if (category == "") {
      wx.showModal({
        title: '提示',
        content: '请输入课程类型',
      })
      flag = true
    } else if (num == "") {
      wx.showModal({
        title: '提示',
        content: '请输入人数上限',
      })
      flag = true
    }
    return flag
  },

  /**
   * 创建课表
   */
  handleReg: function () {
    var courseName = this.data.courseName
    var courseNum = this.data.courseNum
    var credit = this.data.credit
    var category = this.data.category
    var preCourse = this.data.preCourse
    var preNum = this.data.preNum
    var time = this.data.time
    var location = this.location
    var num = this.data.num
    var page = this


    if (page.judge(courseName, courseNum, credit, category, preCourse, num) == false) {
      course_list.where({
        courseNum: courseNum,
        courseName: courseName
      }).count().then(res => {
        console.log(res.total)
        if (res.total != 0) {
          wx.showModal({
            title: '提示',
            content: '课程已存在',
          })
        } else {
          num = parseInt(num);
          console.log(typeof num)
          course_list.add({
            data: {
              CourseNum: courseNum,
              CourseName: courseName,
              Categor: category,
              Credit: credit,
              PreCourse: preCourse,
              PreNum: preNum,
              Time: time,
              Location: location,
              Num: num
            }
          })
          wx.showModal({
            title: '恭喜',
            content: '创建成功'
          })
        }
      })
    }
  },
})