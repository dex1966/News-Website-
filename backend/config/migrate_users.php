<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    // Thêm các cột mới vào bảng users nếu chưa tồn tại
    $columns = [
        'phone'    => "ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL DEFAULT NULL AFTER role",
        'address'  => "ALTER TABLE users ADD COLUMN address VARCHAR(255) NULL DEFAULT NULL AFTER phone",
        'hometown' => "ALTER TABLE users ADD COLUMN hometown VARCHAR(255) NULL DEFAULT NULL AFTER address",
        'gender'   => "ALTER TABLE users ADD COLUMN gender ENUM('male','female','other') NULL DEFAULT NULL AFTER hometown",
    ];

    foreach ($columns as $col => $sql) {
        try {
            $pdo->exec($sql);
            echo "✅ Đã thêm cột '$col'\n";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
                echo "⚠️  Cột '$col' đã tồn tại, bỏ qua.\n";
            } else {
                throw $e;
            }
        }
    }

    echo "\nHoàn thành! Cấu trúc bảng users đã được cập nhật.\n";

} catch (Exception $e) {
    echo "Lỗi: " . $e->getMessage() . "\n";
}
