<?php
$_POST = array_merge($_POST,json_decode(file_get_contents('php://input'),true));
$html = $_POST['html'];
$response = [];

if(!isset($html) || $html == '') {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Отправьте корректный html";
    die();
}

$new_file = '../../../../' . 'temp.html';

file_put_contents($new_file, $html);
$response['message'] = 'Данные сохраненны!';
$response['file_name'] = 'temp.html';

echo json_encode($response);