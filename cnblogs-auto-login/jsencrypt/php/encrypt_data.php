<?php
  $data = $_POST['data'];
  $url = "../a.txt";
  file_put_contents($url, $data);
?>