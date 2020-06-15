// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var db = cloud.database()
var course_list = db.collection("COURSE_LIST");
var student_course = db.collection("STUDENT_COURSE");
var course_studnet = db.collection("COURSE_STUDENT");
var student_list = db.collection("STUDENT_LIST");
var teacher_list = db.collection("TEACHER_LIST");
var _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  var studentName = event.studentName;
  var courseNum = event.courseNum;
  var courseName = event.courseName;
  var studentNum = event.studentNum;
  course_list.where({
    CourseNum:courseNum
  }).update({
    data:{
      Num:_.inc(1),
    }
  })
  student_course.where({
    StudentNum: studentNum
  }).update({
    data:{
      CourseNum:_.pull(courseNum),
      CourseName: _.pull(courseName)
    }
  })
  course_studnet.where({
    CourseNum: courseNum
  }).update({
    data:{
      StudentNum:_.pull(studentNum),
      StudentName: _.pull(studentName)
    }
  })
}