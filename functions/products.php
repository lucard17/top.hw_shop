<?php
if (!isset($_GET['id'])) {
    exit("id is not set");
}
include_once('dbconnect.php');
try {
    $query = "SELECT * FROM products WHERE p_id=:p_id";
    $stmt = pdo()->prepare($query);
    $stmt->execute(['p_id' => $_GET['id']]);

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    exit(json_encode($result));
} catch (PDOException $e) {
    echo json_encode(false);
    // echo json_encode($query);
    // echo json_encode($parameters);
    // echo json_encode($e);
}
