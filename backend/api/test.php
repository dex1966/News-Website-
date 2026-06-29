<?php
require_once '../config/db.php';
try {
    $pdo = getDB();
    $stmt = $pdo->query("SELECT * FROM users");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    echo $e->getMessage();
}
