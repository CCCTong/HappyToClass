export const db = wx.cloud.database();
/*
  数据库表单命名
  STUDENT_LIST {
    StudentNum	学号	CHAR(10)	PK
    MajorNum	专业号码	CHAR(10)	NOT NULL
    StudentName	姓名	VARCHAR(10)	NOT NULL
    StudentSex	性别	CHAR(2)	NOT NULL 取”男”或’’女”
    StudentBirthday	生日	DATETIME	NOT NULL
    StudentPassword	密码	VARCHAR(20)	NOT NULL
    ClassId	行政班级编号	CHAR(8)	NOT NULL
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
    Num	选课人数上限	CHAR(10)	NOT NULL

  }
*/
export const course_list = db.collection("COURSE_LIST");


/*
  STUDENT_COURSE{
    StudentName	名称	CHAR(10)	PK
    CourseName 	课程名称	CHAR(10)	PK
    Grade	成绩	CHAR(3)	  
  }
*/
export const student_course = db.collection("STUDENT_COURSE")


var _ = db.command

export class DataBaseManager {
  constructor() {

  }
  // 查询学生选课的课程名称
  async GetMyCoursesName(stuName) {
    var courseName = [];
    console.log(stuName)
    // 异步操作让进程可以继续进行下去
    var p = await new Promise((resolve, reject) => {
      student_course.where({
        StudentName: stuName
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
  DropCourse(e) {
    let courseName = e.target.id
    console.log(e);
    // 传入课程名称和个人信息
    wx.cloud.callFunction({
      name: "dropCourse",
      data: {
        globalData: getApp().globalData,
        courseName: courseName
      }
    })
  }
};