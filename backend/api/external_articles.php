<?php
require_once '../config/cors.php';
header("Content-Type: application/json; charset=utf-8");
// backend/api/external_articles.php
// Fetch latest articles from VNExpress RSS feed and return as JSON.
header('Content-Type: application/json');
$feedUrl = 'https://vnexpress.net/rss/tin-moi.rss';
$feedContent = @file_get_contents($feedUrl);
if ($feedContent === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch VNExpress RSS feed']);
    exit;
}
$xml = simplexml_load_string($feedContent, 'SimpleXMLElement', LIBXML_NOCDATA);
if ($xml === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse RSS feed']);
    exit;
}
$items = [];
foreach ($xml->channel->item as $item) {
    $ns_media = $item->children('media', true);
    $imageUrl = '';
    if (isset($ns_media->content)) {
        $imageUrl = (string) $ns_media->content->attributes()->url;
    }
    $items[] = [
        'title' => (string) $item->title,
        'summary' => (string) $item->description,
        'link' => (string) $item->link,
        'published_at' => (string) $item->pubDate,
        'image_url' => $imageUrl,
        'source' => 'vnexpress',
        'source_url' => (string) $item->link,
    ];
}
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
$items = array_slice($items, 0, $limit);
echo json_encode($items);
?>
