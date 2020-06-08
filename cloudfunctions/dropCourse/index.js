// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var db = cloud.database()
var course_list = db.collection("COURSE_LIST");
var student_course = db.collection("STUDENT_COURSE");
var student_list = db.collection("STUDENT_LIST");
var teacher_list = db.collection("TEACHER_LIST");
var _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  var globalData = event.globalData;
  var courseName = event.courseName;
  course_list.where({
    CourseName:courseName
  }).update({
    data:{
      Num:_.inc(1),
    }
  })
  student_course.where({
    StudentName: globalData.username
  }).update({
    data:{
      CourseName:_.pull(courseName)
    }
  })
}