<?php
require_once __DIR__ . '/db.php';

$startDate = '2026-06-11';
$endDate = '2026-07-11';
$minPerDay = 2;
$maxPerDay = 12;

function buildDailyDistribution(array $dates, int $total, int $minPerDay, int $maxPerDay): array {
    $dayCount = count($dates);
    $minTotal = $dayCount * $minPerDay;
    $maxTotal = $dayCount * $maxPerDay;

    if ($total < $minTotal || $total > $maxTotal) {
        throw new RuntimeException("Tong {$total} khong nam trong khoang co the phan bo {$minTotal}-{$maxTotal}.");
    }

    $distribution = array_fill_keys($dates, $minPerDay);
    $remaining = $total - $minTotal;

    while ($remaining > 0) {
        foreach ($dates as $date) {
            if ($remaining <= 0) {
                break;
            }

            $capacity = $maxPerDay - $distribution[$date];
            if ($capacity <= 0) {
                continue;
            }

            $add = mt_rand(0, min($capacity, $remaining));
            if ($add === 0 && $remaining > 0 && count(array_filter($distribution, fn($value) => $value < $maxPerDay)) === 1) {
                $add = min($capacity, $remaining);
            }

            $distribution[$date] += $add;
            $remaining -= $add;
        }
    }

    return $distribution;
}

try {
    $pdo = getDB();
    $articles = $pdo->query("SELECT id FROM articles ORDER BY id ASC")->fetchAll();
    $totalArticles = count($articles);

    if ($totalArticles === 0) {
        throw new RuntimeException('Khong co bai viet de cap nhat created_at.');
    }

    $dates = [];
    $current = new DateTimeImmutable($startDate);
    $end = new DateTimeImmutable($endDate);
    while ($current <= $end) {
        $dates[] = $current->format('Y-m-d');
        $current = $current->modify('+1 day');
    }

    mt_srand(20260712);
    $distribution = buildDailyDistribution($dates, $totalArticles, $minPerDay, $maxPerDay);
    $updateStmt = $pdo->prepare("UPDATE articles SET created_at = ? WHERE id = ?");
    $articleIndex = 0;

    $pdo->beginTransaction();
    foreach ($distribution as $date => $count) {
        $dateBase = new DateTimeImmutable($date);
        for ($i = 0; $i < $count; $i++) {
            if (!isset($articles[$articleIndex])) {
                break 2;
            }

            $secondOfDay = mt_rand(0, 86399);
            $createdAt = $dateBase->setTime(0, 0, 0)->modify("+{$secondOfDay} seconds")->format('Y-m-d H:i:s');
            $updateStmt->execute([$createdAt, $articles[$articleIndex]['id']]);
            $articleIndex++;
        }
    }
    $pdo->commit();

    echo "Da phan bo {$totalArticles} bai viet tu {$startDate} den {$endDate}.\n";
    foreach ($distribution as $date => $count) {
        echo "{$date}: {$count}\n";
    }
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Loi seed article dates demo: " . $e->getMessage() . "\n";
    exit(1);
}
