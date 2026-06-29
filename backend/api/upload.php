<?php
require_once '../config/cors.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$uploadDir = __DIR__ . '/../uploads/';

// Tạo thư mục nếu chưa có
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "Không có file hoặc upload lỗi"]);
    exit();
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["error" => "Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF"]);
    exit();
}

// Giới hạn 5MB
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["error" => "File quá lớn, tối đa 5MB"]);
    exit();
}

// Tạo tên file unique
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_') . '.' . $ext;
$dest = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500);
    echo json_encode(["error" => "Lưu file thất bại"]);
    exit();
}

// Trả về URL để frontend dùng
$url = "http://localhost/news-backend/uploads/" . $filename;
echo json_encode(["url" => $url, "filename" => $filename]);