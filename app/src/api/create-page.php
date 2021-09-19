<?php
$_POST = array_merge($_POST,json_decode(file_get_contents('php://input'),true));
$name = $_POST['file_name'];
$response = [];

if(!isset($name) || $name == '') {
    header('HTTP/1.0 400 Bad Request');
    $response['message'] = "Введите название файла!";
    die();
}

$name_without_extension = preg_replace('/\\.[^.\\s]{3,4}$/', '', $name);
$full_name = $name_without_extension . '.html';
$new_file = '../../../../' . $full_name;

try {
    if(!file_exists($new_file)) {
        fopen($new_file, 'w');
        $response["file_name"] = $full_name; 
    
    } else {
        header('HTTP/1.0 400 Bad Request');
        $response['message'] = "Файл {$full_name} уже существует!";
    }
} catch (\Exception $e) {
    $response['message'] = "Что-то пошло не так, попробуйте снова...";
}


echo json_encode($response);
