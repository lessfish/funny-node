# 博客园博文备份

1. 进入 <https://i.cnblogs.com/BlogBackup.aspx> 下载博客园提供的备份文件（xml 格式）
2. 修改 `index.js` 文件中的 `baseFileSrc` 变量值为备份根目录地址（改地址必须真实存在），`xmlSrc` 值为步骤一所得文件的地址
3. `node index.js`


备份结束目测结构如下：

    cnblogs|
          --|2014
            --|9
              --|greasemonkey常见问题
                --|greasemonkey常见问题.html
              --|用php自动发邮件的简单实现
                --|用php自动发邮件的简单实现.html
                --|img
            --|10
              --|chrome扩展制作之hello world篇
                --|chrome扩展制作之hello world篇.html
                --|img

              ...

          --|2015

              ...

          --|2016

              ...
