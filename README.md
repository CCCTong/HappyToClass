# 云开发 quickstart

## 这是HappyToClass的使用指南，使用前请确保拥有如下配置

- 微信开发者工具：云开发
- 后台：node.js

## 使用说明

- 确保部署小程序云开发
- 确保**app.js**文件中env配置为本地云开发环境ID
- 确保云数据库创建集合 
  - COURSE_LIST   
  - STUDENT_COURSE
  - STUDENT_LIST
  - TEACHER_LIST
  
export const db = wx.cloud.database();
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
export const student_list = db.collection("STUDENT_LIST")
  TEACHER_LIST {
    TeacherNum	教师工号	CHAR(10)	主码
    DeptNum	院系号码	CHAR(10)	NOT NULL
    TeacherName	姓名	VARCHAR(10)	NOT NULL
    TeacherSex	性别	CHAR(2)	NOT NULL 取”男”或”女”
    TeacherBirthday	生日	DATETIME	NOT NULL
    TeacherTitle	职称	VARCHAR(20)	
    Phione	电话	CHAR(11)	NOT NULL  
  }
export const teahcer_list = db.collection("TEACHER_LIST")

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
export const course_list = db.collection("COURSE_LIST")
- 在详情中开启不校验合法域名
## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

