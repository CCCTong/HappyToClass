// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var db = cloud.database()
var course_list = db.collection("COURSE_LIST");
var student_course = db.collection("STUDENT_COURSE");
var student_list = db.collection("STUDENT_LIST");
var teacher_list = db.collection("TEACHER_LIST");

// 云函数入口函数
exports.main = async (event, context) => {

  var globalData = event.globalData;
  var e = event.e;
  let courseName = e.target.id
  var selectInfo = '';
  student_course.where({
    StudentName: globalData.username,
    CourseName: courseName
  }).count().then(res => {
    return "重复选课";

    if (res.total != 0) {
      return "重复选课"
    } else {
      course_list.where({
        data: {
          CourseName: courseName
        }
      }).get().then(res => {
        if (res.data.num == 0) {
          return '人数已满';
        } else {
          //为“我的课程”添加课程数据
          student_course.where({
            StudentName: globalData.username
          }).count().then(res => {
            if (res.total == 0) {
              student_course.add({
                data: {
                  StudentName: globalData.username,
                  CourseName: new Array(courseName)
                }
              })
            } else {
              student_course.where({
                StudentName: globalData.username
              }).update({
                data: {
                  CourseName: _.push(courseName)
                }
              })
            }
          })
          const res = cloud.callFunction({
            name: "minusCourseNum",
            data: {
              CourseName: courseName
            }
          })
          return '选课成功'
        }
      })
    }
  })
  return "重复选课"
}