<?php
include_once('dbconnect.php');
$data = json_decode(file_get_contents("php://input"), true);
if (isset($_GET["login"])) {
    echo dbCheckLogin($_GET["login"]) ? "true" : "false";
    die();
}
if (isset($_POST["login"])) {
    echo dbCheckLogin($_POST["login"]) ? "true" : "false";
    die();
}
if (isset($data["login"])) {
    echo dbCheckLogin($data["login"]) ? "true" : "false";
    die();
}
http_response_code(404);
echo json_encode("unexpected request");