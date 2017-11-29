var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
 
var transporter = nodemailer.createTransport({
  service: "qq",
  secure: true, // 使用 SSL
  auth: {
    user: "xxoo@qq.com",
    pass: "***" // 授权码，看 README
  }
});


// 也可以这样
// var transporter = nodemailer.createTransport({
//   host: "smtp.qq.com",
//   port: 465,
//   secure: true, // 使用 SSL
//   auth: {
//     user: "xxoo@qq.com",
//     pass: "***" // 授权码，看 README
//   }
// });

// 也可以这样
// var transporter = nodemailer.createTransport(smtpTransport({
//   host: "smtp.qq.com",
//   port: 465,
//   secure: true, // 使用 SSL
//   auth: {
//     user: "xxoo@qq.com",
//     pass: "***" // 授权码，看 README
//   }
// }));


// NB! No need to recreate the transporter object. You can use 
// the same transporter object for all e-mails 
 
// setup e-mail data with unicode symbols 
var mailOptions = {
  from: 'xxoo@qq.com', // sender address，和 transporter 中的配置保持一致
  to: 'ooxx@foxmail.com, ooxx@qq.com', // 邮件接收者，可以同时发送多个，逗号分隔
  subject: '测试邮件 title', // Subject line 
  text: 'Hello world', // plaintext body 
  html:  fs.readFileSync('./tpl.html', 'utf-8') // html body，发送的邮件内容，当有 html 参数时会忽略 text 参数
};
 
// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
  if(error){
    return console.log(error);
  }

  console.log('Message sent: ' + info.response);
});