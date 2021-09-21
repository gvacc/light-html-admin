<?php 
session_start();

$isAuth = $_SESSION['auth'];

if($isAuth == true) {
	echo json_encode(array('auth' => true));
} else {
	echo json_encode(array('auth' => false));
}