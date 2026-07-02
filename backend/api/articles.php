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

function articleSelectSql(string $whereSql = ''): string {
    return "
        SELECT
            a.*,
            c.name as category_name,
            c.slug as category_slug,
            ad.id as admin_id,
            u.id as author_user_id,
            COALESCE(u.name, a.author, 'Admin') as author_name
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN admins ad ON a.admin_id = ad.id
        LEFT JOIN users u ON ad.user_id = u.id
        {$whereSql}
    ";
}

function ensureAdminId(PDO $pdo, $userId): string {
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
        echo json_encode(['error' => 'Chỉ admin mới được thực hiện thao tác này']);
        exit;
    }

    $adminId = 'ADM' . str_pad((string)$user['id'], 7, '0', STR_PAD_LEFT);
    $stmt = $pdo->prepare("INSERT IGNORE INTO admins (id, user_id) VALUES (?, ?)");
    $stmt->execute([$adminId, $user['id']]);

    return $adminId;
}

try {
    $pdo = getDB();

    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare(articleSelectSql("WHERE a.id = ?"));
            $stmt->execute([$id]);
            $article = $stmt->fetch();
            if (!$article) {
                http_response_code(404);
                echo json_encode(['error' => 'Không tìm thấy bài viết']);
                exit;
            }
            echo json_encode($article);

        } elseif ($category) {
            $stmt = $pdo->prepare(articleSelectSql("WHERE c.slug = ?") . " ORDER BY a.created_at DESC LIMIT $limit");
            $stmt->execute([$category]);
            echo json_encode($stmt->fetchAll());

        } elseif ($search) {
            $like = "%$search%";
            $stmt = $pdo->prepare(articleSelectSql("WHERE a.title LIKE ? OR a.summary LIKE ?") . " ORDER BY a.created_at DESC LIMIT $limit");
            $stmt->execute([$like, $like]);
            echo json_encode($stmt->fetchAll());

        } else {
            $stmt = $pdo->prepare(articleSelectSql() . " ORDER BY a.created_at DESC LIMIT $limit");
            $stmt->execute([]);
            echo json_encode($stmt->fetchAll());
        }
    }

    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $adminId = ensureAdminId($pdo, $data['user_id'] ?? null);
        $stmt = $pdo->prepare("
            INSERT INTO articles (title, summary, content, image_url, category_id, admin_id, author, views)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        ");
        $stmt->execute([
            $data['title'],
            $data['summary'] ?? '',
            $data['content'] ?? '',
            $data['image_url'] ?? '',
            $data['category_id'],
            $adminId,
            $data['author'] ?? 'Admin'
        ]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Tạo bài viết thành công']);
    }

    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        ensureAdminId($pdo, $data['user_id'] ?? null);
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
        ensureAdminId($pdo, $_GET['user_id'] ?? null);
        $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Xoá thành công']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
