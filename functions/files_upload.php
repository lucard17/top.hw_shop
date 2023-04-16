<?php
include_once('functions.php');
include_once('dbconnect.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <pre>
    <?php
    if (isset($_POST['type']) && $_POST['type'] == 'product' && isset($_POST['id']) && $_POST['id'] > 0) {
    }
    if (isset($_FILES['files'])) {
        echo insertProductImages($_FILES, $_POST['id']);
    }
    if (isset($_POST["remove_files"])) {
        echo  removeProductImages($_POST['id'], json_decode($_POST["remove_files"]));
    }

    ?>
<?php server_info();
//Добавляет файлы в папку images/products/id/ 
//Возвращает их количество.
function insertProductImages($_files, $product_id)
{
    global $ROOT;
    $produstImagesDir = "$ROOT/images/products/$product_id";
    if (!file_exists($produstImagesDir)) {
        mkdir($produstImagesDir, 0777, true);
    }

    //переименовывает файлы в папке по порядку.
    $dirFilesNumber = numberFilesInDir($produstImagesDir);


    //вставляет файлы в конец папки
    $files = reArrayFiles($_files['files']);
    foreach ($files as $file) {
        if (is_uploaded_file($file['tmp_name'])) {
            preg_match('/\.(?<ext>[^.]*$)/', $file['name'], $matches);
            $dirFilesNumber++;
            move_uploaded_file($file['tmp_name'], "$produstImagesDir/$dirFilesNumber.$matches[ext]");
        }
    }
    return $dirFilesNumber;
}

//Удаляет файлы из images/products/id/ по индексам.
//Нумерует оставшиеся файлы, возвращает их количество.
function removeProductImages($product_id, $filesIds = [])
{
    global $ROOT;
    $produstImagesDir = "$ROOT/images/products/$product_id";
    $dirFiles = getDirFiles($produstImagesDir);
    $dirFilesNumber = count($dirFiles) - 1;
    for ($i = 1; $i <= $dirFilesNumber; $i++) {
        preg_match('/(?<name>.*)\.(?<ext>[^.]*$)/', $dirFiles[$i], $matches);
        if (in_array($matches['name'], $filesIds)) {
            unlink("$produstImagesDir/$dirFiles[$i]");
        }
    }
    return numberFilesInDir($produstImagesDir);
}

//возвращает список файлов входящих в папке
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
function numberFilesInDir($dirPath)
{
    $dirFiles = getDirFiles($dirPath);
    $matches = [];

    $dirFilesNumber = count($dirFiles) - 1;
    for ($i = 1; $i <= $dirFilesNumber; $i++) {
        preg_match('/(?<name>.*)\.(?<ext>[^.]*$)/', $dirFiles[$i], $matches);
        if ($matches['name'] != $i) {
            rename("$dirPath/$matches[name].$matches[ext]", "$dirPath/$i.$matches[ext]");
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
?>
    </pre>

</body>

</html>