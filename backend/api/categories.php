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

function requireAdmin(PDO $pdo, $userId): array {
    if (!$userId) {
        http_response_code(403);
        echo json_encode(['error' => 'Thiếu user_id của admin']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user || $user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Chỉ admin mới được quản lý danh mục']);
        exit;
    }

    return $user;
}

function normalizeSlug(string $value): string {
    $value = trim(strtolower($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value);
    return trim($value ?? '', '-');
}

function getCategoryPayload(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Dữ liệu gửi lên không hợp lệ']);
        exit;
    }

    $name = trim($data['name'] ?? '');
    $slug = normalizeSlug($data['slug'] ?? $name);

    if ($name === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Tên danh mục không được để trống']);
        exit;
    }

    if ($slug === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Slug danh mục không hợp lệ']);
        exit;
    }

    return [
        'name' => $name,
        'slug' => $slug,
        'user_id' => $data['user_id'] ?? null,
    ];
}

try {
    $pdo = getDB();

    if ($method === 'GET') {
        $stmt = $pdo->query("
            SELECT
                c.id,
                c.name,
                c.slug,
                c.created_at,
                COUNT(a.id) AS article_count
            FROM categories c
            LEFT JOIN articles a ON a.category_id = c.id
            GROUP BY c.id, c.name, c.slug, c.created_at
            ORDER BY c.id ASC
        ");
        echo json_encode($stmt->fetchAll());
    }

    elseif ($method === 'POST') {
        $data = getCategoryPayload();
        requireAdmin($pdo, $data['user_id']);

        $stmt = $pdo->prepare("SELECT id FROM categories WHERE slug = ?");
        $stmt->execute([$data['slug']]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Slug danh mục đã tồn tại']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO categories (name, slug, created_at) VALUES (?, ?, NOW())");
        $stmt->execute([$data['name'], $data['slug']]);

        echo json_encode([
            'id' => $pdo->lastInsertId(),
            'message' => 'Tạo danh mục thành công',
        ]);
    }

    elseif ($method === 'PUT') {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu danh mục cần cập nhật']);
            exit;
        }

        $data = getCategoryPayload();
        requireAdmin($pdo, $data['user_id']);

        $stmt = $pdo->prepare("SELECT id FROM categories WHERE slug = ? AND id <> ?");
        $stmt->execute([$data['slug'], $id]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Slug danh mục đã tồn tại']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE categories SET name = ?, slug = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['slug'], $id]);

        echo json_encode(['message' => 'Cập nhật danh mục thành công']);
    }

    elseif ($method === 'DELETE') {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu danh mục cần xóa']);
            exit;
        }

        requireAdmin($pdo, $_GET['user_id'] ?? null);

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM articles WHERE category_id = ?");
        $stmt->execute([$id]);
        $articleCount = (int)$stmt->fetchColumn();

        if ($articleCount > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Không thể xóa danh mục đang có bài viết']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Xóa danh mục thành công']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
