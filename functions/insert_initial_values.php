<?php
include_once('dbconnect.php');
// login, email, password, surname, name, country, city
$params = [
    "login" => "admin",
    "email" => "admin@admin.mail",
    "password" => password_hash("admin", PASSWORD_DEFAULT),
    "surname" => "Фамилия",
    "name" => "Имя",
    "country" => "Страна",
    "city" => "Город"
];
$result = dbInsertUserData($params);
if ($result===true){
    http_response_code(200);
    echo json_encode(true);
    die();}

    http_response_code(400);
    echo json_encode($result->getMessage());
?>