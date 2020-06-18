// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//引入发送邮件的类库
// 具体操作见https://blog.csdn.net/qiushi_1990/article/details/98660081?%3E
// kxbatohzvhoiebbf 授权码
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: '2268340097@qq.com', //邮箱账号
    pass: 'kxbatohzvhoiebbf' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async (event, context) => {
  email = event.email
  message = event.message // 邮件的内容

  // 创建一个邮件对象
  var mail = {
    // 发件人
    from: '找回密码<2268340097@qq.com>',
    // 主题
    subject: '找回密码',
    // 收件人
    to: email,
    // 邮件内容，text或者html格式
    text:message//可以是链接，也可以是验证码
  }
  // let res = await transporter.sendMail(mail)
  try{
    await transporter.sendMail(mail)
  }catch{res}
  return res
}