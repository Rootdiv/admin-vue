<?php
session_start();
if ($_SESSION['auth'] !== true) {
  header('HTTP/1.1 403 Forbidden');
  die;
}

$html_files = glob('../../*.html');

$response = [];

foreach($html_files as $file) {
  array_push($response, basename($file));
}

echo json_encode($response);
