<?php
include_once('dbconnect.php');
$data = json_decode(file_get_contents("php://input"), true);
if (isset($_GET["email"])) {
    echo dbCheckEmail($_GET["email"]) ? "true" : "false";
    die();
}
if (isset($_POST["email"])) {
    echo dbCheckEmail($_POST["email"]) ? "true" : "false";
    die();
}
if (isset($data["email"])) {
    echo dbCheckEmail($data["email"]) ? "true" : "false";
    die();
}
http_response_code(404);
echo json_encode("unexpected request");