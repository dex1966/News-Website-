<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    $articles = [
        [
            'title' => 'Thủ tướng chủ trì phiên họp Chính phủ thường kỳ tháng 6/2026',
            'summary' => 'Thủ tướng Chính phủ chủ trì phiên họp thường kỳ tháng 6 để đánh giá tình hình kinh tế - xã hội và bàn các giải pháp thúc đẩy tăng trưởng nửa cuối năm.',
            'content' => 'Phiên họp Chính phủ thường kỳ tháng 6/2026 tập trung vào đánh giá kết quả thực hiện các Nghị quyết của Chính phủ, bàn các giải pháp thúc đẩy tăng trưởng kinh tế và đảm bảo an sinh xã hội trong 6 tháng cuối năm.',
            'image_url' => 'https://images.unsplash.com/photo-1743485754066-f45e26489e9a?w=800&h=480&fit=crop&auto=format',
            'category_id' => 1,
            'author' => 'Admin VNExpress',
        ],
        [
            'title' => 'Giá vàng thế giới lên cao nhất trong vòng 3 tháng, vượt mốc 3.400 USD/ounce',
            'summary' => 'Giá vàng thế giới tăng mạnh trong phiên giao dịch hôm nay, vượt ngưỡng 3.400 USD/ounce lần đầu tiên trong 3 tháng qua.',
            'content' => 'Thị trường vàng thế giới ghi nhận đà tăng ấn tượng trong bối cảnh đồng USD suy yếu và lo ngại về lạm phát toàn cầu. Các nhà đầu tư đang đổ tiền vào vàng như một kênh trú ẩn an toàn.',
            'image_url' => 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=480&fit=crop&auto=format',
            'category_id' => 4,
            'author' => 'Admin VNExpress',
        ],
        [
            'title' => 'Haaland lập cú đúp, đưa Na Uy vào vòng knock-out World Cup 2026',
            'summary' => 'Tiền đạo Erling Haaland ghi 2 bàn thắng xuất thần trong 10 phút cuối trận giúp Na Uy ngược dòng đánh bại Áo 3-1.',
            'content' => 'Trong trận đấu kịch tính tại vòng bảng World Cup 2026, Haaland đã chứng minh đẳng cấp siêu sao khi ghi 2 bàn liên tiếp ở những phút cuối trận, đưa Na Uy vào vòng knock-out lần đầu tiên trong lịch sử.',
            'image_url' => 'https://images.unsplash.com/photo-1705593973313-75de7bf95b56?w=800&h=480&fit=crop&auto=format',
            'category_id' => 7,
            'author' => 'Admin VNExpress',
        ],
        [
            'title' => 'Việt Nam và Nhật Bản ký kết thỏa thuận hợp tác đầu tư 5 tỷ USD',
            'summary' => 'Trong khuôn khổ chuyến thăm cấp Nhà nước, hai nước đã ký kết nhiều thỏa thuận hợp tác quan trọng trong lĩnh vực công nghệ, năng lượng và giáo dục.',
            'content' => 'Việt Nam và Nhật Bản đã chính thức ký kết gói thỏa thuận hợp tác đầu tư trị giá 5 tỷ USD, bao gồm các dự án phát triển hạ tầng, chuyển đổi số và đào tạo nguồn nhân lực chất lượng cao.',
            'image_url' => 'https://images.unsplash.com/photo-1665224752123-a2ea29dddcb2?w=800&h=480&fit=crop&auto=format',
            'category_id' => 3,
            'author' => 'Admin VNExpress',
        ],
        [
            'title' => 'AI tạo sinh đang định hình lại tương lai ngành giáo dục toàn cầu',
            'summary' => 'Các công cụ trí tuệ nhân tạo như ChatGPT, Gemini và Claude đang thay đổi căn bản cách học sinh, sinh viên và giáo viên tiếp cận việc dạy và học.',
            'content' => 'Cuộc cách mạng AI trong giáo dục đang diễn ra với tốc độ chóng mặt. Từ các hệ thống học cá nhân hóa đến trợ lý gia sư AI, công nghệ đang mở ra cơ hội tiếp cận giáo dục chất lượng cao cho mọi người, ở mọi nơi trên thế giới.',
            'image_url' => 'https://images.unsplash.com/photo-1750365920056-d4b4ca73fbaa?w=800&h=480&fit=crop&auto=format',
            'category_id' => 5,
            'author' => 'Admin VNExpress',
        ],
        [
            'title' => 'TP HCM: Chính phủ phê duyệt đề án xây dựng 6 tòa nhà cao tầng tại khu trung tâm',
            'summary' => 'Chính phủ vừa phê duyệt chủ trương xây dựng 6 tòa nhà cao tầng thay thế các công trình xuống cấp tại khu vực trung tâm Quận 1, TP HCM.',
            'content' => 'Theo đề án được phê duyệt, 6 tòa nhà cao tầng mới sẽ được xây dựng tại vị trí các công trình cũ đã xuống cấp nghiêm trọng tại khu trung tâm Quận 1. Dự án dự kiến hoàn thành vào năm 2030 và sẽ trở thành biểu tượng kiến trúc mới của TP HCM.',
            'image_url' => 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&h=480&fit=crop&auto=format',
            'category_id' => 1,
            'author' => 'Admin VNExpress',
        ],
    ];

    $stmt = $pdo->prepare("INSERT INTO articles (title, summary, content, image_url, category_id, author, views) VALUES (?, ?, ?, ?, ?, ?, 0)");

    foreach ($articles as $a) {
        $stmt->execute([$a['title'], $a['summary'], $a['content'], $a['image_url'], $a['category_id'], $a['author']]);
        echo "Đã thêm: " . $a['title'] . "\n";
    }

    echo "\nHoàn thành! Đã thêm " . count($articles) . " bài viết.\n";

} catch (Exception $e) {
    echo "Lỗi: " . $e->getMessage() . "\n";
}
