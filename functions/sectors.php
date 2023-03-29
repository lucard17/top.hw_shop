<?php
session_start();
include_once('dbconnect.php');
$DATA = json_decode(file_get_contents("php://input"), true);
if (isset($_GET['q']) && $_GET['q'] == 'select') {
    if (isset($_SESSION["autorized"])) {
        switch ($_GET['type']) {
            case "sector":
                echo response(200, db_get("SELECT * FROM sectors ORDER BY id"), []);
                break;
            case "category":
                echo response(200, db_get("SELECT * FROM categories WHERE p_id = ? ORDER BY id", [$_GET['p_id']]));
                break;
            case "product":
                echo response(200, db_get("SELECT * FROM products WHERE p_id = ? ORDER BY id", [$_GET['p_id']]));
                break;
        }
    } else {
        echo response(400, "Unauthorized user");
    }
    die();
}
if (isset($DATA["action"])) {
    switch ($DATA["action"]) {
        case "insert sector":
            if (db_modify("INSERT INTO sectors(name) VALUES (?)", [$DATA["name"]]) === true) {
                echo response(200, db_get("SELECT * FROM sectors ORDER BY id"));
            }
            break;
        case "delete sector":
            if (db_modify("DELETE FROM sectors WHERE id=?", [$DATA["id"]]) === true) {
                echo response(200, db_get("SELECT * FROM sectors ORDER BY id"));
            }
            break;
        case "insert category":
            if (db_modify("INSERT INTO categories(name,p_id) VALUES (?,?)", [$DATA["name"], $DATA["p_id"]]) === true) {
                echo response(200, db_get("SELECT * FROM categories WHERE p_id = ? ORDER BY id", [$DATA["p_id"]]));
            }
            break;
        case "delete category":
            if (db_modify("DELETE FROM categories WHERE id=?", [$DATA["id"]]) === true) {
                echo response(200, db_get("SELECT * FROM categories WHERE p_id = ? ORDER BY id", [$DATA["p_id"]]));
            }
            break;

            break;
        case "insert product":
            if (db_modify("INSERT INTO products(name,p_id) VALUES (?,?)", [$DATA["name"], $DATA["p_id"]]) === true) {
                echo response(200, db_get("SELECT * FROM products WHERE p_id = ? ORDER BY id", [$DATA["p_id"]]));
            }

            break;
        case "delete product":
            if (db_modify("DELETE FROM products WHERE id=?", [$DATA["id"]]) === true) {
                echo response(200, db_get("SELECT * FROM products WHERE p_id = ? ORDER BY id", [$DATA["p_id"]]));
            }

            break;
    }
}

echo json_encode($DATA);

function db_get($sql, $parameters = [])
{

    global $db;
    try {
        $stmt = $db->prepare($sql);
        // if (count($parameters) > 0) {
            $stmt->execute($parameters);
        // } else {
            // $stmt->execute();
        // }
        $result = $stmt->get_result();
        $resultArray = $result->fetch_all(MYSQLI_ASSOC);
        $result->free();
        return $resultArray;
    } catch (Exception $e) {
        echo response(200, $db->error_list);
    }
}

function db_modify($sql, $properties_array)
{
    global $db;
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($properties_array);
    } catch (Exception $e) {
        echo response(400, $db->error_list);
    }
    return true;
}
