<?php
const LOGIN_INVALID_DATA = 0;
const LOGIN_NOT_EXIST = 1;
const LOGIN_INCORRECT_PASSWORD = 2;
const LOGIN_SUCCESS = 3;
const IS_VALID_MARK = "is-valid";
const IS_INVALID_MARK = "is-invalid";
const IS_NOT_FREE_MARK = "is-not-free";
const DEBUG_MODE = false;
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
    if (!isset($_SESSION["role_id"]) || $_SESSION["role_id"] !== 1) {
        return false;
    }
    if (DEBUG_MODE == false) return false;
    echo "<hr>";
    echo "\$_SERVER[DOCUMENT_ROOT]: " . $_SERVER['DOCUMENT_ROOT'];
    echo "<hr>";
    echo "<pre>GET info:";
    print_r($_GET);
    // foreach ($_GET as $key => $value) {
    //     echo "\$_GET ($key) : $value <br>";
    // };
    echo "</pre>";
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
function insertProductImages($product_id, $_files)
{
    global $ROOT;
    $productsImagesDir = "$ROOT/images/products/$product_id";
    if (!file_exists($productsImagesDir)) {
        mkdir($productsImagesDir, 0777, true);
    }

    //переименовывает файлы в папке по порядку.
    $dirFilesNumber = numberFilesInDir($productsImagesDir);


    //вставляет файлы в конец папки
    $files = reArrayFiles($_files['files']);
    foreach ($files as $file) {
        if (is_uploaded_file($file['tmp_name'])) {
            preg_match('/\.(?<ext>[^.]*$)/', $file['name'], $matches);
            $dirFilesNumber++;
            move_uploaded_file($file['tmp_name'], "$productsImagesDir/" . sprintf("%02d", $dirFilesNumber) . ".$matches[ext]");
        }
    }
    return $dirFilesNumber;
}

//Удаляет файлы из images/products/id/ по индексам.
//Нумерует оставшиеся файлы, возвращает их количество.
function removeProductImages($product_id, $filesIds = [])
{
    global $ROOT;
    for ($i = 0; $i < count($filesIds); $i++) {
        $filesIds[$i] = sprintf("%02d", $filesIds[$i]);
    }
    $productsImagesDir = "$ROOT/images/products/$product_id";
    $dirFiles = getDirFiles($productsImagesDir);
    $dirFilesNumber = count($dirFiles) - 1;
    for ($i = 1; $i <= $dirFilesNumber; $i++) {
        preg_match('/(?<name>.*)\.(?<ext>[^.]*$)/', $dirFiles[$i], $matches);
        if (in_array($matches['name'], $filesIds)) {
            rename("$productsImagesDir/$dirFiles[$i]", "$ROOT/images/recycle/$dirFiles[$i]"); 
            // unlink("$productsImagesDir/$dirFiles[$i]");
        }
    }
    return numberFilesInDir($productsImagesDir);
}

//возвращает список файлов входящих в папке
function getProductImagesPathNames($product_id)
{
    global $ROOT;
    $productsImagesDir = "$ROOT/images/products/$product_id";
    $dirFiles = getDirFiles($productsImagesDir);
    $imagePathFiles = [];
    for ($i = 1; $i < count($dirFiles); $i++) {
        $imagePathFiles[] = ['src' => "images/products/$product_id/$dirFiles[$i]", 'index' => $i];
    }
    return $imagePathFiles;
}
function getDirFiles($dirPath)
{
    $dirHanle = opendir($dirPath);
    $dirFiles = [""];
    while (($dirFile = readdir(($dirHanle))) !== false) {
        if ($dirFile == '.' || $dirFile == '..') continue;
        $dirFiles[] = $dirFile;
    }
    closedir($dirHanle);
    return $dirFiles;
}

//переименовывает файлы по порядку начиная с индекса 1
function numberFilesInDir($dirPath, $removeFilesIds = [])
{
    $dirFiles = getDirFiles($dirPath);
    $matches = [];

    $dirFilesNumber = count($dirFiles) - 1;
    for ($i = 1; $i <= $dirFilesNumber; $i++) {
        preg_match('/(?<name>.*)\.(?<ext>[^.]*$)/', $dirFiles[$i], $matches);
        if ($matches['name'] != sprintf("%02d", $i)) {
            rename("$dirPath/$matches[name].$matches[ext]", "$dirPath/" . sprintf("%02d", $i) . ".$matches[ext]");
        }
    }

    return $dirFilesNumber;
}
// Преобразует массив с файлами к виду $_files[index][...]
function reArrayFiles(&$file_post)
{
    $file_ary = array();
    $file_count = count($file_post['name']);
    $file_keys = array_keys($file_post);

    for ($i = 0; $i < $file_count; $i++) {
        foreach ($file_keys as $key) {
            $file_ary[$i][$key] = $file_post[$key][$i];
        }
    }
    return $file_ary;
}