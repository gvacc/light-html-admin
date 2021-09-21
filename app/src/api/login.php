<?php
session_start();
$_POST = array_merge($_POST,json_decode(file_get_contents('php://input'), true));
$response = [];
$password = $_POST['password'];

if(isset($password) && $password != '') {
	$settings = json_decode(file_get_contents('./settings.json'), true);
	if($password == $settings['password']) {
		$_SESSION['auth'] = true;
		$response['message'] = 'Вы авторизированы!';
		$response['auth'] = true;

		echo json_encode($response);
	} else {
		$response['auth'] = false;
		echo json_encode($response);
	}
} else {
	header('HTTP/1.0 400 Bad Request');
}