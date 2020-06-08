// miniprogram/pages/createCourse/createCourse.js

const db = wx.cloud.database()
const courseCollection = db.collection("COURSE_LIST")
var user = (wx.getStorageSync('user')||[])

Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    courseName:"",
    courseNum:"",
    userName:user.username,
    teacherNum:user.uid, // 用户账号
    category:"",
    credit:"",
    preCourse:"",
    preNum:"",
    time:"",
    location:"",
    Num:"",
    categoryList: ['选修课', '必修课'],
    show: false
  },
  
 
  /*** 
   * 设置课程名，课程号，种类，学分，，先修课程，人数
   */
  setCourseName: function (e) {
    this.setData({ courseName: e.detail })
   
  },
  setCourseNum: function (e) {
    this.setData({ courseNum: e.detail })
    
  },
  setCredit: function (e) {
    this.setData({ credit: e.detail })
    
  },
  setCategory: function (e) {
    this.setData({category: e.detail})

  },
  setPreCourse: function (e) {
    this.setData({preCourse: e.detail})
    
  },
  setPrecourse: function (e) {
    this.setData({preNum: e.detail})
    
  },
  setPrecourse: function (e) {
    this.setData({time: e.detail})
    
  },
  setPrecourse: function (e) {
    this.setData({location: e.detail})
    
  },
  setNum: function (e) { // 设置选课学生上限
    this.setData({Num: e.detail})
    
  },

  /**
     * 检查信息是否完整
     */
    judge: function ( courseName, courseNum,credit,category,preCourse,preNum,Num) {
      var flag = false
      if (courseName == "") {
        wx.showModal({
          title: '提示',
          content: '请输入课程名',
        })
        flag = true
      }
      else if (credit == "") {
        wx.showModal({
          title: '提示',
          content: '请输入课程学分',
        })
        flag = true
      }
      else if (category == "") {
        wx.showModal({
          title: '提示',
          content: '请输入课程类型',
        })
        flag = true
      }
      else if (Num == "") {
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
      var Num = this.data.Num
      var page = this

      if (page.judge(courseName, courseNum,credit,category,preCourse,Num) == false) {
        courseCollection.where({
          CourseNum: courseNum,
          CourseName:courseName
        }).count().then(res => {
          console.log(res.total)
          if (res.total != 0) {
            wx.showModal({
              title: '提示',
              content: '课程已存在',
            })
          }
          else {
            courseCollection.add({
              data: {
                CourseNum: courseNum,
                CourseName: courseName, // 课程名称
                TeacherName: user.username, // 教师姓名
                TeacherNum: user.uid, // 教师工号
                Category:category, // 课程类别
                Credit:credit, // 学分
                PreCourse:preCourse, // 先修课
                PreNum:preNum, // 先修课程号
                Time:time, // 上课时间
                Location:location, // 上课地点
                Num:Num // 选课人数上限
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