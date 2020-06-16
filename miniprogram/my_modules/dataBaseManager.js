var app = getApp()
export const db = wx.cloud.database();
/*
  数据库表单命名
  STUDENT_LIST {
    StudentNum	学号	CHAR(10)	PK
    DeptNum	专业号码	CHAR(10)	NOT NULL
    StudentName	姓名	VARCHAR(10)	NOT NULL
    StudentSex	性别	CHAR(2)	NOT NULL 取”男”或’’女”
    StudentBirthday	生日	DATETIME	NOT NULL
    Phione	电话	CHAR(11)	NOT NULL
    Email	电子邮件	VARCHAR	NOT NULL
  }
*/
export const student_list = db.collection("STUDENT_LIST");
/*
  TEACHER_LIST {
    TeacherNum	教师工号	CHAR(10)	主码
    DeptNum	院系号码	CHAR(10)	NOT NULL
    TeacherName	姓名	VARCHAR(10)	NOT NULL
    TeacherSex	性别	CHAR(2)	NOT NULL 取”男”或”女”
    TeacherBirthday	生日	DATETIME	NOT NULL
    TeacherTitle	职称	VARCHAR(20)	
    Phione	电话	CHAR(11)	NOT NULL  
  }
*/
export const teahcer_list = db.collection("TEACHER_LIST");
/*
  管理员列表
  ADMIN_LIST { 
    AdminNum	教师工号	CHAR(10)	主码
    DeptNum	院系号码	CHAR(10)	NOT NULL
    AdminName	姓名	VARCHAR(10)	NOT NULL
    AdminSex	性别	CHAR(2)	NOT NULL 取”男”或”女”
    AdminBirthday	生日	DATETIME	NOT NULL
    Phione	电话	CHAR(11)	NOT NULL  
    Email 电子邮箱 VARCHAR(40) NOT NULL
  }
*/
export const admin_list = db.collection("ADMIN_LIST");
/*
  COURSE_LIST {
    CourseNum	课程号	CHAR(10)	PK
    CourseName	专业名称	CHAR(10)	NOT NULL
    TeacherName	授课老师姓名	VARCHAR(10)	NOT NULL
    TeacherNum	教师工号	CHAR(10)	FK NOT NULL
    Category	课程类型	CHAR(10)	NOT NULL 
    Credit	学分	CHAR(3)	NOT NULL
    PreCourse	先修课程名	CHAR(10)	NOT NULL
    PreNum	先修课程号	CHAR(10)	
    Time	上课时间	DATETIME	NOT NULL
    Location	上课地点	CHAR(10)	NOT NULL
    Num	课程剩余名额	CHAR(10)	NOT NULL
    MaxNum 选课人数上限 SMALLINT NOT NULL

  }Max
*/
export const course_list = db.collection("COURSE_LIST");


/*
  STUDENT_COURSE{
    StudentName	名称	CHAR(10)	PK
    CourseNum	课程号	CHAR(10)	PK
    Grade	成绩	CHAR(3)	  
  }
*/
export const student_course = db.collection("STUDENT_COURSE");
export const list = db.collection("list");
var courseCollection = db.collection("COURSE_LIST");
var _ = db.command

export class DataBaseManager {
  constructor() {

  }
  // 根据教师工号，创建属于该教师的记录
  addTeacherData(teacherNum){
    teahcer_list.add({
      data:{
        TeacherNum:teacherNum,
        DeptNum:"",
        TeacherName:app.globalData.username,
        TeacherSex:"",
        TeacherBirthday:"",
        TeacherTitle:"",
        Phone:""
      },
    })
  }
  // 根据学生学号，创建属于该学生的记录
  addStudentData(studentNum){
    student_list.add({
      data:{
        StudentNum: studentNum,
        DeptNum:"",
        StudentName: app.globalData.username,
        StudentSex:"",
        StudentBirthday:"",
        Phone:"",
        Email:"",
      },
    })
  }
  /*
  管理员列表
  ADMIN_LIST { 
    AdminNum	教师工号	CHAR(10)	主码
    DeptNum	院系号码	CHAR(10)	NOT NULL
    AdminName	姓名	VARCHAR(10)	NOT NULL
    AdminSex	性别	CHAR(2)	NOT NULL 取”男”或”女”
    Phione	电话	CHAR(11)	NOT NULL  
    Email 电子邮箱 VARCHAR(40) NOT NULL
  }
*/
  // 根据管理员工号，创建该管理员的记录
  addAdminData(adminNum){
    admin_list.add({
      data:{
        AdminNum:adminNum,
        DeptNum:"",
        AdminName:app.globalData.username,
        AdminSex:"",
        AdminBirthday:"",
        Phone:"",
        Email:""
      },
    })
  }
  getStudentInfo(studentNum){
    student_list.where({
      StudentNum: studentNum
    }).get().then(res => {
      studentInfo = res.data[0]
    })
    console.log(studentInfo)
    return studentInfo;
  }
  async GetMyCoursesName(stuNum) {
    var courseName = [];
    console.log(stuNum)
    // 异步操作让进程可以继续进行下去
    var p = await new Promise((resolve, reject) => {
      student_course.where({
        StudentNum: stuNum
      }).get().then(res => {
        console.log(res);
        // 选课列表为空
        if (res.data[0] == undefined) {
          wx.showModal({
            title: '提示',
            content: '您还没有选课',
          })
        } else {
          courseName = res.data[0].CourseName
          resolve(courseName)
        }
      })
    })
    return courseName
  }
  // 得到课程信息
  async GetCousreInfo(coursesName) {
    var prom = []
    for (var i = 0; i < coursesName.length; i++) {
      var p = new Promise((resolve, zreject) => {
        course_list.where({
          CourseName: coursesName[i]
        }).get().then(res => {
          resolve(res.data[0])
        })
      })
      prom.push(p)
    }
    return prom;
  }
  // 退课操作
  DropCourse(courseNum, courseName) {
    console.log(getApp().globalData)
    // 传入课程名称和个人信息
    wx.cloud.callFunction({
      name: "dropCourse",
      data: {
        studentNum: getApp().globalData.uid,
        courseNum: courseNum,
        courseName: courseName,
        studentName: getApp().globalData.username
      }
    })
  }
};