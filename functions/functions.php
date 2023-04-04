<?php
const LOGIN_INVALID_DATA = 0;
const LOGIN_NOT_EXIST = 1;
const LOGIN_INCORRECT_PASSWORD = 2;
const LOGIN_SUCCESS = 3;
const IS_VALID_MARK = "is-valid";
const IS_INVALID_MARK = "is-invalid";
const IS_NOT_FREE_MARK = "is-not-free";
const DEBUG_MODE = true;
$ROOT = $_SERVER["DOCUMENT_ROOT"];

$login_status = -1;

$COMMON_DATA_MATCHING_PATTERN = '/^(?=[A-Za-zА-Яа-яЁё])[A-Za-zА-Яа-яё0-9\'\-\s]{2,50}(?<![\s\-\'])$/u';
$LOGIN_DATA_MATCHING_PATTERNS = [
    "login" => '/^(?=[A-Za-z])[A-Za-z0-9\'_\-.]{3,30}(?<!\.)$/u',
    "password" => '/^(?=.*[A-Z]+.*)(?=.*[a-z]+.*)(?=.*[0-9]+.*)(?=.*[_-~!@#$%^&*(){}\[\]+\`\'";:<>\/\|]+.*).{8,50}$/u'
];

$pages = [];
// Здесь находится логика обработки событий login и logout
if (isset($_POST["logout"])) {
    unset(
        $_SESSION["autorized"],
        $_SESSION["name"],
        $_SESSION["surname"],
        $_SESSION["id"]
    );
    session_destroy();
}
if (isset($_POST["login"]) && isset($_POST["password"])) {
    if (checkValues($_POST, $LOGIN_DATA_MATCHING_PATTERNS)) {
        include_once('./functions/dbconnect.php');
        $queryResult = dbLogin(["login" => $_POST["login"]]);
    } else {
        $queryResult = false;
    }
    if ($queryResult === false) {
        $login_status = LOGIN_INVALID_DATA;
    } else {
        if (count($queryResult) === 0) {
            $login_status = LOGIN_NOT_EXIST;
        } else {
            $queryResult = $queryResult[0];
            if (password_verify($_POST["password"], $queryResult["password"])) {
                $login_status = LOGIN_SUCCESS;
                $_SESSION["autorized"] = true;
                $_SESSION["name"] = $queryResult["name"];
                $_SESSION["surname"] = $queryResult["surname"];
                $_SESSION["id"] = $queryResult["u_id"];
                $_SESSION["role_id"] = $queryResult["role_id"];
            } else {

                $login_status = LOGIN_INCORRECT_PASSWORD;
            }
        }
    }
}

//Достает имя странницы по номеру
function getPageName($pageNumder)
{
    global $pages;
    return array_search($pageNumder, $pages);
}

//Формирует URL странницы по номеру
function getPageURL($pageNumder)
{
    return "pages/" . getPageName($pageNumder) . ".php";
}

// проверет значения из массива $data по регулярын выражениям из массива $patterns 
// возвращает false с случае любого несовпадения
// если ключ присутствует в $patterns и отсутствует в $data возвращает false

function checkValues($data, $patterns)
{
    foreach ($patterns as $key => $pattern) {
        if (!isset($data[$key])) return false;
        if (!preg_match($pattern, mb_substr($data[$key], 0)))  return false;
    }
    return true;
}
function debug_to_console($data = "")
{
    static $logs = [];
    if (DEBUG_MODE == false) return false;
    if ($data !== "") {
        $logs[] = $data;
    } else {
        echo "<script> 
        const logs = (JSON.parse(decodeURIComponent('" . addslashes(json_encode($logs)) . "')));
        logs.forEach(log=>console.log(log));
        </script>";
    }
}
function server_info()
{
    if (DEBUG_MODE == false) return false;
    echo "<hr>";
    echo "\$_SERVER[DOCUMENT_ROOT]: " . $_SERVER['DOCUMENT_ROOT'];
    echo "<hr>";
    echo "GET info:<br>";
    foreach ($_GET as $key => $value) {
        echo "\$_GET ($key) : $value <br>";
    };
    echo "<hr>";
    echo "POST info:<br>";
    foreach ($_POST as $key => $value) {
        echo "\$_POST ($key) : $value <br>";
    };
    echo "<hr>";
    echo "SESSION info:<br>";
    echo "session_id() : " . session_id() . "<br>";
    foreach ($_SESSION as $key => $value) {
        echo "\$_SESSION ($key) : $value <br>";
    };
    echo "<hr>";
}
