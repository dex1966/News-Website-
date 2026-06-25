<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$category = $_GET['category'] ?? null;
$search = $_GET['search'] ?? null;
$limit = $_GET['limit'] ?? 20;

try {
    $pdo = getDB();

    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("
                SELECT a.*, c.name as category_name, c.slug as category_slug
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.id = ?
            ");
            $stmt->execute([$id]);
            $article = $stmt->fetch();
            if (!$article) {
                http_response_code(404);
                echo json_encode(['error' => 'Không tìm thấy bài viết']);
                exit;
            }
            echo json_encode($article);

        } elseif ($category) {
            $stmt = $pdo->prepare("
                SELECT a.*, c.name as category_name
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE c.slug = ?
                ORDER BY a.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$category, (int)$limit]);
            echo json_encode($stmt->fetchAll());

        } elseif ($search) {
            $like = "%$search%";
            $stmt = $pdo->prepare("
                SELECT a.*, c.name as category_name
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.title LIKE ? OR a.summary LIKE ?
                ORDER BY a.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$like, $like, (int)$limit]);
            echo json_encode($stmt->fetchAll());

        } else {
            $stmt = $pdo->prepare("
                SELECT a.*, c.name as category_name, c.slug as category_slug
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                ORDER BY a.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([(int)$limit]);
            echo json_encode($stmt->fetchAll());
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}