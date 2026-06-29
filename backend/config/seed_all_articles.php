<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    // Clear old articles
    $pdo->exec("DELETE FROM articles");
    
    // Reset auto increment (MySQL)
    try {
        $pdo->exec("ALTER TABLE articles AUTO_INCREMENT = 1");
    } catch (Exception $e) {}

    // Hàm tạo nội dung chi tiết
    function generateContent($title, $topic) {
        return "
            <p><strong>(VNExpress) - $title.</strong> Đây là một sự kiện thu hút sự quan tâm lớn từ dư luận trong và ngoài nước thời gian gần đây.</p>
            <p>Theo các chuyên gia nhận định, vấn đề <strong>$topic</strong> đang đóng vai trò then chốt trong định hướng phát triển của xã hội. Trong những năm qua, chúng ta đã chứng kiến nhiều thay đổi lớn lao, tác động trực tiếp tới đời sống và nền kinh tế.</p>
            <p>Đại diện cơ quan chức năng cho biết: <em>\"Chúng tôi đang nỗ lực hết mình để triển khai các giải pháp đồng bộ, nhằm mang lại hiệu quả cao nhất và giải quyết triệt để những vướng mắc còn tồn đọng.\"</em></p>
            <p>Bên cạnh những kết quả đạt được, vẫn còn không ít thách thức phía trước. Cần có sự chung tay của cả cộng đồng, sự phối hợp nhịp nhàng giữa các ban ngành, đoàn thể. Dự kiến trong quý tới, hàng loạt chính sách mới sẽ được ban hành để hỗ trợ tốt hơn cho người dân và doanh nghiệp.</p>
            <p>Đây chắc chắn sẽ là một bước ngoặt quan trọng, hứa hẹn mở ra nhiều cơ hội phát triển mới trong tương lai. Xin mời quý độc giả tiếp tục theo dõi các bản tin tiếp theo để cập nhật diễn biến mới nhất.</p>
        ";
    }

    $articles = [
        // 1. Thời sự
        ['Thời sự: Quốc hội họp phiên toàn thể', 'Quốc hội thảo luận về các vấn đề kinh tế xã hội và thông qua nhiều nghị quyết quan trọng.', 'kinh tế xã hội', 'https://images.unsplash.com/photo-1541872526845-8c760a0f4460?w=800', 1],
        ['Thời sự: Phát triển hạ tầng giao thông', 'Chính phủ ưu tiên nguồn lực để hoàn thành các tuyến cao tốc trọng điểm.', 'hạ tầng giao thông', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800', 1],
        ['Thời sự: Cải cách hành chính', 'Đẩy mạnh chuyển đổi số trong các cơ quan nhà nước để phục vụ người dân tốt hơn.', 'cải cách hành chính', 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800', 1],
        ['Thời sự: Phòng chống thiên tai', 'Các tỉnh miền Trung chủ động ứng phó với mùa mưa bão đang tới gần.', 'phòng chống thiên tai', 'https://images.unsplash.com/photo-1543884814-1e0310237fa3?w=800', 1],
        ['Thời sự: Chăm lo đời sống người lao động', 'Nhiều chính sách mới hỗ trợ công nhân tại các khu công nghiệp.', 'chăm lo đời sống', 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=800', 1],

        // 2. Thế giới
        ['Thế giới: Bầu cử tổng thống tại Mỹ', 'Cập nhật tình hình các ứng cử viên trước thềm cuộc bầu cử quan trọng.', 'bầu cử Mỹ', 'https://images.unsplash.com/photo-1520626027581-2292f327bd7d?w=800', 2],
        ['Thế giới: Căng thẳng tại Trung Đông', 'Các nhà lãnh đạo thế giới kêu gọi giải pháp hòa bình cho khu vực.', 'hòa bình Trung Đông', 'https://images.unsplash.com/photo-1517436073-3b3b18562c86?w=800', 2],
        ['Thế giới: Khủng hoảng năng lượng toàn cầu', 'Châu Âu đẩy mạnh tìm kiếm các nguồn năng lượng thay thế.', 'năng lượng toàn cầu', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', 2],
        ['Thế giới: Thượng đỉnh G20', 'Biến đổi khí hậu và phục hồi kinh tế là trọng tâm của hội nghị.', 'thượng đỉnh G20', 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800', 2],
        ['Thế giới: Tiến bộ trong khám phá vũ trụ', 'Tàu thám hiểm mới gửi về những hình ảnh sắc nét từ sao Hỏa.', 'khám phá vũ trụ', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800', 2],

        // 3. Kinh doanh
        ['Kinh doanh: VN-Index vượt mốc 1300 điểm', 'Thị trường chứng khoán ghi nhận phiên giao dịch bùng nổ.', 'thị trường chứng khoán', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800', 3],
        ['Kinh doanh: Xuất khẩu gạo tăng mạnh', 'Giá gạo xuất khẩu của Việt Nam đạt mức cao kỷ lục.', 'xuất khẩu gạo', 'https://images.unsplash.com/photo-1520119859265-534a66a166e5?w=800', 3],
        ['Kinh doanh: Bất động sản vùng ven ấm lên', 'Nhiều nhà đầu tư chuyển hướng sang các khu vực lân cận thành phố lớn.', 'thị trường bất động sản', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 3],
        ['Kinh doanh: Lãi suất ngân hàng giảm', 'Động thái mới nhằm hỗ trợ doanh nghiệp phục hồi sản xuất.', 'lãi suất ngân hàng', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', 3],
        ['Kinh doanh: Start-up Việt thu hút vốn đầu tư', 'Công nghệ trí tuệ nhân tạo là điểm sáng trong thu hút vốn ngoại.', 'khởi nghiệp công nghệ', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', 3],

        // 4. Khoa học - Công nghệ
        ['Công nghệ: AI thay đổi ngành y tế', 'Ứng dụng AI giúp chẩn đoán bệnh chính xác và nhanh chóng hơn.', 'trí tuệ nhân tạo', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', 4],
        ['Công nghệ: Mạng 6G sẽ như thế nào?', 'Các nhà khoa học bắt đầu thử nghiệm các tiêu chuẩn cho thế hệ mạng tương lai.', 'công nghệ viễn thông', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 4],
        ['Khoa học: Phát hiện loài động vật mới', 'Các nhà sinh vật học vừa công bố một loài ếch quý hiếm tại rừng nhiệt đới.', 'khám phá sinh học', 'https://images.unsplash.com/photo-1520698188151-5d97f26c07a3?w=800', 4],
        ['Công nghệ: Điện thoại gập ngày càng phổ biến', 'Các hãng đua nhau ra mắt những mẫu smartphone gập đột phá.', 'thiết bị di động', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', 4],
        ['Khoa học: Nghiên cứu vật liệu mới siêu nhẹ', 'Vật liệu này hứa hẹn sẽ ứng dụng trong ngành hàng không vũ trụ.', 'vật liệu mới', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', 4],

        // 5. Giải trí
        ['Giải trí: Bộ phim bom tấn lập kỷ lục phòng vé', 'Chỉ sau 3 ngày ra mắt, phim đã thu về hàng trăm tỷ đồng.', 'điện ảnh', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', 5],
        ['Giải trí: Đêm nhạc thu hút vạn khán giả', 'Ca sĩ nổi tiếng mang đến một màn trình diễn bùng nổ đầy cảm xúc.', 'âm nhạc', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 5],
        ['Giải trí: Xu hướng thời trang mới', 'Mùa hè này, màu sắc sặc sỡ và phong cách vintage lên ngôi.', 'thời trang', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 5],
        ['Giải trí: Lễ trao giải điện ảnh uy tín', 'Nhiều bất ngờ xảy ra khi những tên tuổi mới giành giải cao nhất.', 'sự kiện giải trí', 'https://images.unsplash.com/photo-1516280440502-8610eb675037?w=800', 5],
        ['Giải trí: Ra mắt tựa game đình đám', 'Cộng đồng game thủ háo hức trải nghiệm thế giới ảo chân thực chưa từng có.', 'thể thao điện tử', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800', 5],

        // 6. Thể thao
        ['Thể thao: Việt Nam giành vé dự Asian Cup', 'Chiến thắng thuyết phục giúp đội tuyển tiến sâu vào vòng chung kết.', 'bóng đá nước nhà', 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800', 6],
        ['Thể thao: Kỷ lục thế giới mới môn bơi lội', 'Vận động viên trẻ tuổi phá vỡ kỷ lục tồn tại suốt 10 năm qua.', 'thể thao đỉnh cao', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', 6],
        ['Thể thao: Giải đua xe F1 kịch tính', 'Cuộc đua phân định thắng thua chỉ trong những giây cuối cùng.', 'đua xe F1', 'https://images.unsplash.com/photo-1502014822147-1aedfb0676e0?w=800', 6],
        ['Thể thao: Chuyển nhượng bóng đá châu Âu', 'Bản hợp đồng trăm triệu Euro gây chấn động thị trường.', 'chuyển nhượng cầu thủ', 'https://images.unsplash.com/photo-1551280336-6218c575005f?w=800', 6],
        ['Thể thao: Khai mạc giải tennis Grand Slam', 'Các tay vợt hàng đầu thế giới đã sẵn sàng chinh phục đỉnh cao.', 'giải đấu quần vợt', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800', 6],

        // 7. Pháp luật
        ['Pháp luật: Triệt phá đường dây lừa đảo', 'Cơ quan chức năng đã bắt giữ nhiều đối tượng lừa đảo qua mạng quy mô lớn.', 'an ninh mạng', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800', 7],
        ['Pháp luật: Sửa đổi luật đất đai', 'Những điểm mới nổi bật nhằm tháo gỡ khó khăn trong quản lý đất đai.', 'chính sách đất đai', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800', 7],
        ['Pháp luật: Xét xử vụ án tham nhũng', 'Bản án nghiêm khắc được tuyên cho những cá nhân vi phạm pháp luật.', 'pháp lý', 'https://images.unsplash.com/photo-1505664154420-7214da8fb5df?w=800', 7],
        ['Pháp luật: Phổ biến kiến thức pháp luật', 'Hàng loạt chiến dịch nâng cao nhận thức pháp luật cho người dân.', 'tuyên truyền pháp luật', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800', 7],
        ['Pháp luật: Bảo vệ quyền sở hữu trí tuệ', 'Tăng cường xử lý các hành vi vi phạm bản quyền trên môi trường số.', 'sở hữu trí tuệ', 'https://images.unsplash.com/photo-1616231908472-fdb159846b09?w=800', 7],

        // 8. Giáo dục
        ['Giáo dục: Cải cách chương trình học phổ thông', 'Tập trung phát triển kỹ năng thực hành và tư duy sáng tạo cho học sinh.', 'giáo dục phổ thông', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 8],
        ['Giáo dục: Đổi mới kỳ thi đại học', 'Những quy định mới giúp giảm bớt áp lực thi cử cho thí sinh.', 'kỳ thi đại học', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', 8],
        ['Giáo dục: Đẩy mạnh học trực tuyến', 'Các trường đại học đầu tư mạnh mẽ vào nền tảng học tập từ xa.', 'đào tạo trực tuyến', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', 8],
        ['Giáo dục: Học bổng dành cho nhân tài', 'Hàng trăm suất học bổng toàn phần đã được trao cho những sinh viên xuất sắc.', 'bồi dưỡng nhân tài', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 8],
        ['Giáo dục: Dạy ngoại ngữ từ sớm', 'Lợi ích của việc cho trẻ em tiếp xúc với ngoại ngữ ngay từ lứa tuổi mầm non.', 'giáo dục mầm non', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800', 8],

        // 9. Sức khỏe
        ['Sức khỏe: Lợi ích của việc tập thể dục', 'Duy trì thói quen vận động mỗi ngày giúp tăng cường tuổi thọ.', 'rèn luyện thể chất', 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=800', 9],
        ['Sức khỏe: Cảnh báo dịch bệnh mới', 'Bộ Y tế khuyến cáo người dân tuân thủ nghiêm ngặt các biện pháp phòng bệnh.', 'phòng chống dịch bệnh', 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800', 9],
        ['Sức khỏe: Dinh dưỡng cho mùa hè', 'Những loại thực phẩm thanh nhiệt, giải độc cơ thể trong những ngày nắng nóng.', 'dinh dưỡng khỏe mạnh', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', 9],
        ['Sức khỏe: Chăm sóc sức khỏe tâm thần', 'Áp lực cuộc sống hiện đại và tầm quan trọng của việc giữ gìn sự bình yên nội tâm.', 'sức khỏe tâm thần', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', 9],
        ['Sức khỏe: Công nghệ y học tiến tiến', 'Cấy ghép tế bào gốc mở ra hy vọng chữa trị những căn bệnh nan y.', 'y học hiện đại', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800', 9],

        // 10. Đời sống
        ['Đời sống: Mẹo vặt dọn dẹp nhà cửa', 'Biến công việc dọn dẹp trở nên nhẹ nhàng với những thủ thuật đơn giản.', 'kỹ năng sống', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', 10],
        ['Đời sống: Sống xanh bảo vệ môi trường', 'Lan tỏa lối sống hạn chế rác thải nhựa trong cộng đồng.', 'bảo vệ môi trường', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', 10],
        ['Đời sống: Nuôi dạy con cái hiện đại', 'Cân bằng giữa tình thương và sự nghiêm khắc để trẻ phát triển toàn diện.', 'giáo dục gia đình', 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800', 10],
        ['Đời sống: Thú cưng trong nhà', 'Chó mèo không chỉ là vật nuôi mà còn là những người bạn tinh thần tuyệt vời.', 'chăm sóc thú cưng', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800', 10],
        ['Đời sống: Tiết kiệm chi tiêu', 'Quản lý tài chính cá nhân hiệu quả trong thời buổi bão giá.', 'quản lý tài chính', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', 10],

        // 11. Du lịch
        ['Du lịch: Khám phá Tây Bắc mùa lúa chín', 'Cảnh sắc mê hồn của những thửa ruộng bậc thang vào thu.', 'du lịch khám phá', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800', 11],
        ['Du lịch: Biển đảo vẫy gọi', 'Cẩm nang cho chuyến du lịch đảo Phú Quốc tiết kiệm mà vẫn trọn vẹn.', 'du lịch biển', 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800', 11],
        ['Du lịch: Văn hóa ẩm thực đường phố', 'Trải nghiệm những món ăn bình dị nhưng đậm đà hương vị truyền thống.', 'ẩm thực đường phố', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 11],
        ['Du lịch: Phục hồi ngành du lịch', 'Hàng loạt chương trình kích cầu được tung ra nhằm thu hút du khách quốc tế.', 'phục hồi du lịch', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800', 11],
        ['Du lịch: Trekking - Thử thách bản thân', 'Xu hướng du lịch kết hợp rèn luyện sức khỏe đang nở rộ trong giới trẻ.', 'du lịch mạo hiểm', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 11],

        // 12. Góc nhìn
        ['Góc nhìn: Người trẻ và mạng xã hội', 'Tác động hai mặt của thế giới ảo đối với thế hệ gen Z.', 'tác động mạng xã hội', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', 12],
        ['Góc nhìn: Vấn đề kẹt xe tại đô thị', 'Tìm kiếm giải pháp căn cơ cho bài toán nan giải của các siêu đô thị.', 'vấn đề đô thị', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800', 12],
        ['Góc nhìn: Hạnh phúc là gì?', 'Triết lý sống đơn giản giữa nhịp sống hối hả hiện nay.', 'triết lý sống', 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800', 12],
        ['Góc nhìn: AI và nỗi lo mất việc', 'Con người cần làm gì để không bị máy móc thay thế trong tương lai?', 'tương lai nghề nghiệp', 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800', 12],
        ['Góc nhìn: Văn hóa đọc đang mai một?', 'Trách nhiệm của xã hội trong việc khôi phục và phát triển thói quen đọc sách.', 'văn hóa đọc', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 12]
    ];

    $stmt = $pdo->prepare("INSERT INTO articles (title, summary, content, image_url, category_id, author, views) VALUES (?, ?, ?, ?, ?, ?, ?)");

    foreach ($articles as $a) {
        $views = rand(100, 5000);
        $contentHTML = generateContent($a[0], $a[2]);
        $stmt->execute([$a[0], $a[1], $contentHTML, $a[3], $a[4], 'Admin VNExpress', $views]);
    }

    echo "Hoàn thành! Đã thêm " . count($articles) . " bài viết có nội dung chi tiết.\n";

} catch (Exception $e) {
    echo "Lỗi: " . $e->getMessage() . "\n";
}
