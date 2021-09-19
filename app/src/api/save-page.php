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

$file = '../../../../' . $pageName;

file_put_contents($file, $html);
$response['message'] = 'Данные сохраненны!';

echo json_encode($response);