<?php
session_start();
if ($_SESSION['auth'] !== true) {
  header('HTTP/1.1 403 Forbidden');
  die;
}

$_POST = json_decode(file_get_contents('php://input'), true);

$new_file = '../../fgfdhtetrerd45315_vbnbvnc.html';

if($_POST['html']) {
  file_put_contents($new_file, $_POST['html']);
} else {
  header('HTTP/1.1 400 Bad Request');
}
