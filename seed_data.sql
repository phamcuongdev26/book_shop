-- =============================================
-- SEED DATA: Categories + Books for testing
-- seller_id = 3 (seller1 account)
-- =============================================

-- 1. Update & insert categories
UPDATE categories SET active = 1, description = 'Tiểu thuyết, truyện ngắn, thơ ca trong và ngoài nước', slug = 'van-hoc' WHERE id = 1;

INSERT IGNORE INTO categories (name, description, slug, active) VALUES
('Kỹ Năng Sống',    'Phát triển bản thân, tư duy tích cực, quản lý thời gian',    'ky-nang-song',    1),
('Kinh Tế - Kinh Doanh', 'Đầu tư, tài chính cá nhân, khởi nghiệp, quản trị', 'kinh-te-kinh-doanh', 1),
('Khoa Học - Công Nghệ', 'Vật lý, toán học, AI, lập trình, khoa học vũ trụ',  'khoa-hoc-cong-nghe', 1),
('Lịch Sử - Địa Lý',    'Lịch sử thế giới, văn minh cổ đại, địa lý nhân văn',    'lich-su-dia-ly',    1),
('Thiếu Nhi',           'Truyện tranh, truyện cổ tích, sách giáo dục cho trẻ',    'thieu-nhi',         1),
('Tâm Lý Học',          'Tâm lý con người, trị liệu, nhận thức và hành vi',       'tam-ly-hoc',        1),
('Nghệ Thuật - Thiết Kế','Hội họa, thiết kế đồ họa, nhiếp ảnh, kiến trúc',       'nghe-thuat',        1),
('Sức Khỏe - Thể Thao', 'Dinh dưỡng, yoga, chạy bộ, thể hình, thiền định',       'suc-khoe-the-thao', 1),
('Ngoại Ngữ',           'Tiếng Anh, Nhật, Trung, Hàn, Pháp cho mọi trình độ',   'ngoai-ngu',         1);

-- =============================================
-- 2. Insert books  (seller_id = 3)
-- =============================================

-- ---- VĂN HỌC (category_id = 1) ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Nhà Giả Kim',
 'Paulo Coelho', 'NXB Hội Nhà Văn', 2020,
 'Câu chuyện về chàng chăn cừu Santiago và hành trình đi tìm kho báu. Một trong những tiểu thuyết bán chạy nhất mọi thời đại với hơn 65 triệu bản.',
 89000, 75000, 150,
 'https://covers.openlibrary.org/b/isbn/0062315007-L.jpg',
 '9780062315007', 208, 'Tiếng Việt', 1, 3, 'ACTIVE', 4.8, 520, 1),

('Đắc Nhân Tâm',
 'Dale Carnegie', 'NXB Tổng Hợp TP.HCM', 2019,
 'Cuốn sách kinh điển về kỹ năng giao tiếp và ứng xử với con người. Đã bán hơn 30 triệu bản trên toàn thế giới.',
 95000, NULL, 200,
 'https://covers.openlibrary.org/b/isbn/0671027034-L.jpg',
 '9780671027032', 320, 'Tiếng Việt', 1, 3, 'ACTIVE', 4.7, 890, 1),

('1984',
 'George Orwell', 'NXB Hội Nhà Văn', 2021,
 'Tiểu thuyết kinh điển về một xã hội độc tài toàn trị trong tương lai, nơi mọi suy nghĩ và hành động đều bị kiểm soát.',
 79000, 65000, 80,
 'https://covers.openlibrary.org/b/isbn/0451524934-L.jpg',
 '9780451524935', 328, 'Tiếng Việt', 1, 3, 'ACTIVE', 4.9, 340, 1),

('Người Đua Diều',
 'Khaled Hosseini', 'NXB Văn Học', 2022,
 'Câu chuyện cảm động về tình bạn và sự chuộc lỗi ở Afghanistan, từ thời Taliban đến hiện tại.',
 99000, 85000, 120,
 'https://covers.openlibrary.org/b/isbn/1594631931-L.jpg',
 '9781594631931', 372, 'Tiếng Việt', 1, 3, 'ACTIVE', 4.8, 270, 1),

('Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
 'Nguyễn Nhật Ánh', 'NXB Trẻ', 2010,
 'Câu chuyện về tuổi thơ ở làng quê Việt Nam với tình anh em, tình bạn và những kỷ niệm đẹp.',
 75000, NULL, 300,
 'https://picsum.photos/seed/hoavang/300/400',
 '9786041015739', 285, 'Tiếng Việt', 1, 3, 'ACTIVE', 4.9, 1200, 1),

('Hoàng Tử Bé',
 'Antoine de Saint-Exupéry', 'NXB Hội Nhà Văn', 2018,
 'Câu chuyện cổ tích dành cho người lớn về tình bạn, tình yêu và triết lý cuộc sống sâu sắc.',
 65000, 55000, 250,
 'https://covers.openlibrary.org/b/isbn/9782070612758-L.jpg',
 '9782070612758', 112, 'Tiếng Việt', 1, 3, 'ACTIVE', 4.9, 670, 1);

-- ---- KỸ NĂNG SỐNG (category_id sẽ được lấy qua subquery) ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Atomic Habits - Thay Đổi Tí Hon, Hiệu Quả Bất Ngờ',
 'James Clear', 'NXB Lao Động', 2022,
 'Cuốn sách về việc xây dựng thói quen tốt và loại bỏ thói quen xấu thông qua những thay đổi nhỏ hàng ngày.',
 139000, 115000, 180,
 'https://covers.openlibrary.org/b/isbn/0735211299-L.jpg',
 '9780735211292', 320, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'ky-nang-song'), 3, 'ACTIVE', 4.8, 950, 1),

('7 Thói Quen Hiệu Quả',
 'Stephen R. Covey', 'NXB Tổng Hợp TP.HCM', 2021,
 'Bảy nguyên tắc cốt lõi giúp bạn trở thành người hiệu quả trong cả công việc lẫn cuộc sống.',
 125000, NULL, 160,
 'https://covers.openlibrary.org/b/isbn/0743269519-L.jpg',
 '9780743269513', 384, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'ky-nang-song'), 3, 'ACTIVE', 4.7, 720, 1),

('Đừng Bao Giờ Đi Ăn Một Mình',
 'Keith Ferrazzi', 'NXB Lao Động', 2020,
 'Nghệ thuật xây dựng mối quan hệ và mạng lưới kết nối để thành công trong cuộc sống và sự nghiệp.',
 110000, 95000, 90,
 'https://picsum.photos/seed/networking/300/400',
 '9780385512060', 352, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'ky-nang-song'), 3, 'ACTIVE', 4.5, 380, 1),

('Sức Mạnh Của Thói Quen',
 'Charles Duhigg', 'NXB Lao Động', 2019,
 'Khám phá khoa học đằng sau việc hình thành và thay đổi thói quen trong cuộc sống và kinh doanh.',
 119000, 99000, 130,
 'https://picsum.photos/seed/habit/300/400',
 '9781400069286', 408, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'ky-nang-song'), 3, 'ACTIVE', 4.6, 460, 1);

-- ---- KINH TẾ - KINH DOANH ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Cha Giàu Cha Nghèo',
 'Robert T. Kiyosaki', 'NXB Trẻ', 2021,
 'Bài học tài chính của người cha giàu và người cha nghèo, nền tảng về đầu tư và tự do tài chính.',
 129000, 109000, 250,
 'https://covers.openlibrary.org/b/isbn/1612680194-L.jpg',
 '9781612680194', 336, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'kinh-te-kinh-doanh'), 3, 'ACTIVE', 4.6, 1500, 1),

('Khởi Nghiệp Tinh Gọn',
 'Eric Ries', 'NXB Lao Động', 2020,
 'Phương pháp Lean Startup giúp các công ty khởi nghiệp xây dựng sản phẩm đúng với nhu cầu thị trường.',
 149000, 125000, 100,
 'https://picsum.photos/seed/startup/300/400',
 '9780307887894', 336, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'kinh-te-kinh-doanh'), 3, 'ACTIVE', 4.5, 280, 1),

('Tư Duy Nhanh Và Chậm',
 'Daniel Kahneman', 'NXB Lao Động', 2022,
 'Khám phá hai hệ thống tư duy của não người: Hệ thống 1 (nhanh, bản năng) và Hệ thống 2 (chậm, lý trí).',
 159000, 135000, 75,
 'https://covers.openlibrary.org/b/isbn/0374533555-L.jpg',
 '9780374533557', 499, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'kinh-te-kinh-doanh'), 3, 'ACTIVE', 4.7, 410, 1),

('Zero to One',
 'Peter Thiel', 'NXB Lao Động', 2021,
 'Ghi chú về các startup và cách xây dựng tương lai từ nhà đồng sáng lập PayPal.',
 135000, NULL, 120,
 'https://picsum.photos/seed/zerotoone/300/400',
 '9780804139021', 224, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'kinh-te-kinh-doanh'), 3, 'ACTIVE', 4.4, 350, 1);

-- ---- KHOA HỌC - CÔNG NGHỆ ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Sapiens: Lược Sử Loài Người',
 'Yuval Noah Harari', 'NXB Tri Thức', 2021,
 'Hành trình 70.000 năm của loài người từ thời đồ đá đến thế kỷ 21, qua các cuộc cách mạng nhận thức, nông nghiệp và khoa học.',
 175000, 149000, 200,
 'https://covers.openlibrary.org/b/isbn/0062316117-L.jpg',
 '9780062316110', 464, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'khoa-hoc-cong-nghe'), 3, 'ACTIVE', 4.9, 820, 1),

('Vũ Trụ Trong Vỏ Hạt Dẻ',
 'Stephen Hawking', 'NXB Trẻ', 2019,
 'Hành trình khám phá các bí ẩn vũ trụ: lý thuyết dây, siêu đối xứng và thực tại lượng tử.',
 145000, 120000, 60,
 'https://picsum.photos/seed/universe/300/400',
 '9780553801583', 224, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'khoa-hoc-cong-nghe'), 3, 'ACTIVE', 4.7, 290, 1),

('Clean Code',
 'Robert C. Martin', 'NXB Lao Động', 2022,
 'Hướng dẫn viết mã nguồn sạch, dễ đọc và bảo trì cho lập trình viên chuyên nghiệp.',
 199000, 169000, 90,
 'https://picsum.photos/seed/cleancode/300/400',
 '9780132350884', 464, 'Tiếng Anh',
 (SELECT id FROM categories WHERE slug = 'khoa-hoc-cong-nghe'), 3, 'ACTIVE', 4.8, 420, 1);

-- ---- LỊCH SỬ - ĐỊA LÝ ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Homo Deus: Lược Sử Tương Lai',
 'Yuval Noah Harari', 'NXB Tri Thức', 2021,
 'Tương lai của loài người: trí tuệ nhân tạo, bất tử sinh học và sự kết thúc của con người như chúng ta biết.',
 179000, 155000, 140,
 'https://picsum.photos/seed/homodeus/300/400',
 '9780062464316', 464, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'lich-su-dia-ly'), 3, 'ACTIVE', 4.8, 380, 1),

('Lịch Sử Việt Nam Bằng Tranh',
 'Trần Bạch Đằng', 'NXB Trẻ', 2020,
 'Lịch sử Việt Nam từ thời Hùng Vương đến hiện đại được kể qua tranh vẽ sống động.',
 89000, NULL, 500,
 'https://picsum.photos/seed/lichsuvn/300/400',
 '9786041040601', 180, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'lich-su-dia-ly'), 3, 'ACTIVE', 4.6, 650, 1),

('Súng Thép Và Đại Dịch',
 'Jared Diamond', 'NXB Tri Thức', 2019,
 'Tại sao một số xã hội lại thống trị thế giới trong khi các xã hội khác bị chinh phục? Câu trả lời từ lịch sử loài người.',
 165000, 139000, 70,
 'https://picsum.photos/seed/gunsteel/300/400',
 '9780393317558', 528, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'lich-su-dia-ly'), 3, 'ACTIVE', 4.7, 210, 1);

-- ---- THIẾU NHI ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Harry Potter và Hòn Đá Phù Thủy',
 'J.K. Rowling', 'NXB Trẻ', 2021,
 'Câu chuyện về cậu bé phù thủy Harry Potter và cuộc hành trình khám phá thế giới phép thuật tại trường Hogwarts.',
 165000, 140000, 300,
 'https://covers.openlibrary.org/b/isbn/0439708184-L.jpg',
 '9780439708180', 309, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'thieu-nhi'), 3, 'ACTIVE', 4.9, 2100, 1),

('Dế Mèn Phiêu Lưu Ký',
 'Tô Hoài', 'NXB Kim Đồng', 2019,
 'Cuộc phiêu lưu của chú dế mèn qua các miền đất khác nhau, học hỏi những bài học quý giá về cuộc sống.',
 55000, NULL, 400,
 'https://picsum.photos/seed/demen/300/400',
 '9786041009820', 192, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'thieu-nhi'), 3, 'ACTIVE', 4.8, 1800, 1),

('Doraemon - Tập 1',
 'Fujiko F. Fujio', 'NXB Kim Đồng', 2022,
 'Chú mèo robot Doraemon từ tương lai đến giúp đỡ cậu bé Nobita với những bảo bối kỳ diệu.',
 25000, NULL, 600,
 'https://picsum.photos/seed/doraemon/300/400',
 '9786041012883', 192, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'thieu-nhi'), 3, 'ACTIVE', 4.9, 3500, 1);

-- ---- TÂM LÝ HỌC ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Cân Bằng Tâm Lý',
 'Lê Khanh', 'NXB Tổng Hợp TP.HCM', 2021,
 'Hướng dẫn thực hành để vượt qua lo âu, trầm cảm và tìm lại cân bằng trong cuộc sống hiện đại.',
 109000, 89000, 100,
 'https://picsum.photos/seed/psychology/300/400',
 '9786041090316', 256, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'tam-ly-hoc'), 3, 'ACTIVE', 4.5, 310, 1),

('Hiệu Ứng Chim Mồi',
 'William Poundstone', 'NXB Lao Động', 2020,
 'Khám phá cách giá cả và lựa chọn ảnh hưởng đến quyết định mua sắm của chúng ta.',
 129000, 109000, 85,
 'https://picsum.photos/seed/decoy/300/400',
 '9780809094691', 352, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'tam-ly-hoc'), 3, 'ACTIVE', 4.4, 195, 1),

('Dám Bị Ghét',
 'Ichiro Kishimi', 'NXB Lao Động', 2021,
 'Triết học Adlerian qua cuộc đối thoại giữa chàng trai trẻ và triết gia, về tự do và hạnh phúc.',
 119000, NULL, 180,
 'https://picsum.photos/seed/courage/300/400',
 '9784478025819', 296, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'tam-ly-hoc'), 3, 'ACTIVE', 4.7, 780, 1);

-- ---- NGHỆ THUẬT - THIẾT KẾ ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('The Elements of Typographic Style',
 'Robert Bringhurst', 'Hartley & Marks', 2004,
 'Kinh thánh của typography, hướng dẫn toàn diện về thiết kế chữ và bố cục văn bản.',
 249000, 210000, 40,
 'https://picsum.photos/seed/typography/300/400',
 '9780881792058', 398, 'Tiếng Anh',
 (SELECT id FROM categories WHERE slug = 'nghe-thuat'), 3, 'ACTIVE', 4.8, 120, 1),

('Steal Like an Artist',
 'Austin Kleon', 'NXB Lao Động', 2020,
 '10 điều mà không ai nói với bạn về sự sáng tạo - cuốn sách truyền cảm hứng cho người sáng tạo.',
 99000, 79000, 120,
 'https://picsum.photos/seed/stealartist/300/400',
 '9780761169253', 160, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'nghe-thuat'), 3, 'ACTIVE', 4.6, 280, 1),

('Nhiếp Ảnh Số Cho Người Mới Bắt Đầu',
 'Scott Kelby', 'NXB Lao Động', 2021,
 'Hướng dẫn từng bước để chụp ảnh đẹp với máy DSLR, từ cài đặt cơ bản đến kỹ thuật nâng cao.',
 179000, 149000, 60,
 'https://picsum.photos/seed/photography/300/400',
 '9780321934437', 480, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'nghe-thuat'), 3, 'ACTIVE', 4.5, 175, 1);

-- ---- SỨC KHỎE - THỂ THAO ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('Ăn Lành Để Thắng',
 'Trác Thúy Miêu', 'NXB Phụ Nữ', 2022,
 'Bí quyết ăn uống lành mạnh dựa trên khoa học dinh dưỡng hiện đại cho người Việt.',
 109000, 89000, 120,
 'https://picsum.photos/seed/healthfood/300/400',
 '9786041098770', 240, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'suc-khoe-the-thao'), 3, 'ACTIVE', 4.6, 420, 1),

('Chạy Bộ Cho Người Mới',
 'Jeff Galloway', 'NXB Thể Dục Thể Thao', 2020,
 'Chương trình huấn luyện chạy bộ từ 0 đến 5km, 10km và marathon cho người mới bắt đầu.',
 89000, NULL, 150,
 'https://picsum.photos/seed/running/300/400',
 '9780736074919', 256, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'suc-khoe-the-thao'), 3, 'ACTIVE', 4.5, 380, 1),

('Thiền Định Cho Người Bận Rộn',
 'Andy Puddicombe', 'NXB Lao Động', 2021,
 'Hướng dẫn 10 phút thiền mỗi ngày để giảm stress, tập trung hơn và tìm lại sự bình yên.',
 115000, 95000, 100,
 'https://picsum.photos/seed/meditation/300/400',
 '9781250029034', 224, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'suc-khoe-the-thao'), 3, 'ACTIVE', 4.7, 290, 1);

-- ---- NGOẠI NGỮ ----
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity, image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active) VALUES
('English Grammar in Use',
 'Raymond Murphy', 'Cambridge University Press', 2019,
 'Sách ngữ pháp tiếng Anh tham khảo và luyện tập bậc trung cấp được sử dụng rộng rãi nhất thế giới.',
 245000, 199000, 200,
 'https://covers.openlibrary.org/b/isbn/9780521189064-L.jpg',
 '9780521189064', 394, 'Tiếng Anh',
 (SELECT id FROM categories WHERE slug = 'ngoai-ngu'), 3, 'ACTIVE', 4.8, 1200, 1),

('Tiếng Nhật Sơ Cấp Minna no Nihongo 1',
 'Tổ biên soạn 3A', 'NXB ĐH Quốc Gia', 2020,
 'Giáo trình tiếng Nhật cơ bản phổ biến nhất, tổng hợp 25 bài học với bài tập phong phú.',
 185000, NULL, 300,
 'https://picsum.photos/seed/minna/300/400',
 '9784883191079', 352, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug = 'ngoai-ngu'), 3, 'ACTIVE', 4.7, 850, 1),

('IELTS 10 - Cambridge',
 'Cambridge ESOL', 'Cambridge University Press', 2021,
 'Bộ đề thi IELTS thật từ Cambridge với đáp án chi tiết, luyện tập 4 kỹ năng Nghe Nói Đọc Viết.',
 279000, 235000, 150,
 'https://picsum.photos/seed/ielts/300/400',
 '9781107464407', 222, 'Tiếng Anh',
 (SELECT id FROM categories WHERE slug = 'ngoai-ngu'), 3, 'ACTIVE', 4.6, 680, 1);

-- Confirmation
SELECT COUNT(*) AS total_books FROM books;
SELECT COUNT(*) AS total_categories FROM categories WHERE active = 1;