<?php
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    // Do NOT delete all articles anymore to prevent wiping user data
    // We will check before inserting

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

    // Định nghĩa dữ liệu sinh tự động cho 12 chuyên mục
    $categoryData = [
        1 => [
            'name' => 'Thời sự',
            'keywords' => ['giao thông', 'quy hoạch', 'đô thị', 'chính sách', 'hạ tầng', 'môi trường'],
            'images' => [
                'https://images.unsplash.com/photo-1541872526845-8c760a0f4460?w=800',
                'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
                'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800',
                'https://images.unsplash.com/photo-1543884814-1e0310237fa3?w=800',
                'https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=800',
                'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800',
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
                'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'
            ],
            'templates' => [
                ['Quốc hội họp bàn về {topic}', 'Các đại biểu tập trung thảo luận dự án Luật mới nhằm phát triển toàn diện {topic}.'],
                ['Phê duyệt đề án quy hoạch {topic} quốc gia', 'Đề án đặt mục tiêu đưa {topic} phát triển bền vững và hiện đại hóa.'],
                ['Tăng cường kiểm tra, giám sát công tác {topic}', 'Đoàn công tác liên ngành tổ chức thanh tra đột xuất các khu vực trọng điểm về {topic}.'],
                ['Khởi công dự án trọng điểm về {topic}', 'Dự án có quy mô đầu tư lớn nhằm giải quyết các bất cập liên quan đến {topic}.'],
                ['Đẩy mạnh chuyển đổi số trong {topic}', 'Các giải pháp công nghệ số mới áp dụng sẽ tối ưu hóa quy trình quản lý {topic}.']
            ]
        ],
        2 => [
            'name' => 'Thế giới',
            'keywords' => ['ngoại giao', 'hợp tác quốc tế', 'kinh tế toàn cầu', 'biến đổi khí hậu', 'khoa học vũ trụ', 'an ninh toàn cầu'],
            'images' => [
                'https://images.unsplash.com/photo-1520626027581-2292f327bd7d?w=800',
                'https://images.unsplash.com/photo-1517436073-3b3b18562c86?w=800',
                'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
                'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800',
                'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
                'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800',
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'
            ],
            'templates' => [
                ['Hội nghị thượng đỉnh thế giới thảo luận về {topic}', 'Các nguyên thủ quốc gia cùng thống nhất hành động chung vì {topic}.'],
                ['Tác động của {topic} tới cục diện kinh tế toàn cầu', 'Báo cáo mới nhất chỉ ra những thay đổi lớn do các chính sách về {topic}.'],
                ['Các nước ký kết hiệp ước hợp tác {topic}', 'Cột mốc quan trọng thúc đẩy mối quan hệ song phương và đa phương về {topic}.'],
                ['Nỗ lực ứng phó khủng hoảng {topic}', 'Cộng đồng quốc tế kêu gọi quyên góp và hỗ trợ nhân đạo khẩn cấp cho {topic}.'],
                ['Thành tựu mới mang tính toàn cầu về {topic}', 'Bước tiến vượt bậc giúp nâng cao hiệu quả giải quyết thách thức về {topic}.']
            ]
        ],
        3 => [
            'name' => 'Kinh doanh',
            'keywords' => ['thị trường tài chính', 'bất động sản', 'xuất nhập khẩu', 'chứng khoán', 'khởi nghiệp', 'doanh nghiệp lớn'],
            'images' => [
                'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
                'https://images.unsplash.com/photo-1520119859265-534a66a166e5?w=800',
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
                'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
                'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
                'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
                'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800'
            ],
            'templates' => [
                ['Xu hướng mới của {topic} trong quý này', 'Các nhà phân tích đưa ra dự báo tích cực đối với ngành đầu tư {topic}.'],
                ['Doanh nghiệp tăng tốc đón đầu cơ hội {topic}', 'Nhiều tập đoàn lớn bắt đầu tái cơ cấu dòng vốn đầu tư mạnh mẽ vào {topic}.'],
                ['Tháo gỡ điểm nghẽn pháp lý cho {topic}', 'Những thay đổi về cơ chế chính sách mang lại làn gió mới cho {topic}.'],
                ['Giải pháp tối ưu nguồn vốn trong lĩnh vực {topic}', 'Chuyên gia chia sẻ kinh nghiệm vượt bão tài chính nhờ phát triển {topic}.'],
                ['Làn sóng đầu tư nước ngoài đổ vào {topic}', 'Việt Nam tiếp tục là điểm sáng thu hút dòng vốn FDI chất lượng cao cho {topic}.']
            ]
        ],
        4 => [
            'name' => 'Khoa học - Công nghệ',
            'keywords' => ['trí tuệ nhân tạo', 'viễn thông 5G 6G', 'thiết bị thông minh', 'vật liệu nano', 'vũ trụ số', 'bảo mật thông tin'],
            'images' => [
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
                'https://images.unsplash.com/photo-1520698188151-5d97f26c07a3?w=800',
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
                'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
                'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800',
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
            ],
            'templates' => [
                ['Cách mạng hóa đời sống nhờ {topic}', 'Các ứng dụng khoa học mới sử dụng công nghệ {topic} mang đến lợi ích đột phá.'],
                ['Công bố nghiên cứu mang tính lịch sử về {topic}', 'Nhóm nhà khoa học quốc tế vừa công bố công trình nghiên cứu sâu về {topic}.'],
                ['Những rủi ro an ninh mạng cần phòng tránh với {topic}', 'Cảnh báo từ các chuyên gia bảo mật hàng đầu về lỗ hổng liên quan đến {topic}.'],
                ['Trải nghiệm các sản phẩm đột phá tích hợp {topic}', 'Cận cảnh thiết bị công nghệ hiện đại giúp tối ưu hóa khả năng ứng dụng {topic}.'],
                ['Tương lai phát triển và định hướng của {topic}', 'Tầm nhìn chiến lược trong 10 năm tới đưa {topic} làm nòng cốt tăng trưởng xã hội.']
            ]
        ],
        5 => [
            'name' => 'Giải trí',
            'keywords' => ['âm nhạc hiện đại', 'điện ảnh bom tấn', 'sự kiện thời trang', 'liveshow ca nhạc', 'game show truyền hình', 'trò chơi điện tử'],
            'images' => [
                'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
                'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
                'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
                'https://images.unsplash.com/photo-1516280440502-8610eb675037?w=800',
                'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800',
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'
            ],
            'templates' => [
                ['Những dự án nổi bật thúc đẩy {topic} năm nay', 'Điểm danh các gương mặt tiêu biểu và xu hướng sáng tạo trong lĩnh vực {topic}.'],
                ['Bùng nổ trào lưu mới xoay quanh {topic}', 'Giới trẻ hào hứng chia sẻ và tạo nên sức ảnh hưởng khổng lồ cho {topic}.'],
                ['Hậu trường sản xuất tác phẩm nghệ thuật về {topic}', 'Những câu chuyện chưa kể đằng sau sự thành công rực rỡ của dự án {topic}.'],
                ['Đánh giá chuyên môn về xu thế {topic} hiện nay', 'Nhà phê bình nghệ thuật phân tích sự phát triển đa chiều của {topic}.'],
                ['Festival quốc tế tôn vinh các giá trị {topic}', 'Sự kiện quy tụ hàng nghìn nghệ sĩ và khán giả tham gia ngày hội {topic}.']
            ]
        ],
        6 => [
            'name' => 'Thể thao',
            'keywords' => ['bóng đá ngoại hạng', 'giải bơi lội toàn quốc', 'đua xe công thức 1', 'quần vợt grand slam', 'thể thao học đường', 'vô địch thế giới'],
            'images' => [
                'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800',
                'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
                'https://images.unsplash.com/photo-1502014822147-1aedfb0676e0?w=800',
                'https://images.unsplash.com/photo-1551280336-6218c575005f?w=800',
                'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
                'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
                'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
                'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800'
            ],
            'templates' => [
                ['Hành trình chinh phục đỉnh cao {topic}', 'Sự chuẩn bị kỹ lưỡng và quyết tâm vượt qua giới hạn của vận động viên trong {topic}.'],
                ['Kịch tính trận chung kết giải đấu {topic}', 'Những khoảnh khắc nghẹt thở làm nên chiến thắng lịch sử của giải đấu {topic}.'],
                ['Đổi mới chiến thuật nâng tầm {topic}', 'Huấn luyện viên áp dụng giáo án hiện đại giúp đội tuyển bứt phá về {topic}.'],
                ['Xu hướng rèn luyện sức khỏe thông qua {topic}', 'Phong trào thể dục thể thao quần chúng hưởng ứng tích cực hoạt động {topic}.'],
                ['Vinh danh những gương mặt trẻ tài năng trong {topic}', 'Các nhân tố mới triển vọng hứa hẹn mang vinh quang về cho nước nhà ở {topic}.']
            ]
        ],
        7 => [
            'name' => 'Pháp luật',
            'keywords' => ['sở hữu trí tuệ', 'luật đất đai sửa đổi', 'pháp lý doanh nghiệp', 'an ninh mạng', 'tố tụng hình sự', 'bảo vệ người tiêu dùng'],
            'images' => [
                'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
                'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
                'https://images.unsplash.com/photo-1505664154420-7214da8fb5df?w=800',
                'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
                'https://images.unsplash.com/photo-1616231908472-fdb159846b09?w=800',
                'https://images.unsplash.com/photo-1474080447552-46d7a61d5267?w=800',
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
                'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'
            ],
            'templates' => [
                ['Điểm mới đáng chú ý trong quy định pháp luật về {topic}', 'Phân tích từ luật sư chuyên ngành giúp người dân hiểu rõ quyền lợi liên quan đến {topic}.'],
                ['Tăng cường xử lý vi phạm trong lĩnh vực {topic}', 'Lực lượng chức năng mở đợt ra quân chấn chỉnh các hành vi sai phạm về {topic}.'],
                ['Hội thảo đóng góp ý kiến hoàn thiện dự thảo luật {topic}', 'Nhiều giải pháp thiết thực được đề xuất nhằm tháo gỡ vướng mắc pháp lý cho {topic}.'],
                ['Bảo vệ quyền lợi hợp pháp nhờ hiểu đúng về {topic}', 'Cơ quan chức năng đẩy mạnh truyền thông và nâng cao ý thức tuân thủ {topic}.'],
                ['Tòa án xét xử nghiêm minh vụ án liên quan {topic}', 'Hình phạt thích đáng răn đe các hành vi trục lợi, vi phạm nghiêm trọng {topic}.']
            ]
        ],
        8 => [
            'name' => 'Giáo dục',
            'keywords' => ['đổi mới giáo dục', 'kỳ thi tốt nghiệp', 'học tập trực tuyến', 'học bổng khuyến học', 'kỹ năng mềm', 'đào tạo chất lượng cao'],
            'images' => [
                'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
                'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
                'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
                'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
            ],
            'templates' => [
                ['Định hướng đổi mới phương pháp giảng dạy {topic}', 'Mô hình giáo dục hiện đại tập trung ứng dụng thực tiễn cho học sinh về {topic}.'],
                ['Chương trình hỗ trợ đặc biệt thúc đẩy {topic}', 'Các quỹ khuyến học chung tay phát triển hạ tầng và tạo điều kiện học tập {topic}.'],
                ['Chuẩn bị sẵn sàng cho kỳ thi quốc gia môn {topic}', 'Hướng dẫn ôn luyện hiệu quả từ các giáo viên giàu kinh nghiệm về bộ môn {topic}.'],
                ['Tích hợp kỹ năng số giúp nâng cao tư duy học {topic}', 'Phương án sử dụng thiết bị trực quan sinh động hỗ trợ tiếp thu kiến thức {topic}.'],
                ['Sự phát triển vượt bậc của học sinh xuất sắc trong {topic}', 'Những câu chuyện đầy cảm hứng về tấm gương vượt khó học tốt chuyên đề {topic}.']
            ]
        ],
        9 => [
            'name' => 'Sức khỏe',
            'keywords' => ['rèn luyện thể chất', 'dinh dưỡng khoa học', 'y học phòng ngừa', 'chăm sóc tinh thần', 'lối sống lành mạnh', 'vắc-xin phòng bệnh'],
            'images' => [
                'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=800',
                'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
                'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
                'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
                'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
                'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800'
            ],
            'templates' => [
                ['Khuyến cáo của bác sĩ giúp tăng cường {topic}', 'Những phương pháp tự nhiên và khoa học để bảo vệ cơ thể thông qua {topic}.'],
                ['Ảnh hưởng tiêu cực từ thói quen xấu lên {topic}', 'Lời khuyên thay đổi thói quen ăn uống, sinh hoạt để nâng cao {topic}.'],
                ['Phương pháp giải tỏa căng thẳng toàn diện bằng {topic}', 'Cách thức giúp cơ thể và tâm trí phục hồi năng lượng thông qua {topic}.'],
                ['Bước tiến y học mới hỗ trợ điều trị về {topic}', 'Nhóm nghiên cứu công bố phác đồ điều trị an toàn, đạt hiệu quả tối ưu cho {topic}.'],
                ['Xây dựng chế độ dinh dưỡng tăng sức đề kháng nhờ {topic}', 'Thực đơn lành mạnh cung cấp đầy đủ dưỡng chất nâng cao sức khỏe {topic}.']
            ]
        ],
        10 => [
            'name' => 'Đời sống',
            'keywords' => ['quản lý tài chính', 'sống xanh bảo vệ môi trường', 'nuôi dạy con cái', 'chăm sóc gia đình', 'kỹ năng sinh tồn', 'không gian sống'],
            'images' => [
                'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
                'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800',
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
                'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
                'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
                'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?w=800',
                'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800'
            ],
            'templates' => [
                ['Bí quyết sắp xếp cuộc sống tối giản nhờ {topic}', 'Phương pháp quản lý thời gian và tài chính thông qua bài học về {topic}.'],
                ['Lan tỏa thông điệp ý nghĩa trong cộng đồng về {topic}', 'Dự án xã hội thu hút sự hưởng ứng của đông đảo cư dân nhằm nâng cao {topic}.'],
                ['Xu hướng cải tạo nhà cửa thân thiện dựa trên {topic}', 'Thiết kế thông minh tạo cảm giác thoáng đãng và tích hợp hài hòa {topic}.'],
                ['Cách cân bằng các mối quan hệ gia đình nhờ {topic}', 'Chuyên gia tâm lý hướng dẫn cách trò chuyện cùng con trẻ và thực hành {topic}.'],
                ['Kinh nghiệm tối ưu hóa chi tiêu sinh hoạt hàng ngày về {topic}', 'Mẹo mua sắm thông minh giúp gia đình tiết kiệm ngân sách nhờ áp dụng {topic}.']
            ]
        ],
        11 => [
            'name' => 'Du lịch',
            'keywords' => ['khám phá Tây Bắc', 'ẩm thực vùng miền', 'du lịch sinh thái', 'resort nghỉ dưỡng', 'trekking thám hiểm', 'di tích lịch sử'],
            'images' => [
                'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
                'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
                'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
                'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
            ],
            'templates' => [
                ['Khám phá trọn vẹn điểm đến tuyệt đẹp nhờ {topic}', 'Cẩm nang chi tiết từ blogger nổi tiếng về trải nghiệm thực tế cùng {topic}.'],
                ['Xu hướng xê dịch mới mẻ kết hợp hoạt động {topic}', 'Giới trẻ ưa chuộng hình thức đi phượt kết hợp rèn luyện thể thao và {topic}.'],
                ['Giới thiệu những món ngon đặc sắc trong hành trình {topic}', 'Trải nghiệm ẩm thực địa phương độc đáo làm say đắm lòng người khi khám phá {topic}.'],
                ['Bảo tồn văn hóa bản địa song song với phát triển {topic}', 'Cách làm sáng tạo giữ gìn nét đẹp cổ truyền và quảng bá du lịch về {topic}.'],
                ['Kế hoạch cho chuyến du lịch an toàn, trọn vẹn cùng {topic}', 'Những chuẩn bị kỹ càng từ trang phục, lịch trình để tận hưởng tối đa {topic}.']
            ]
        ],
        12 => [
            'name' => 'Góc nhìn',
            'keywords' => ['đô thị hóa', 'áp lực thành tích', 'văn hóa đọc sách', 'tương lai trí tuệ nhân tạo', 'khoảng cách thế hệ', 'giá trị hạnh phúc'],
            'images' => [
                'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
                'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800',
                'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
                'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800',
                'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
                'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800'
            ],
            'templates' => [
                ['Suy ngẫm về sự phát triển nhanh chóng của {topic}', 'Góc nhìn chân thực từ các tác giả uy tín phân tích sâu sắc tác động từ {topic}.'],
                ['Làm thế nào để thích nghi tốt trước sự biến đổi của {topic}', 'Những gợi mở hành vi, thái độ tích cực để tự tin làm chủ cuộc sống trước {topic}.'],
                ['Thách thức mới và sự chuyển mình cần thiết đối với {topic}', 'Bài viết chỉ ra tầm quan trọng của việc thay đổi lối suy nghĩ cũ về {topic}.'],
                ['Học cách tìm lại giá trị nguyên bản giữa vòng xoáy {topic}', 'Thông điệp truyền cảm hứng hướng con người tới hạnh phúc vững bền nhờ {topic}.'],
                ['Câu chuyện thời đại: Sự giao thoa và đối thoại giữa con người và {topic}', 'Những góc khuất xã hội được tái hiện rõ nét thông qua bài viết về {topic}.']
            ]
        ]
    ];

    $checkStmt = $pdo->prepare("SELECT id FROM articles WHERE title = ?");
    $stmt = $pdo->prepare("INSERT INTO articles (title, summary, content, image_url, category_id, author, views) VALUES (?, ?, ?, ?, ?, ?, ?)");

    $totalGenerated = 0;
    
    // Sinh ngẫu nhiên dữ liệu cho từng chuyên mục
    foreach ($categoryData as $catId => $data) {
        $name = $data['name'];
        $keywords = $data['keywords'];
        $images = $data['images'];
        $templates = $data['templates'];
        
        for ($i = 1; $i <= 30; $i++) {
            // Lấy ngẫu nhiên keyword, template, image
            $topic = $keywords[array_rand($keywords)];
            $tpl = $templates[array_rand($templates)];
            $img = $images[array_rand($images)];
            
            // Xây dựng title và summary độc nhất cho bài viết
            $title = str_replace('{topic}', $topic, $tpl[0]);
            $summary = str_replace('{topic}', $topic, $tpl[1]);
            
            // Kiểm tra xem bài viết đã tồn tại chưa
            $checkStmt->execute([$title]);
            if ($checkStmt->fetch()) {
                continue;
            }

            $views = rand(100, 5000);
            $contentHTML = generateContent($title, $topic);
            
            $stmt->execute([$title, $summary, $contentHTML, $img, $catId, 'Admin VNExpress', $views]);
            $totalGenerated++;
        }
    }

    echo "Hoàn thành! Đã sinh và lưu thành công " . $totalGenerated . " bài viết (30 bài cho mỗi chủ đề) kèm hình ảnh và nội dung đầy đủ.\n";

} catch (Exception $e) {
    echo "Lỗi: " . $e->getMessage() . "\n";
}

