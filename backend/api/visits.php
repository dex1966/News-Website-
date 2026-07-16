<?php
require_once '../config/cors.php';
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

function clientIp(): ?string {
    $keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($keys as $key) {
        if (!empty($_SERVER[$key])) {
            $value = explode(',', $_SERVER[$key])[0];
            return trim($value);
        }
    }

    return null;
}

try {
    $pdo = getDB();
    $data = json_decode(file_get_contents('php://input'), true) ?: [];

    $pagePath = trim((string)($data['page_path'] ?? ''));
    if ($pagePath === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Thieu page_path']);
        exit;
    }

    $pageTitle = isset($data['page_title']) ? trim((string)$data['page_title']) : null;
    $articleId = isset($data['article_id']) && is_numeric($data['article_id']) ? (int)$data['article_id'] : null;
    $userId = isset($data['user_id']) && is_numeric($data['user_id']) ? (int)$data['user_id'] : null;
    $visitorId = isset($data['visitor_id']) ? trim((string)$data['visitor_id']) : null;
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

    $stmt = $pdo->prepare("
        INSERT INTO page_visits (page_path, page_title, article_id, user_id, visitor_id, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        substr($pagePath, 0, 255),
        $pageTitle !== null ? substr($pageTitle, 0, 255) : null,
        $articleId,
        $userId,
        $visitorId !== null ? substr($visitorId, 0, 100) : null,
        clientIp(),
        $userAgent,
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
