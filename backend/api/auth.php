<?php
require_once '../config/cors.php';
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = getDB();

    if ($action === 'register') {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email đã được sử dụng']);
            exit;
        }
        $hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$data['name'], $data['email'], $hash]);
        echo json_encode(['message' => 'Đăng ký thành công']);

    } elseif ($action === 'login') {
        $stmt = $pdo->prepare("SELECT id, name, email, role, phone, address, hometown, gender FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        // Verify password separately
        $stmtPwd = $pdo->prepare("SELECT password FROM users WHERE email = ?");
        $stmtPwd->execute([$data['email']]);
        $row = $stmtPwd->fetch();

        if (!$user || !$row || !password_verify($data['password'], $row['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Email hoặc mật khẩu không đúng']);
            exit;
        }
        echo json_encode(['message' => 'Đăng nhập thành công', 'user' => $user]);

    } elseif ($action === 'update_profile') {
        $id       = $data['id']       ?? null;
        $name     = $data['name']     ?? null;
        $password = $data['password'] ?? null;
        $phone    = $data['phone']    ?? null;
        $address  = $data['address']  ?? null;
        $hometown = $data['hometown'] ?? null;
        $gender   = $data['gender']   ?? null;

        if (!$id || !$name) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu thông tin']);
            exit;
        }

        // Validate gender value
        if ($gender && !in_array($gender, ['male', 'female', 'other'])) {
            $gender = null;
        }

        if ($password) {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET name=?, password=?, phone=?, address=?, hometown=?, gender=? WHERE id=?");
            $stmt->execute([$name, $hash, $phone, $address, $hometown, $gender, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE users SET name=?, phone=?, address=?, hometown=?, gender=? WHERE id=?");
            $stmt->execute([$name, $phone, $address, $hometown, $gender, $id]);
        }
        
        $stmt = $pdo->prepare("SELECT id, name, email, role, phone, address, hometown, gender FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        echo json_encode(['message' => 'Cập nhật thành công', 'user' => $user]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}