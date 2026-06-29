<?php
require_once '../config/cors.php';
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
$source = $_GET['source'] ?? null;
$limit = (int)($_GET['limit'] ?? 20);

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
                LIMIT $limit
            ");
            $stmt->execute([$category]);
            echo json_encode($stmt->fetchAll());

        } elseif ($search) {
            $like = "%$search%";
            $stmt = $pdo->prepare("
                SELECT a.*, c.name as category_name
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.title LIKE ? OR a.summary LIKE ?
                ORDER BY a.created_at DESC
                LIMIT $limit
            ");
            $stmt->execute([$like, $like]);
            echo json_encode($stmt->fetchAll());

        } else {
            $stmt = $pdo->prepare("
                SELECT a.*, c.name as category_name, c.slug as category_slug
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                ORDER BY a.created_at DESC
                LIMIT $limit
            ");
            $stmt->execute([]);
            echo json_encode($stmt->fetchAll());
        }
    }

    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("
            INSERT INTO articles (title, summary, content, image_url, category_id, author, views)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        ");
        $stmt->execute([
            $data['title'],
            $data['summary'] ?? '',
            $data['content'] ?? '',
            $data['image_url'] ?? '',
            $data['category_id'],
            $data['author'] ?? 'Admin'
        ]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Tạo bài viết thành công']);
    }

    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("
            UPDATE articles SET title=?, summary=?, content=?, image_url=?, category_id=?
            WHERE id=?
        ");
        $stmt->execute([
            $data['title'],
            $data['summary'] ?? '',
            $data['content'] ?? '',
            $data['image_url'] ?? '',
            $data['category_id'],
            $id
        ]);
        echo json_encode(['message' => 'Cập nhật thành công']);
    }

    elseif ($method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Xoá thành công']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}