将 `cnblogs-auto-login` 文件夹放入 Apache 的 www 目录下。

# 基于 [jsencrypt](http://travistidwell.com/jsencrypt/) 的加密解密 demo

<http://localhost/cnblogs-auto-login/jsencrypt-demo/>

页面展示加密内容，以及加密后的结果，控制台输出解密结果


# RSA Key Generator

<http://localhost/cnblogs-auto-login/key-generator/>

Generate RSA Private Key & Public Key

# 博客园自动登录步骤


1. 修改 cnblogs-auto-login/encrypt-data/index.html 文件中的 username(line 9) 和 password(line 10) 变量值为真实的博客园登录用户名和密码

2. 客户端运行 <http://localhost/cnblogs-auto-login/encrypt-data/> 后生成加密后的用户名和密码保存到 a.txt 文件中（文件路径 cnblogs-auto-login/encrypt-data/a.txt）

3. 运行 `node cnblogs.js`  命令即完成模拟登录（后续可自动发帖、回帖等）