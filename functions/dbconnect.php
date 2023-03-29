<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$db = new mysqli('localhost', 'test', 'test', 'web221.nikolaev.hw5_6');
$db->set_charset('utf8mb4');



function dbInsertUserData($params)
{
    global $db;
    $stmt = $db->prepare("INSERT INTO users(login, email, password, surname, name, country, city) VALUES (?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $params["login"],
            $params["email"],
            $params["password"],
            $params["surname"],
            $params["name"],
            $params["country"],
            $params["city"]
        ]);
    } catch (Exception $e) {
        return $e;
    }
    return true;
}
function dbLogin($params)
{
    global $db;
    $stmt = $db->prepare("SELECT u_id, login, password, name, surname FROM users WHERE login=?");
    try {
        $stmt->execute([$params["login"]]);
        $res = $stmt->get_result();
        $arr = $res->fetch_all(MYSQLI_ASSOC);
        $res->free();
        return $arr;
    } catch (Exception $e) {
        return $e;
    }
}
function dbCheckLogin($login)
{
    global $db;
    $stmt = $db->prepare("SELECT login FROM users WHERE login=?");
    $stmt->execute([$login]);
    $res = $stmt->get_result();
    $arr = $res->fetch_all(MYSQLI_ASSOC);
    $res->free();
    return count($arr) ? true : false;
}

function dbCheckEmail($email)
{
    global $db;
    $stmt = $db->prepare("SELECT email FROM users WHERE email=?");
    $stmt->execute([$email]);
    $res = $stmt->get_result();
    $arr = $res->fetch_all(MYSQLI_ASSOC);
    $res->free();
    return count($arr) ? true : false;
}

function prepared_query($mysqli, $sql, $params, $types = "")
{
    $types = $types ?: str_repeat("s", count($params));
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    return $stmt;
}

function response($code, $message)
{
    http_response_code($code);
    echo json_encode($message);
    die();
}
