<?php
$_POST = json_decode(file_get_contents('php://input'), true);

$del_file = '../../' . $_POST['name'];

if(file_exists($del_file)) {
  unlink($del_file);
} else {
  header('HTTP/1.1 400 Bad Request');
}
