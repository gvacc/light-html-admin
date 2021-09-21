<?php
$image = $_FILES['image']['tmp_name'];
if(file_exists($image) && is_uploaded_file($image)) {
	$file_extension = explode('/', $_FILES['image']['type'])[1];
	$file_name = uniqid() . '.' . $file_extension;
	
	move_uploaded_file($image, '../../../../img/' . $file_name);

	echo json_encode(array('src' => $file_name, 'message' => 'Изображение сохранено!'));
}