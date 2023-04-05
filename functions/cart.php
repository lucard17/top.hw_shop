<?php
include_once('dbconnect.php');
session_start();
if (!isset($_SESSION['id'])) {
    echo json_encode(false);
    die;
}
if (!isset($_POST["action"])) {
    echo json_encode(false);
    die;
}


$logfile = fopen("log.txt", 'a');
try {
    switch ($_POST["action"]) {
            //Добавляет предмет в корзину, если еще нет - создает, если уже есть - +1
        case "add":
            if (empty($_POST["p_id"])) {
                // echo json_encode(false);
                exit(json_encode(false));
            }
            $query = "SELECT * FROM carts WHERE u_id=:u_id AND p_id=:p_id";
            $parameters = [
                'u_id' => $_SESSION['id'],
                'p_id' => $_POST['p_id']
            ];
            //Выясняем есть ли такой товар у пользователя в корзине;
            $stmt = pdo()->prepare($query);
            $stmt->execute($parameters);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (is_array($result) && count($result) == 1) {
                $currentCount = $result[0]['count'];
                $count = $currentCount + 1;

                $query = "UPDATE carts SET count=:count WHERE u_id=:u_id AND p_id=:p_id";
                $stmt = pdo()->prepare($query);

                $parameters['count'] = $count;

                $result = $stmt->execute($parameters);
            } else {
                $query = "INSERT INTO carts (u_id, p_id) VALUES (:u_id, :p_id)";
                $stmt = pdo()->prepare($query);
                $result = $stmt->execute($parameters);
            }
            exit(json_encode($result));
            break;
            //Изменяет количество предметов в корзине;
        case "update":
            if (empty($_POST["p_id"]) || empty($_POST["count"])) {
                // echo json_encode(false);
                exit(json_encode(false));
            }

            $query = "UPDATE carts SET count=:count WHERE u_id=:u_id AND p_id=:p_id";
            $parameters = [
                'u_id' => $_SESSION['id'],
                'p_id' => $_POST['p_id'],
                'count' => $_POST['count']
            ];
            $stmt = pdo()->prepare($query);
            $result = $stmt->execute($parameters);
            exit(json_encode($result));
            break;

        case "delete":
            //Изменяет товар из корзины;
            if (empty($_POST["p_id"])) {
                // echo json_encode(false);
                exit(json_encode(false));
            }

            $query = "DELETE FROM carts WHERE u_id=:u_id AND p_id=:p_id";
            $parameters = [
                'u_id' => $_SESSION['id'],
                'p_id' => $_POST['p_id']
            ];
            //Выясняем есть ли такой товар у пользователя в корзине;
            $stmt = pdo()->prepare($query);
            $result = $stmt->execute($parameters);
            exit(json_encode($result));
            break;

        case "clear":
            //Очищает корзину;
            $query = "DELETE FROM carts WHERE u_id=:u_id";
            $parameters = [
                'u_id' => $_SESSION['id']
            ];
            $stmt = pdo()->prepare($query);
            $result = $stmt->execute($parameters);
            exit(json_encode($result));
            break;

        case "get":

            $query = "SELECT p.id, p.name, p.brand, p.description, p.price, c.count
            FROM carts as c, products as p
            WHERE p.id = c.p_id and c.u_id = :u_id";
            $parameters = [
                'u_id' => $_SESSION['id']
            ];
            $stmt = pdo()->prepare($query);
            $stmt->execute($parameters);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            exit(json_encode($result));
            break;
        case "get_total_count":

            $query = "SELECT SUM(count) as totalCount
            FROM carts
            WHERE u_id = :u_id
            GROUP BY u_id";
            $parameters = [
                'u_id' => $_SESSION['id']
            ];
            $stmt = pdo()->prepare($query);
            $stmt->execute($parameters);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            exit(json_encode($result));
            break;
    }
} catch (PDOException $e) {
    fwrite($logfile, json_encode($e));
    fclose($logfile);
    exit(json_encode(false));
}
