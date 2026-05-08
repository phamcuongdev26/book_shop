-- =============================================
-- Thêm danh mục mới + sách mẫu
-- =============================================

INSERT IGNORE INTO categories (name, description, slug, active) VALUES
('Truyện Kinh Dị',    'Truyện ma, kinh dị, horror, thriller tâm lý',                'truyen-kinh-di',    1),
('Truyện Trẻ Em',     'Truyện cổ tích, truyện tranh, sách giáo dục cho trẻ 3–12 tuổi','truyen-tre-em',    1),
('Tiểu Thuyết',       'Tiểu thuyết trong và ngoài nước, romance, drama',             'tieu-thuyet',       1),
('Manga - Comic',     'Truyện tranh Nhật Bản, Hàn Quốc, Mỹ và Việt Nam',            'manga-comic',       1),
('Trinh Thám - Hành Động', 'Truyện trinh thám, điều tra, hành động, spy thriller', 'trinh-tham',        1),
('Tôn Giáo - Tâm Linh',   'Phật giáo, Thiên Chúa giáo, thiền, tâm linh học',      'ton-giao-tam-linh', 1),
('Hài Hước - Giải Trí',   'Truyện vui, hài hước, tản văn giải trí',                'hai-huoc-giai-tri', 1);

-- =============================================
-- Sách cho từng danh mục mới (seller_id = 3)
-- =============================================

-- TRUYỆN KINH DỊ
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('It',
 'Stephen King', 'NXB Hội Nhà Văn', 2019,
 'Bảy đứa trẻ ở thị trấn Derry đối mặt với thực thể quái dị mang hình dạng chú hề Pennywise. 27 năm sau, chúng phải quay về để chấm dứt nỗi kinh hoàng một lần và mãi mãi.',
 199000, 169000, 80,
 'https://covers.openlibrary.org/b/isbn/1501142976-L.jpg',
 '9781501142970', 1138, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-kinh-di'), 3, 'ACTIVE', 4.8, 620, 1),

('The Shining - Gã Khách Sạn Ma',
 'Stephen King', 'NXB Văn Học', 2020,
 'Jack Torrance đưa cả gia đình đến trông coi khách sạn Overlook bị bỏ hoang trong mùa đông. Ngôi khách sạn ẩn chứa những thứ kinh hoàng đang thức tỉnh.',
 149000, 125000, 60,
 'https://picsum.photos/seed/theshining/300/400',
 '9780307743657', 447, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-kinh-di'), 3, 'ACTIVE', 4.7, 380, 1),

('Căn Phòng Số 1408',
 'Stephen King', 'NXB Trẻ', 2021,
 'Tuyển tập truyện kinh dị ngắn của bậc thầy Stephen King — mỗi câu chuyện là một cơn ác mộng không thể thoát ra.',
 95000, NULL, 120,
 'https://picsum.photos/seed/room1408/300/400',
 '9780743294669', 304, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-kinh-di'), 3, 'ACTIVE', 4.6, 290, 1),

('Những Câu Chuyện Kinh Dị Nhật Bản',
 'Kwaidan Koizumi', 'NXB Hội Nhà Văn', 2022,
 'Tuyển tập truyện ma và huyền thoại kinh dị truyền thống Nhật Bản — từ yêu quái, hồn ma đến những câu chuyện rùng mình trong đêm tối.',
 85000, 70000, 150,
 'https://picsum.photos/seed/kwaidan/300/400',
 '9784882932543', 288, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-kinh-di'), 3, 'ACTIVE', 4.5, 410, 1),

('Truyện Ma Việt Nam',
 'Nhiều tác giả', 'NXB Thanh Niên', 2020,
 'Tổng hợp những câu chuyện ma nổi tiếng nhất trong dân gian Việt Nam — từ Bắc vào Nam, mỗi vùng đất một huyền thoại.',
 65000, NULL, 200,
 'https://picsum.photos/seed/mavietnam/300/400',
 '9786041020481', 256, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-kinh-di'), 3, 'ACTIVE', 4.3, 780, 1);

-- TRUYỆN TRẺ EM
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Cô Bé Lọ Lem',
 'Charles Perrault', 'NXB Kim Đồng', 2022,
 'Câu chuyện cổ tích kinh điển về cô gái hiền lành Lọ Lem và đôi giày thủy tinh. Bản minh họa màu sắc sống động dành cho trẻ từ 4 tuổi.',
 45000, NULL, 500,
 'https://picsum.photos/seed/cinderella/300/400',
 '9786041082366', 64, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-tre-em'), 3, 'ACTIVE', 4.9, 1500, 1),

('Bạch Tuyết Và Bảy Chú Lùn',
 'Brothers Grimm', 'NXB Kim Đồng', 2022,
 'Nàng Bạch Tuyết xinh đẹp trốn thoát khỏi bà hoàng hậu độc ác và tìm thấy ngôi nhà của bảy chú lùn tốt bụng trong rừng.',
 45000, NULL, 500,
 'https://picsum.photos/seed/snowwhite/300/400',
 '9786041082373', 60, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-tre-em'), 3, 'ACTIVE', 4.9, 1300, 1),

('Pinocchio',
 'Carlo Collodi', 'NXB Kim Đồng', 2021,
 'Chú bé gỗ Pinocchio muốn trở thành người thật và học những bài học quý giá về sự trung thực, lòng dũng cảm và tình yêu thương.',
 55000, NULL, 400,
 'https://picsum.photos/seed/pinocchio/300/400',
 '9786041078895', 256, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-tre-em'), 3, 'ACTIVE', 4.8, 980, 1),

('Khu Rừng Kỳ Diệu - Winnie the Pooh',
 'A.A. Milne', 'NXB Kim Đồng', 2023,
 'Những cuộc phiêu lưu của chú gấu Pooh và các bạn trong Khu Rừng Trăm Mẫu — bộ truyện gối đầu giường của mọi thế hệ.',
 75000, 65000, 350,
 'https://picsum.photos/seed/winniepooh/300/400',
 '9786041090569', 176, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-tre-em'), 3, 'ACTIVE', 4.9, 2100, 1),

('Truyện Cổ Tích Việt Nam Hay Nhất',
 'Nhiều tác giả', 'NXB Kim Đồng', 2020,
 'Tuyển tập 50 truyện cổ tích Việt Nam nổi tiếng nhất: Tấm Cám, Sự Tích Hồ Gươm, Con Rồng Cháu Tiên... với hình ảnh minh họa đẹp mắt.',
 89000, 75000, 600,
 'https://picsum.photos/seed/cotichvn/300/400',
 '9786041013735', 320, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='truyen-tre-em'), 3, 'ACTIVE', 4.9, 3200, 1);

-- TIỂU THUYẾT
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Kiêu Hãnh Và Định Kiến',
 'Jane Austen', 'NXB Hội Nhà Văn', 2021,
 'Câu chuyện tình yêu kinh điển giữa Elizabeth Bennet thông minh và Mr. Darcy kiêu hãnh — một trong những tiểu thuyết được yêu thích nhất mọi thời đại.',
 115000, 95000, 200,
 'https://covers.openlibrary.org/b/isbn/0141439513-L.jpg',
 '9780141439518', 432, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='tieu-thuyet'), 3, 'ACTIVE', 4.8, 560, 1),

('Những Người Khốn Khổ',
 'Victor Hugo', 'NXB Văn Học', 2019,
 'Sử thi vĩ đại của nền văn học Pháp theo chân Jean Valjean trong hành trình chuộc tội và tìm lại nhân phẩm.',
 185000, 155000, 120,
 'https://covers.openlibrary.org/b/isbn/9782253004226-L.jpg',
 '9782253004226', 1232, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='tieu-thuyet'), 3, 'ACTIVE', 4.9, 340, 1),

('Cuốn Theo Chiều Gió',
 'Margaret Mitchell', 'NXB Văn Học', 2020,
 'Thiên tình sử hùng tráng về Scarlett O\'Hara giữa bối cảnh Nội chiến Mỹ — tiểu thuyết đoạt giải Pulitzer 1937.',
 175000, 149000, 90,
 'https://picsum.photos/seed/gwtw/300/400',
 '9780743273465', 1037, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='tieu-thuyet'), 3, 'ACTIVE', 4.7, 280, 1),

('Mắt Biếc',
 'Nguyễn Nhật Ánh', 'NXB Trẻ', 2018,
 'Câu chuyện tình yêu trong sáng và đầy tiếc nuối của Ngạn dành cho Hà Lan suốt những năm tháng học trò đến lúc trưởng thành.',
 85000, NULL, 400,
 'https://picsum.photos/seed/matbiec/300/400',
 '9786041097353', 266, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='tieu-thuyet'), 3, 'ACTIVE', 4.8, 2800, 1),

('Cho Tôi Xin Một Vé Đi Tuổi Thơ',
 'Nguyễn Nhật Ánh', 'NXB Trẻ', 2019,
 'Hành trình trở về tuổi thơ ngây thơ của bốn đứa trẻ — một tác phẩm nhẹ nhàng, hài hước và đầy cảm xúc của Nguyễn Nhật Ánh.',
 75000, NULL, 350,
 'https://picsum.photos/seed/tuoitho/300/400',
 '9786041038998', 248, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='tieu-thuyet'), 3, 'ACTIVE', 4.8, 3100, 1);

-- MANGA - COMIC
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Naruto - Tập 1',
 'Masashi Kishimoto', 'NXB Kim Đồng', 2022,
 'Hành trình của Naruto Uzumaki — cậu bé mang Cửu Vĩ trong người, ước mơ trở thành Hokage vĩ đại nhất làng Lá.',
 25000, NULL, 800,
 'https://picsum.photos/seed/naruto1/300/400',
 '9784088728490', 192, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='manga-comic'), 3, 'ACTIVE', 4.9, 5200, 1),

('One Piece - Tập 1',
 'Eiichiro Oda', 'NXB Kim Đồng', 2022,
 'Monkey D. Luffy với giấc mơ trở thành Vua Hải Tặc và tìm kho báu One Piece huyền thoại. Bộ manga bán chạy nhất lịch sử.',
 25000, NULL, 1000,
 'https://picsum.photos/seed/onepiece1/300/400',
 '9784088725017', 208, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='manga-comic'), 3, 'ACTIVE', 4.9, 6800, 1),

('Attack on Titan - Tập 1',
 'Hajime Isayama', 'NXB Kim Đồng', 2021,
 'Trong thế giới bị Titan khổng lồ thống trị, Eren Yeager thề sẽ tiêu diệt tất cả chúng sau khi chứng kiến thảm kịch đau thương.',
 30000, NULL, 600,
 'https://picsum.photos/seed/aot1/300/400',
 '9784063842838', 192, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='manga-comic'), 3, 'ACTIVE', 4.8, 3400, 1),

('Dragon Ball - Tập 1',
 'Akira Toriyama', 'NXB Kim Đồng', 2020,
 'Cuộc phiêu lưu của Son Goku trong hành trình thu thập 7 viên ngọc rồng và trở thành võ sĩ mạnh nhất vũ trụ.',
 25000, NULL, 700,
 'https://picsum.photos/seed/dragonball1/300/400',
 '9784088518435', 192, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='manga-comic'), 3, 'ACTIVE', 4.9, 7200, 1),

('Conan - Thám Tử Lừng Danh Tập 1',
 'Gosho Aoyama', 'NXB Kim Đồng', 2021,
 'Thám tử tuổi teen Shinichi Kudo bị biến thành cậu bé Conan và phải tiếp tục phá án trong khi điều tra tổ chức bí ẩn Áo Đen.',
 25000, NULL, 900,
 'https://picsum.photos/seed/conan1/300/400',
 '9784091234001', 192, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='manga-comic'), 3, 'ACTIVE', 4.9, 8100, 1);

-- TRINH THÁM - HÀNH ĐỘNG
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Thám Tử Sherlock Holmes Tuyển Tập',
 'Arthur Conan Doyle', 'NXB Văn Học', 2021,
 'Tuyển tập những vụ án hay nhất của thám tử Sherlock Holmes cùng người bạn Watson — kinh điển trinh thám thế giới.',
 145000, 120000, 160,
 'https://covers.openlibrary.org/b/isbn/0393064581-L.jpg',
 '9780393064582', 640, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='trinh-tham'), 3, 'ACTIVE', 4.8, 720, 1),

('Mười Người Da Đen Nhỏ',
 'Agatha Christie', 'NXB Hội Nhà Văn', 2020,
 'Mười người xa lạ bị mắc kẹt trên đảo hoang và lần lượt bị giết theo bài đồng dao. Ai là kẻ giết người? Tiểu thuyết trinh thám kinh điển nhất mọi thời.',
 115000, 95000, 200,
 'https://picsum.photos/seed/tenindians/300/400',
 '9780062073488', 256, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='trinh-tham'), 3, 'ACTIVE', 4.9, 850, 1),

('Vụ Án Mạng Trên Tàu Tốc Hành Phương Đông',
 'Agatha Christie', 'NXB Hội Nhà Văn', 2022,
 'Thám tử Hercule Poirot điều tra vụ án mạng xảy ra ngay trên chuyến tàu Express đông khách. Hung thủ là ai trong 12 hành khách?',
 105000, 85000, 180,
 'https://picsum.photos/seed/orientexpress/300/400',
 '9780062693662', 256, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='trinh-tham'), 3, 'ACTIVE', 4.8, 620, 1),

('Cô Gái Mất Tích',
 'Gillian Flynn', 'NXB Văn Học', 2021,
 'Nick Dunne trở thành nghi phạm chính trong vụ mất tích bí ẩn của vợ Amy vào ngày kỷ niệm hôn nhân thứ 5. Sự thật bất ngờ sẽ phơi bày.',
 135000, 115000, 130,
 'https://picsum.photos/seed/gonegirl/300/400',
 '9780307588364', 432, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='trinh-tham'), 3, 'ACTIVE', 4.7, 480, 1);

-- TÔN GIÁO - TÂM LINH
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Đường Về Cõi Phật',
 'Thích Nhất Hạnh', 'NXB Tôn Giáo', 2020,
 'Thiền sư Thích Nhất Hạnh dẫn dắt độc giả vào hành trình khám phá Phật pháp qua những bài học thiết thực về chánh niệm và an lạc.',
 95000, NULL, 250,
 'https://picsum.photos/seed/phat/300/400',
 '9786049315428', 280, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='ton-giao-tam-linh'), 3, 'ACTIVE', 4.8, 920, 1),

('Sức Mạnh Của Bây Giờ',
 'Eckhart Tolle', 'NXB Lao Động', 2021,
 'Hướng dẫn thiền định và sống trong hiện tại, thoát khỏi vòng xoáy của quá khứ và tương lai để tìm bình yên nội tâm.',
 125000, 105000, 180,
 'https://picsum.photos/seed/powerofnow/300/400',
 '9781577314806', 236, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='ton-giao-tam-linh'), 3, 'ACTIVE', 4.7, 580, 1),

('Nghệ Thuật Sống - Thiền Vipassana',
 'S.N. Goenka', 'NXB Tôn Giáo', 2019,
 'Giới thiệu phương pháp thiền Vipassana cổ xưa — con đường thanh lọc tâm trí và tìm kiếm hạnh phúc thực sự.',
 89000, NULL, 200,
 'https://picsum.photos/seed/vipassana/300/400',
 '9780060637248', 200, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='ton-giao-tam-linh'), 3, 'ACTIVE', 4.6, 340, 1);

-- HÀI HƯỚC - GIẢI TRÍ
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Sherlock Chèo',
 'Nguyễn Nhật Ánh', 'NXB Trẻ', 2022,
 'Bộ ba nhân vật chuyên... giải quyết những vụ việc cực kỳ vô lý theo phong cách hài hước đặc trưng của Nguyễn Nhật Ánh.',
 75000, NULL, 300,
 'https://picsum.photos/seed/sherlockcheo/300/400',
 '9786041135642', 220, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='hai-huoc-giai-tri'), 3, 'ACTIVE', 4.7, 1200, 1),

('Bố Già - Mario Puzo (Hài Bản Lồng Tiếng)',
 'Aziz Ansari', 'NXB Trẻ', 2021,
 'Tản văn hài hước về cuộc sống hiện đại, tình yêu thời công nghệ và những bi hài của thế hệ millennials.',
 89000, 75000, 200,
 'https://picsum.photos/seed/modernromance/300/400',
 '9780143109259', 272, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='hai-huoc-giai-tri'), 3, 'ACTIVE', 4.4, 380, 1),

('Hỏi Xoáy Đáp Xoay',
 'Nhiều tác giả', 'NXB Thanh Niên', 2022,
 'Tuyển tập những câu hỏi mẹo, câu đố hài hước và những tình huống bất ngờ khiến bạn phải cười ngất.',
 55000, NULL, 400,
 'https://picsum.photos/seed/hoixoay/300/400',
 '9786041107816', 192, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='hai-huoc-giai-tri'), 3, 'ACTIVE', 4.3, 890, 1);

-- Kiểm tra kết quả
SELECT c.name AS category, COUNT(b.id) AS so_sach
FROM categories c
LEFT JOIN books b ON b.category_id = c.id AND b.active = 1
WHERE c.active = 1
GROUP BY c.id, c.name
ORDER BY c.id;