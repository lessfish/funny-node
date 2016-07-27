<?php
  $data = $_POST['data'];
  $url = "../a.txt";

  // 将加密后的数据放在 txt 文件中
  // 供 node 调用
  file_put_contents($url, $data);
?>