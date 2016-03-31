# 博客园自动登录步骤

1. 将 jsencrypt 文件夹放到本地服务器一级目录下（比如 apache 的 www 文件夹下），修改 jsencrypt/encrypt_data.html 文件中的 username(line 9) 和 password(line 10) 变量值为真实的博客园登录用户名和密码

2. 客户端运行 <http://localhost/jsencrypt/encrypt_data.html> 后生成加密后的数据保存到 a.txt 文件中（文件路径 jsencrypt/a.txt）

3. 运行 `node cnblogs.js`  命令即完成模拟登录（后续可自动发帖、回帖等）