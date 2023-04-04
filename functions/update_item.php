<?php
include_once('dbconnect.php');
session_start();
if (!isset($_SESSION['role_id']) || $_SESSION['role_id'] !== 1) {
    http_response_code(404);
}
$data = json_decode(file_get_contents("php://input"), true);
$names = ['name', 'brand', 'description', 'price', 'p_id'];
if (!isset($_POST["action"])) {
    http_response_code(404);
}

switch ($_POST["type"]) {
    case "sector":
        $table = "sectors";
        break;
    case "category":
        $table = "categories";
        break;
    case "product":
        $table = "products";
        break;
}


switch ($_POST["action"]) {
    case "select":
        $stmt = pdo()->prepare("SELECT * FROM $table WHERE id = :id");
        try {
            $stmt->execute([
                'id' => $_POST["id"]
            ]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($result);
        } catch (PDOException $e) {
            echo json_encode(false);
        }
        break;
    case "update":
        try {
            if (!isset($_POST['id'])) {
                echo json_encode(false);
            }
            $query = "UPDATE $table SET";
            $parameters = [];

            foreach ($names as $name) {
                if (isset($_POST[$name])) {
                    $query .= " $name =:$name,";
                    $parameters[$name] = $_POST[$name];
                }
            }
            $query = preg_replace("/,$/", "", $query);
            $query .= " WHERE id = :id";
            $parameters['id'] = $_POST["id"];
        } catch (Exception $e) {
            echo json_encode($e);
            die;
        }

        $stmt = pdo()->prepare($query);
        try {
            $stmt->execute($parameters);
            echo json_encode(true);
        } catch (PDOException $e) {
            echo json_encode(false);
            echo json_encode($query);
            echo json_encode($parameters);
            echo json_encode($e);
        }
        break;
}
