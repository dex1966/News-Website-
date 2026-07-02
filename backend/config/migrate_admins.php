<?php
require_once __DIR__ . '/db.php';

function ensureColumn(PDO $pdo, string $table, string $column, string $alterSql): void {
    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND COLUMN_NAME = ?
    ");
    $stmt->execute([$table, $column]);

    if ((int)$stmt->fetchColumn() === 0) {
        $pdo->exec($alterSql);
        echo "Đã thêm cột {$table}.{$column}\n";
    } else {
        echo "Cột {$table}.{$column} đã tồn tại, bỏ qua.\n";
    }
}

function ensureForeignKey(PDO $pdo, string $constraintName, string $alterSql): void {
    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
          AND CONSTRAINT_NAME = ?
    ");
    $stmt->execute([$constraintName]);

    if ((int)$stmt->fetchColumn() === 0) {
        $pdo->exec($alterSql);
        echo "Đã thêm khóa ngoại {$constraintName}\n";
    } else {
        echo "Khóa ngoại {$constraintName} đã tồn tại, bỏ qua.\n";
    }
}

try {
    $pdo = getDB();
    echo "Kết nối CSDL thành công.\n";

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

    ensureColumn(
        $pdo,
        'articles',
        'admin_id',
        "ALTER TABLE articles ADD COLUMN admin_id CHAR(10) NULL AFTER category_id"
    );

    $firstAdmin = $pdo->query("SELECT id FROM admins ORDER BY id ASC LIMIT 1")->fetchColumn();
    if ($firstAdmin) {
        $stmt = $pdo->prepare("UPDATE articles SET admin_id = ? WHERE admin_id IS NULL");
        $stmt->execute([$firstAdmin]);
        echo "Đã gán admin mặc định {$firstAdmin} cho bài viết cũ chưa có admin_id.\n";
    } else {
        echo "Chưa có admin nào trong bảng admins, bỏ qua bước gán bài viết cũ.\n";
    }

    ensureForeignKey(
        $pdo,
        'fk_articles_admin',
        "ALTER TABLE articles ADD CONSTRAINT fk_articles_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL"
    );

    echo "Hoàn thành migration admins/articles.admin_id.\n";
} catch (Exception $e) {
    echo "Lỗi migration admins: " . $e->getMessage() . "\n";
}
