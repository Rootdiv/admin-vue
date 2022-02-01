<?php
$del_file = '../../' . $_POST['name'] . '.html';

if(file_exists($del_file)) {
  unlink($del_file);
} else {
  header('HTTP/1.1 404 Not Found');
}
