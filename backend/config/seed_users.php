<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();
    echo "Kết nối CSDL thành công.\n";

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "Đã tạo bảng users (nếu chưa có).\n";

    // Danh sách tài khoản cần seed
    $usersToSeed = [
        [
            'name' => 'Admin VNExpress',
            'email' => 'admin@gmail.com',
            'password' => 'admin123',
            'role' => 'admin'
        ],
        [
            'name' => 'Nguyễn Văn A',
            'email' => 'user@gmail.com',
            'password' => 'user123',
            'role' => 'user'
        ]
    ];

    foreach ($usersToSeed as $u) {
        // Kiểm tra xem email đã tồn tại chưa
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$u['email']]);
        if ($stmt->fetch()) {
            echo "Tài khoản {$u['email']} đã tồn tại, bỏ qua.\n";
            continue;
        }

        // Mã hóa mật khẩu và chèn vào database
        $hashedPassword = password_hash($u['password'], PASSWORD_DEFAULT);
        $insertStmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $insertStmt->execute([
            $u['name'],
            $u['email'],
            $hashedPassword,
            $u['role']
        ]);
        echo "Đã tạo tài khoản {$u['role']}: {$u['email']} | Mật khẩu: {$u['password']}\n";
    }

    echo "Hoàn thành seeding dữ liệu tài khoản.\n";

} catch (Exception $e) {
    echo "Lỗi khi seeding: " . $e->getMessage() . "\n";
}
