<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS page_visits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            page_path VARCHAR(255) NOT NULL,
            page_title VARCHAR(255) NULL,
            article_id INT NULL,
            user_id INT NULL,
            visitor_id VARCHAR(100) NULL,
            ip_address VARCHAR(45) NULL,
            user_agent TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_created_at (created_at),
            INDEX idx_page_path (page_path),
            INDEX idx_article_id (article_id),
            INDEX idx_visitor_id (visitor_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    echo "Da tao bang page_visits neu chua ton tai.\n";
} catch (Exception $e) {
    echo "Loi migration page_visits: " . $e->getMessage() . "\n";
}
