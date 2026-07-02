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
        echo json_encode(['error' => 'Chỉ admin mới được quản lý người dùng']);
        exit;
    }

    return $user;
}

function adminIdFromUserId($userId): string {
    return 'ADM' . str_pad((string)$userId, 7, '0', STR_PAD_LEFT);
}

function countAdmins(PDO $pdo): int {
    return (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
}

try {
    $pdo = getDB();

    if ($method === 'GET') {
        requireAdmin($pdo, $_GET['user_id'] ?? null);

        $stmt = $pdo->query("
            SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                u.phone,
                u.address,
                u.hometown,
                u.gender,
                u.created_at,
                ad.id AS admin_id,
                COUNT(a.id) AS article_count
            FROM users u
            LEFT JOIN admins ad ON ad.user_id = u.id
            LEFT JOIN articles a ON a.admin_id = ad.id
            GROUP BY u.id, ad.id
            ORDER BY u.created_at DESC, u.id DESC
        ");
        echo json_encode($stmt->fetchAll());
    }

    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $requester = requireAdmin($pdo, $data['user_id'] ?? null);
        $targetId = $id;
        $role = $data['role'] ?? null;

        if (!$targetId || !in_array($role, ['admin', 'user'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu user hoặc role không hợp lệ']);
            exit;
        }

        if ((int)$targetId === (int)$requester['id'] && $role !== 'admin') {
            http_response_code(400);
            echo json_encode(['error' => 'Không thể tự hạ quyền admin của chính mình']);
            exit;
        }

        if ($role === 'user') {
            $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
            $stmt->execute([$targetId]);
            $target = $stmt->fetch();
            if (!$target) {
                http_response_code(404);
                echo json_encode(['error' => 'Không tìm thấy user']);
                exit;
            }
            if ($target['role'] === 'admin' && countAdmins($pdo) <= 1) {
                http_response_code(400);
                echo json_encode(['error' => 'Phải giữ lại ít nhất một admin']);
                exit;
            }
        }

        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$role, $targetId]);

        if ($role === 'admin') {
            $adminId = adminIdFromUserId($targetId);
            $stmt = $pdo->prepare("INSERT IGNORE INTO admins (id, user_id) VALUES (?, ?)");
            $stmt->execute([$adminId, $targetId]);
        } else {
            $stmt = $pdo->prepare("DELETE FROM admins WHERE user_id = ?");
            $stmt->execute([$targetId]);
        }

        echo json_encode(['message' => 'Cập nhật phân quyền thành công']);
    }

    elseif ($method === 'DELETE') {
        $requester = requireAdmin($pdo, $_GET['user_id'] ?? null);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu user cần xóa']);
            exit;
        }

        if ((int)$id === (int)$requester['id']) {
            http_response_code(400);
            echo json_encode(['error' => 'Không thể tự xóa tài khoản đang đăng nhập']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $target = $stmt->fetch();
        if (!$target) {
            http_response_code(404);
            echo json_encode(['error' => 'Không tìm thấy user']);
            exit;
        }

        if ($target['role'] === 'admin' && countAdmins($pdo) <= 1) {
            http_response_code(400);
            echo json_encode(['error' => 'Phải giữ lại ít nhất một admin']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Xóa người dùng thành công']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
