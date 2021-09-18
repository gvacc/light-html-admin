<?php  

$htmlfiles = glob('../../../../*.html'); //Находит пути файлов по паттерну
$response = [];

foreach ($htmlfiles as $file) {
    $original_name =  basename($file); //Возвращает оригинальное имя файла
    array_push($response, $original_name ); //Добавляет элементы в массив
}

var_dump($response);