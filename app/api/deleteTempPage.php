<?php
session_start();
if ($_SESSION['auth'] !== true) {
  header('HTTP/1.1 403 Forbidden');
  die;
}

$del_file = '../../fgfdhtetrerd45315_vbnbvnc.html';

if(file_exists($del_file)) {
  unlink($del_file);
} else {
  header('HTTP/1.1 400 Bad Request');
}
