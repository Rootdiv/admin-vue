<?php
$new_file = '../../' . $_POST['name'] . '.html';

if(file_exists($new_file)) {
  header('HTTP/1.1 400 Bad Request');
} else {
  fopen($new_file, 'w');
}
