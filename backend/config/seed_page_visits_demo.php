<?php
require_once __DIR__ . '/db.php';

$startDate = '2026-06-11';
$endDate = '2026-07-11';
$visitorPrefix = 'demo-traffic-20260611-20260711';

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

    $articles = $pdo->query("SELECT id, title FROM articles ORDER BY id ASC")->fetchAll();
    if (!$articles) {
        throw new RuntimeException('Chua co bai viet de gan article_id cho du lieu truy cap demo.');
    }
    $topArticles = array_slice($articles, 0, min(10, count($articles)));
    $topArticleIds = array_column($topArticles, 'id');
    $nonTopArticles = array_values(array_filter($articles, function ($article) use ($topArticleIds) {
        return !in_array($article['id'], $topArticleIds, true);
    }));
    if (!$nonTopArticles) {
        $nonTopArticles = $articles;
    }

    $deleteStmt = $pdo->prepare("
        DELETE FROM page_visits
        WHERE visitor_id LIKE ?
          AND DATE(created_at) BETWEEN ? AND ?
    ");
    $deleteStmt->execute([$visitorPrefix . '%', $startDate, $endDate]);

    $insertStmt = $pdo->prepare("
        INSERT INTO page_visits (page_path, page_title, article_id, user_id, visitor_id, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, NULL, ?, ?, ?, ?)
    ");

    mt_srand(20260711);
    $current = new DateTimeImmutable($startDate);
    $end = new DateTimeImmutable($endDate);
    $dailyTotals = [];
    $dateList = [];
    while ($current <= $end) {
        $date = $current->format('Y-m-d');
        $dailyTotals[$date] = mt_rand(1000, 10000);
        $dateList[] = $date;
        $current = $current->modify('+1 day');
    }

    $topTargets = [9800, 9100, 8400, 7700, 7000, 6300, 5600, 4900, 4200, 3500];
    $topPlans = [];
    foreach ($topArticles as $index => $article) {
        $target = $topTargets[$index] ?? mt_rand(1000, 3500);
        $base = intdiv($target, count($dateList));
        $remainder = $target % count($dateList);

        foreach ($dateList as $dayIndex => $date) {
            $topPlans[$date][] = [
                'article' => $article,
                'count' => $base + ($dayIndex < $remainder ? 1 : 0),
            ];
        }
    }
    foreach ($dateList as $date) {
        $topCountForDate = array_sum(array_map(function ($plan) {
            return $plan['count'];
        }, $topPlans[$date] ?? []));
        $dailyTotals[$date] = min(10000, max($dailyTotals[$date], $topCountForDate));
    }

    $totalInserted = 0;
    $topInserted = [];

    $pdo->beginTransaction();
    $current = new DateTimeImmutable($startDate);
    while ($current <= $end) {
        $date = $current->format('Y-m-d');
        $dailyTotal = $dailyTotals[$date];
        $insertedToday = 0;

        foreach ($topPlans[$date] ?? [] as $plan) {
            for ($i = 0; $i < $plan['count']; $i++) {
                $article = $plan['article'];
                $secondOfDay = mt_rand(0, 86399);
                $createdAt = $current->setTime(0, 0, 0)->modify("+{$secondOfDay} seconds")->format('Y-m-d H:i:s');
                $visitorId = $visitorPrefix . '-' . $date . '-top-' . $article['id'] . '-' . str_pad((string)$i, 4, '0', STR_PAD_LEFT);
                $ip = '10.' . mt_rand(0, 255) . '.' . mt_rand(0, 255) . '.' . mt_rand(1, 254);

                $insertStmt->execute([
                    '/article/' . $article['id'],
                    $article['title'],
                    (int)$article['id'],
                    $visitorId,
                    $ip,
                    'DemoTrafficSeeder/1.0',
                    $createdAt,
                ]);
                $totalInserted++;
                $insertedToday++;
                $topInserted[$article['id']] = ($topInserted[$article['id']] ?? 0) + 1;
            }
        }

        $remaining = max(0, $dailyTotal - $insertedToday);
        for ($i = 0; $i < $remaining; $i++) {
            $article = $nonTopArticles[mt_rand(0, count($nonTopArticles) - 1)];
            $secondOfDay = mt_rand(0, 86399);
            $createdAt = $current->setTime(0, 0, 0)->modify("+{$secondOfDay} seconds")->format('Y-m-d H:i:s');
            $visitorId = $visitorPrefix . '-' . $date . '-rest-' . str_pad((string)$i, 5, '0', STR_PAD_LEFT);
            $ip = '10.' . mt_rand(0, 255) . '.' . mt_rand(0, 255) . '.' . mt_rand(1, 254);

            $insertStmt->execute([
                '/article/' . $article['id'],
                $article['title'],
                (int)$article['id'],
                $visitorId,
                $ip,
                'DemoTrafficSeeder/1.0',
                $createdAt,
            ]);
            $totalInserted++;
        }

        $current = $current->modify('+1 day');
    }
    $pdo->commit();

    echo "Da seed {$totalInserted} luot truy cap demo tu {$startDate} den {$endDate}.\n";
    foreach ($dailyTotals as $date => $total) {
        echo "{$date}: {$total}\n";
    }
    echo "Top 10 demo totals:\n";
    foreach ($topArticles as $article) {
        $count = $topInserted[$article['id']] ?? 0;
        echo "article_id={$article['id']}: {$count}\n";
    }
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Loi seed page_visits demo: " . $e->getMessage() . "\n";
    exit(1);
}
