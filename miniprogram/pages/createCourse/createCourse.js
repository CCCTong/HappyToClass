// miniprogram/pages/createCourse/createCourse.js

const db = wx.cloud.database()
//临时课程表
const course_list = db.collection("COURSE_LIST_temp")
var app = getApp()

Page({


  /**
   * 页面的初始数据
   */
  data: {
    courseName: "",
    courseNum: "",
    teacherName: "",
    teacherNum: "",
    credit: "",
    time: "",
    location: "",
    maxNum: "", //人数上限
    show: false
  },
  async onShow() {
    var page = this
    var user = (wx.getStorageSync('user') || [])
    console.log(user.teacherName, user.teacherNum)
    // 设置一些列值
    this.setData({
      teacherName: user.teacherName
    })
    this.setData({
      teacherNum: user.teacherNum
    })
    var isUsed = true // 判断产生的课程编号是否已使用
    var str
    while(isUsed){
      str = page.randomWord(false, 7) // 生成一个长度为5的随机字符串
      // 检测该字符串是否已被使用
      var p = await new Promise((resolve, reject) => {
        course_list.where({
          CourseNum: str // 根据课程编号检索
        }).count().then(res => {
          isUsed = (res.total != 0)
          resolve(isUsed)
        })
      })
    }
    // 将str设置为课程编号
    page.setData({
      courseNum: str
    })
  },

  /**
   * 生成一个指定长度的随机字符串
   */
  randomWord: function(randomFlag, min, max) {
    var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
    // 向随机数组中添加值
    for (var i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
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
  setpreCourse: function (e) {
    this.setData({
      preCourse: e.detail
    })

  },
  setMaxNum: function (e) {
    this.setData({
      maxNum: e.detail
    })

  },

  /**
   * 检查信息是否完整
   */
  judge: function (courseName, courseNum, credit, maxNum) {
    var flag = false
    if (courseName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入课程名',
      })
      flag = true
    } else if (courseNum == "") {
      wx.showModal({
        title: '提示',
        content: '请输入课程号',
      })
      flag = true
    } else if (credit == "") {
      wx.showModal({
        title: '提示',
        content: '请输入课程学分',
      })
      flag = true
    } else if (maxNum == "") {
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
    var maxNum = this.data.maxNum
    var teacherName = this.data.teacherName
    var teacherNum = this.data.teacherNum
    var page = this

    console.log(page.data)
    // 判断信息是否填写完整
    if (page.judge(courseName, courseNum, credit, maxNum) == false) {
      // 判断课程是否已存在
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
          // 向数据库中填写该课程的数据
          maxNum = parseInt(maxNum);
          console.log(typeof maxNum)
          course_list.add({
            data: {
              CourseNum: courseNum,
              CourseName: courseName,
              Credit: credit,
              Time: "未设置",
              Location: "未设置",
              MaxNum: maxNum, // 选课人数上限
              Num: maxNum, // 选课人数
              TeacherNum: teacherNum,
              TeacherName: teacherName,
            }
          })
          // 刷新界面
          wx.redirectTo({
            url: '../createCourse/createCourse',
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