<?php
$_POST = array_merge($_POST,json_decode(file_get_contents('php://input'),true));
$name = $_POST['file_name'];
$response = [];

if($_SESSION['auth'] != true) {
    header('HTTP/1.0 403 Forbidden');
    die;
}

if(!isset($name) || $name == '') {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Введите название файла!";
    die();
}

$name = preg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $name);
$name = preg_replace('/^\./', '', $name);
$name = preg_replace('/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i', '', $name);
$name = preg_replace('/^\s/', '', $name);

$name_without_extension = preg_replace('/\\.[^.\\s]{3,4}$/', '', $name);
$full_name = $name_without_extension . '.html';
$new_file = '../../../../' . $full_name;

if(!file_exists($new_file)) {
    fopen($new_file, 'w');
    $response['message'] = 'Файл создан!';
    $response["file_name"] = $full_name; 
} else {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Файл {$full_name} уже существует!";
}

echo json_encode($response);
