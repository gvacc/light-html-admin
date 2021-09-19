<?php
$_POST = array_merge($_POST,json_decode(file_get_contents('php://input'),true));
$name = $_POST['file_name'];
$response = [];

$full_name = $name . '.html';
$new_file = '../../../../' . $full_name;

try {
    if(!file_exists($new_file)) {
        fopen($new_file, 'w');
        $response['message'] = "Файл {$full_name} создан!";
    
    } else {
        header('HTTP/1.1 400 Bad Request');
        $response['message'] = "Файл {$full_name} уже существует!";
    }
} catch (\Exception $e) {
    $response['message'] = "Что-то пошло не так, попробуйте снова...";
}


echo json_encode($response);
