<?php
$_POST = array_merge($_POST,json_decode(file_get_contents('php://input'),true));
$file = $_POST['file'];
$page = $_POST['page'];

$response = [];

if(!isset($page) || $page == '') {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Отправьте название страницы";
    die();
}

if(!isset($file) || $file == '') {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Отправьте название backup";
    die();
}

copy('../backups/' . $file, '../../../../' . $page);
$response['message'] = 'страница восстановлена!';

echo json_encode($response);