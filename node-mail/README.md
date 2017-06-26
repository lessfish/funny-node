# nodemailer-demo

## usage

- 代码中修改参数
- `node index.js`

## notice

- 需要在邮箱服务中开启 POP3/SMTP 服务
- `pass` 参数并不一定是你的邮箱密码（大多数情况下不是），当使用邮箱密码报错时，可以根据报错信息进行查看，可能会引导你生成新的可供第三方服务调用的邮箱密码，比如我就根据错误提示进入了 [这个页面](http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256)（获取客户端授权码）
- 附件／图片／抄送等高级功能可以参考 [官网](https://nodemailer.com/)

