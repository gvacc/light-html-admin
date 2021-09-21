<?php  

if($_SESSION['auth'] != true) {
    header('HTTP/1.0 403 Forbidden');
    die;
}

$htmlfiles = glob('../../../../*.html'); //Находит пути файлов по паттерну
$response = [];

foreach ($htmlfiles as $file) {
    $original_name =  basename($file); //Возвращает оригинальное имя файла
    array_push($response, $original_name ); //Добавляет элементы в массив
}

echo json_encode($response);