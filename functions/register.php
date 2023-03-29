<?php
$ROOT = $_SERVER["DOCUMENT_ROOT"];
include_once("$ROOT/functions/functions.php");
include_once("$ROOT/functions/dbconnect.php");
$loginKey = "reg-login";
// "reg-login"
// "reg-email"
// "reg-name"
// "reg-surname"
// "reg-country"
// "reg-city"
// "reg-password"

$data = json_decode(file_get_contents("php://input"), true);

if (isset($_POST[$loginKey])) {
    process_data($_POST);
}
if (isset($data[$loginKey])) {
    process_data($data);
}
response(400, "inexpected request");

function process_data($data)
{
    global $REGISTER_DATA_MATCHING_PATTERNS;
    if ($data["reg-password"] === $data["reg-password-repeat"] && checkValues($data, $REGISTER_DATA_MATCHING_PATTERNS)) {
        $parameters = fillQueryParameters($data);
        $result = dbInsertUserData($parameters);
        if ($result === true) {
            response(200, true);
        } else {
            response(400, $result);
        }
    } else {
        response(400, "data is invalid");
    }
}





function fillQueryParameters($data)
{
    return  [
        "login" => $data["reg-login"],
        "email" => $data["reg-email"],
        "password" => password_hash($data["reg-password"], PASSWORD_DEFAULT),
        "surname" => $data["reg-surname"],
        "name" => $data["reg-name"],
        "country" => $data["reg-country"],
        "city" => $data["reg-city"]
    ];
}
