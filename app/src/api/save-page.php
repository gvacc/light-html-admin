<?php
$_POST = array_merge($_POST,json_decode(file_get_contents('php://input'),true));
$pageName = $_POST['pageName'];
$html = $_POST['html'];
$response = [];

if(!isset($pageName) || $pageName == '') {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Отправьте корректное имя";
    die();
}

if(!isset($html) || $html == '') {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Отправьте корректный html";
    die();
}

$file =  $pageName;

if(!is_dir('../backups/')) {
    mkdir('../backups/');
}

$backups = json_decode(file_get_contents('../backups/backups.json'));
if(!is_array($backups)) {
    $backups = [];
}

$backupFN = uniqid() . '.html';
copy('../../../../' . $file, "../backups/" . $backupFN);
array_push($backups, ["page" => $file, "file" => $backupFN, "time" => date("H:i:s d-m-y")]); 
file_put_contents("../backups/backups.json", json_encode($backups));
file_put_contents('../../../../' . $file, $html);
$response['message'] = 'Данные сохраненны!';

echo json_encode($response);