<?php
session_start();
if ($_SESSION['auth'] !== true) {
  header('HTTP/1.1 403 Forbidden');
  die;
}

$folder = '../backups/';
$_POST = json_decode(file_get_contents('php://input'), true);

$file = $_POST['pageName'];
$new_html = $_POST['html'];

if (!is_dir($folder)) {
  mkdir($folder);
}

$backups = json_decode(file_get_contents($folder . 'backups.json'));
if (!is_array($backups)) {
  $backups = [];
}

if ($new_html && $file) {
  $backupFN = uniqid() . '.html';
  copy('../../' . $file, $folder . $backupFN);
  array_push($backups, ['page' => $file, 'file' => $backupFN, 'time' => date('H:i:s d.m.Y')]);
  file_put_contents($folder . 'backups.json', json_encode($backups));

  file_put_contents('../../' . $file, $new_html);
} else {
  header('HTTP/1.1 400 Bad Request');
}
