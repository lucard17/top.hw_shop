<?php
include_once('dbconnect.php');


$stmt = pdo()->query('SELECT CONCAT("{ ""id"": ", s.id, ", ", """name"": """,s.name,""", ", """categories"": " , CONCAT("[ ",GROUP_CONCAT(CONCAT("{ ""id"": ", c.id, ", ", """name"": """,c.name,""" }") SEPARATOR ", ")," ]")," }")
 FROM sectors as s , categories as c 
 WHERE s.id=c.p_id 
 GROUP BY s.id
 ORDER BY s.id');
$result = $stmt->fetchAll(PDO::FETCH_NUM);
$resultLength = count($result) - 1;
$json = "[";
foreach ($result as $index => $row) {
    $json .=  $row[0] . ($index < $resultLength ? ", " : "");
}
$json .= "]";
echo $json;
die;
