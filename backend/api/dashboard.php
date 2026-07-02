<?php
require_once '../config/cors.php';
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

function requireAdmin(PDO $pdo, $userId): void {
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
        echo json_encode(['error' => 'Chỉ admin mới được xem dashboard']);
        exit;
    }
}

try {
    $pdo = getDB();
    requireAdmin($pdo, $_GET['user_id'] ?? null);

    $totalArticles = (int)$pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
    $totalUsers = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $totalAdmins = (int)$pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    $totalCategories = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    $todayArticles = (int)$pdo->query("SELECT COUNT(*) FROM articles WHERE DATE(created_at) = CURDATE()")->fetchColumn();

    $latestStmt = $pdo->query("
        SELECT a.id, a.title, a.created_at, a.views, c.name AS category_name, COALESCE(u.name, a.author, 'Admin') AS author_name
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN admins ad ON a.admin_id = ad.id
        LEFT JOIN users u ON ad.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 6
    ");

    $topStmt = $pdo->query("
        SELECT a.id, a.title, a.created_at, a.views, c.name AS category_name, COALESCE(u.name, a.author, 'Admin') AS author_name
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN admins ad ON a.admin_id = ad.id
        LEFT JOIN users u ON ad.user_id = u.id
        ORDER BY a.views DESC
        LIMIT 6
    ");

    echo json_encode([
        'total_articles' => $totalArticles,
        'total_users' => $totalUsers,
        'total_admins' => $totalAdmins,
        'total_categories' => $totalCategories,
        'today_articles' => $todayArticles,
        'latest_articles' => $latestStmt->fetchAll(),
        'top_articles' => $topStmt->fetchAll(),
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
