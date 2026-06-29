<?php
require_once '../config/cors.php';
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// VTV24 YouTube Channel ID
$channelId = 'UCabsTV34JwALXKGMqHpvUiA';
$limit = intval($_GET['limit'] ?? 8);

$rssUrl = "https://www.youtube.com/feeds/videos.xml?channel_id={$channelId}";

try {
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 10,
            'header'  => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n",
        ]
    ]);

    $xml = @file_get_contents($rssUrl, false, $ctx);

    if (!$xml) {
        // Fallback: trả về danh sách video cố định nếu không fetch được
        $fallback = [
            ['id' => 'LW1NziEeWuQ', 'title' => 'Chủ động rà soát, truy vết người nghiện ma túy | VTV24', 'thumbnail' => 'https://img.youtube.com/vi/LW1NziEeWuQ/mqdefault.jpg'],
            ['id' => 'pmACUwMRB6E', 'title' => 'Triển lãm quy hoạch Hà Nội: Tầm nhìn 100 năm | VTV24', 'thumbnail' => 'https://img.youtube.com/vi/pmACUwMRB6E/mqdefault.jpg'],
            ['id' => 'yZWbSCQlYio', 'title' => 'Nhiều HLV từ chức sau vòng bảng World Cup 2026 | VTV24', 'thumbnail' => 'https://img.youtube.com/vi/yZWbSCQlYio/mqdefault.jpg'],
            ['id' => 'gPMTBYdYxh4', 'title' => 'HÀ LAN vs MA-RỐC: Hành trình vòng bảng World Cup 2026 | VTV24', 'thumbnail' => 'https://img.youtube.com/vi/gPMTBYdYxh4/mqdefault.jpg'],
            ['id' => 'RPRHicaVG3Y', 'title' => 'ĐỨC – PARAGUAY: Hành trình vòng bảng tại World Cup 2026 | VTV24', 'thumbnail' => 'https://img.youtube.com/vi/RPRHicaVG3Y/mqdefault.jpg'],
            ['id' => '_mwYfP3hxnE', 'title' => 'Brazil vs. Nhật Bản trước vòng loại trực tiếp World Cup 2026 | VTV24', 'thumbnail' => 'https://img.youtube.com/vi/_mwYfP3hxnE/mqdefault.jpg'],
        ];
        echo json_encode(array_slice($fallback, 0, $limit));
        exit;
    }

    // Parse XML
    $feed = simplexml_load_string($xml);
    $namespaces = $feed->getNamespaces(true);

    $videos = [];
    foreach ($feed->entry as $entry) {
        $videoId = (string) $entry->children('yt', true)->videoId;
        $title   = (string) $entry->title;
        $group   = $entry->children('media', true)->group;
        $thumbnail = $group ? (string) $group->thumbnail->attributes()['url'] : "https://img.youtube.com/vi/{$videoId}/mqdefault.jpg";
        $published = (string) $entry->published;

        $videos[] = [
            'id'        => $videoId,
            'title'     => $title,
            'thumbnail' => $thumbnail,
            'published' => $published,
            'embed_url' => "https://www.youtube.com/embed/{$videoId}",
            'watch_url' => "https://www.youtube.com/watch?v={$videoId}",
        ];

        if (count($videos) >= $limit) break;
    }

    echo json_encode($videos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
