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
        ],
        [
            'name' => 'ĐỖ HOÀNG HẢI',
            'email' => 'dohoanghai@gmail.com',
            'password' => 'user123@',
            'role' => 'user'
        ],
        [
            'name' => 'NGUYỄN NHẬT NAM',
            'email' => 'nguyennhatnam@gmail.com',
            'password' => 'user123@',
            'role' => 'user'
        ],
        [
            'name' => 'VŨ LÊ HOÀNG NHẤT',
            'email' => 'vulehoangnhat@gmail.com',
            'password' => 'user123@',
            'role' => 'user'
        ],
        [
            'name' => 'LÊ THỊ BÍCH TRÂM',
            'email' => 'lethibichtram@gmail.com',
            'password' => 'user123@',
            'role' => 'user'
        ],
        [
            'name' => 'PHAN THANH TÙNG',
            'email' => 'phanthanhtung@gmail.com',
            'password' => 'user123@',
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

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admins (
            id CHAR(10) PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    echo "Đã tạo bảng admins (nếu chưa có).\n";

    $adminUsers = $pdo->query("SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC")->fetchAll();
    $insertAdmin = $pdo->prepare("INSERT IGNORE INTO admins (id, user_id) VALUES (?, ?)");
    foreach ($adminUsers as $adminUser) {
        $adminId = 'ADM' . str_pad((string)$adminUser['id'], 7, '0', STR_PAD_LEFT);
        $insertAdmin->execute([$adminId, $adminUser['id']]);
        echo "Đã đảm bảo admin {$adminId} cho user_id {$adminUser['id']}.\n";
    }

    echo "Hoàn thành seeding dữ liệu tài khoản.\n";

} catch (Exception $e) {
    echo "Lỗi khi seeding: " . $e->getMessage() . "\n";
}
