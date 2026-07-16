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

function validDateOrToday($date): string {
    if (is_string($date) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        return $date;
    }

    return date('Y-m-d');
}

try {
    $pdo = getDB();
    requireAdmin($pdo, $_GET['user_id'] ?? null);
    $dateFrom = validDateOrToday($_GET['date_from'] ?? null);
    $dateTo = validDateOrToday($_GET['date_to'] ?? null);

    if ($dateFrom > $dateTo) {
        [$dateFrom, $dateTo] = [$dateTo, $dateFrom];
    }

    $totalArticles = (int)$pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn();
    $totalUsers = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $totalAdmins = (int)$pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    $totalCategories = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    $todayArticles = (int)$pdo->query("SELECT COUNT(*) FROM articles WHERE DATE(created_at) = CURDATE()")->fetchColumn();
    $totalViews = (int)$pdo->query("SELECT COALESCE(SUM(views), 0) FROM articles")->fetchColumn();
    $totalVisits = (int)$pdo->query("SELECT COUNT(*) FROM page_visits")->fetchColumn();
    $todayVisits = (int)$pdo->query("SELECT COUNT(*) FROM page_visits WHERE DATE(created_at) = CURDATE()")->fetchColumn();

    $latestStmt = $pdo->query("
        SELECT a.id, a.title, a.created_at, a.views, c.name AS category_name, COALESCE(u.name, a.author, 'Admin') AS author_name
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN admins ad ON a.admin_id = ad.id
        LEFT JOIN users u ON ad.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 6
    ");

    $topStmt = $pdo->prepare("
        SELECT
            a.id,
            a.title,
            a.created_at,
            COUNT(pv.id) AS views,
            c.name AS category_name,
            COALESCE(u.name, a.author, 'Admin') AS author_name
        FROM articles a
        INNER JOIN page_visits pv ON pv.article_id = a.id AND DATE(pv.created_at) BETWEEN ? AND ?
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN admins ad ON a.admin_id = ad.id
        LEFT JOIN users u ON ad.user_id = u.id
        GROUP BY a.id, a.title, a.created_at, c.name, u.name, a.author
        ORDER BY views DESC
        LIMIT 10
    ");
    $topStmt->execute([$dateFrom, $dateTo]);

    $allTimeTopStmt = $pdo->query("
        SELECT
            a.id,
            a.title,
            a.created_at,
            COUNT(pv.id) AS views,
            c.name AS category_name,
            COALESCE(u.name, a.author, 'Admin') AS author_name
        FROM articles a
        INNER JOIN page_visits pv ON pv.article_id = a.id
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN admins ad ON a.admin_id = ad.id
        LEFT JOIN users u ON ad.user_id = u.id
        GROUP BY a.id, a.title, a.created_at, c.name, u.name, a.author
        ORDER BY views DESC
        LIMIT 10
    ");

    $articlesByDayStmt = $pdo->prepare("
        SELECT
            DATE(created_at) AS date,
            DATE_FORMAT(created_at, '%d/%m') AS label,
            COUNT(*) AS total
        FROM articles
        WHERE DATE(created_at) BETWEEN ? AND ?
        GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%d/%m')
        ORDER BY DATE(created_at) ASC
    ");
    $articlesByDayStmt->execute([$dateFrom, $dateTo]);

    $visitsByDayStmt = $pdo->prepare("
        SELECT
            DATE(created_at) AS date,
            DATE_FORMAT(created_at, '%d/%m') AS label,
            COUNT(*) AS total
        FROM page_visits
        WHERE DATE(created_at) BETWEEN ? AND ?
        GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%d/%m')
        ORDER BY DATE(created_at) ASC
    ");
    $visitsByDayStmt->execute([$dateFrom, $dateTo]);

    echo json_encode([
        'total_articles' => $totalArticles,
        'total_users' => $totalUsers,
        'total_admins' => $totalAdmins,
        'total_categories' => $totalCategories,
        'today_articles' => $todayArticles,
        'total_views' => $totalViews,
        'total_visits' => $totalVisits,
        'today_visits' => $todayVisits,
        'date_from' => $dateFrom,
        'date_to' => $dateTo,
        'latest_articles' => $latestStmt->fetchAll(),
        'top_articles' => $topStmt->fetchAll(),
        'all_time_top_articles' => $allTimeTopStmt->fetchAll(),
        'articles_by_day' => $articlesByDayStmt->fetchAll(),
        'visits_by_day' => $visitsByDayStmt->fetchAll(),
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
