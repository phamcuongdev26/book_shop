-- =============================================
-- Thêm 4 danh mục quà tặng & học tập
-- seller_id = 3
-- =============================================

INSERT IGNORE INTO categories (name, description, slug, active) VALUES
('Đồ Dùng Học Tập', 'Vở, bút, màu vẽ, flash card và dụng cụ học tập cho trẻ',      'do-dung-hoc-tap', 1),
('Thiệp',           'Thiệp sinh nhật, thiệp chúc mừng, thiệp handmade đẹp',          'thiep',           1),
('Gấu Bông Mini',   'Gấu bông nhỏ xinh, thú nhồi bông dễ thương làm quà',            'gau-bong-mini',   1),
('Quà Tặng',        'Bộ quà tặng ý nghĩa cho sinh nhật, lễ, tết và sự kiện đặc biệt','qua-tang',        1);

-- =============================================
-- ĐỒ DÙNG HỌC TẬP
-- =============================================
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Bộ Màu Sáp 24 Màu Thiên Long',
 'Thiên Long', 'Thiên Long', 2024,
 'Bộ bút màu sáp 24 màu an toàn, không độc hại cho trẻ. Màu sắc tươi sáng, nét vẽ mịn, dễ cầm, thích hợp cho bé từ 3 tuổi.',
 45000, 38000, 500,
 'https://picsum.photos/seed/mausap/300/400',
 'TL-MAUSAP-24', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='do-dung-hoc-tap'), 3, 'ACTIVE', 4.7, 820, 1),

('Vở Ô Li 200 Trang – Bộ 5 Cuốn',
 'Hồng Hà', 'Hồng Hà', 2024,
 'Vở ô li 200 trang, giấy trắng dày, mực không lem, bìa cứng cứng cáp. Lý tưởng cho học sinh tiểu học luyện chữ đẹp.',
 55000, NULL, 300,
 'https://picsum.photos/seed/vohongha/300/400',
 'HH-VO-OLI-5', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='do-dung-hoc-tap'), 3, 'ACTIVE', 4.5, 640, 1),

('Bộ Flash Card Tiếng Anh 200 Thẻ',
 'Học Tốt', 'NXB Giáo Dục', 2023,
 '200 thẻ flash card tiếng Anh có hình minh họa màu sắc, kèm phiên âm và nghĩa Việt. Phù hợp cho bé 4–8 tuổi học từ vựng qua hình ảnh.',
 89000, 72000, 200,
 'https://picsum.photos/seed/flashcard/300/400',
 'GD-FC-ENG-200', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='do-dung-hoc-tap'), 3, 'ACTIVE', 4.8, 510, 1),

('Bộ Bút Chì 2B Tiêu Chuẩn – 10 Cây',
 'Staedtler', 'Staedtler', 2024,
 'Bút chì graphite 2B chuẩn quốc tế, ruột chắc không gãy, phù hợp vẽ phác thảo và tô hình cho học sinh. Hộp 10 cây tiện lợi.',
 38000, NULL, 400,
 'https://picsum.photos/seed/butchi/300/400',
 'SD-PENCIL-2B-10', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='do-dung-hoc-tap'), 3, 'ACTIVE', 4.6, 730, 1),

('Bảng Từ Viết Xóa Được A4',
 'Deli', 'Deli', 2024,
 'Bảng từ A4 có thể viết và xóa nhiều lần bằng nam châm, không cần mực, thân thiện môi trường. Kèm 2 bút viết bảng và 1 nam châm xóa.',
 65000, 52000, 150,
 'https://picsum.photos/seed/bangtu/300/400',
 'DL-BANG-A4', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='do-dung-hoc-tap'), 3, 'ACTIVE', 4.4, 290, 1);

-- =============================================
-- THIỆP
-- =============================================
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Thiệp Sinh Nhật 3D Hoa Nở – Hộp 5 Tấm',
 'Handmade VN', 'Gift Studio', 2024,
 'Thiệp sinh nhật 3D khi mở ra sẽ tạo thành bó hoa nở rộ, kèm phong bì sang trọng. In nổi tinh tế, thích hợp tặng bạn bè, người thân.',
 75000, 60000, 200,
 'https://picsum.photos/seed/thiepsinh/300/400',
 'GS-THIEP-3D-HN', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='thiep'), 3, 'ACTIVE', 4.8, 430, 1),

('Thiệp Chúc Tết Truyền Thống – Bộ 10 Tấm',
 'Mỹ Thuật Việt', 'NXB Mỹ Thuật', 2024,
 'Bộ 10 tấm thiệp Tết với họa tiết truyền thống: hoa mai, câu đối, đèn lồng. In màu sắc rực rỡ trên giấy mỹ thuật cao cấp.',
 85000, NULL, 300,
 'https://picsum.photos/seed/thieptet/300/400',
 'MT-THIEP-TET-10', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='thiep'), 3, 'ACTIVE', 4.7, 680, 1),

('Thiệp Tình Yêu Handmade Quilled',
 'Quilling Art', 'Gift Studio', 2024,
 'Thiệp tình yêu làm thủ công bằng kỹ thuật quilling (cuộn giấy) tạo hình trái tim và hoa. Độc đáo, tinh tế, rất thích hợp làm quà Valentine.',
 120000, 95000, 100,
 'https://picsum.photos/seed/thieptinhyeu/300/400',
 'GS-THIEP-LOVE-QL', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='thiep'), 3, 'ACTIVE', 4.9, 310, 1),

('Thiệp Cảm Ơn Mini – Bộ 20 Tấm',
 'Paper Love', 'Paper Love', 2024,
 'Bộ 20 tấm thiệp cảm ơn nhỏ xinh nhiều màu pastel, kèm túi đựng minh bạch. Phù hợp ghi lời cảm ơn trong quà, sự kiện, đám cưới.',
 45000, 35000, 500,
 'https://picsum.photos/seed/thiepcanon/300/400',
 'PL-THANKYOU-20', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='thiep'), 3, 'ACTIVE', 4.6, 920, 1),

('Thiệp Chúc Mừng Tốt Nghiệp – Bộ 5 Tấm',
 'Grad Studio', 'Gift Studio', 2024,
 'Bộ 5 thiệp chúc mừng tốt nghiệp với thiết kế hiện đại, màu vàng – trắng sang trọng, kèm phong bì. In cả tiếng Việt và tiếng Anh.',
 65000, NULL, 150,
 'https://picsum.photos/seed/thieptotnghiep/300/400',
 'GS-GRAD-5', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='thiep'), 3, 'ACTIVE', 4.5, 270, 1);

-- =============================================
-- GẤU BÔNG MINI
-- =============================================
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Gấu Bông Teddy Bear Mini 15cm',
 'Soft Toys VN', 'Soft Toys VN', 2024,
 'Gấu bông teddy nhỏ 15cm, lông nhung mịn màng, màu be cổ điển. Nhân bông PP đàn hồi tốt, an toàn cho trẻ từ 0 tuổi trở lên.',
 89000, 75000, 300,
 'https://picsum.photos/seed/gaubosg/300/400',
 'ST-TEDDY-15CM', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='gau-bong-mini'), 3, 'ACTIVE', 4.9, 760, 1),

('Gấu Bông Panda Mini 12cm',
 'Cute Plush', 'Cute Plush', 2024,
 'Gấu trúc panda nhồi bông 12cm với đôi mắt hột cườm long lanh, đáng yêu và an toàn. Màu đen – trắng đặc trưng, rất được yêu thích.',
 75000, NULL, 250,
 'https://picsum.photos/seed/panda/300/400',
 'CP-PANDA-12CM', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='gau-bong-mini'), 3, 'ACTIVE', 4.8, 580, 1),

('Thú Nhồi Bông Chó Corgi Mini 10cm',
 'Kawaii Toys', 'Kawaii Toys', 2024,
 'Chó Corgi nhồi bông siêu nhỏ 10cm, dáng đứng cute, lông màu vàng nâu mềm mại. Phù hợp trang trí bàn học, làm quà tặng bạn bè.',
 65000, 55000, 200,
 'https://picsum.photos/seed/corgi/300/400',
 'KW-CORGI-10CM', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='gau-bong-mini'), 3, 'ACTIVE', 4.7, 440, 1),

('Gấu Bông Dâu Tây Mini 8cm',
 'Strawberry Bear', 'Cute Plush', 2024,
 'Gấu bông hình dâu tây siêu nhỏ 8cm, màu đỏ hồng dễ thương với chiếc nón lá xanh. Hot trend trên mạng xã hội, rất được giới trẻ yêu thích.',
 55000, 45000, 400,
 'https://picsum.photos/seed/dautaybear/300/400',
 'SB-STRAWBERRY-8CM', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='gau-bong-mini'), 3, 'ACTIVE', 4.9, 1100, 1),

('Móc Khóa Gấu Bông Mini 6cm',
 'Key Ring Studio', 'Gift Studio', 2024,
 'Móc khóa thú nhồi bông mini 6cm nhiều nhân vật: gấu, thỏ, mèo, vịt vàng. Lông mềm, móc inox chắc chắn. Bán theo bộ 3 ngẫu nhiên.',
 45000, NULL, 600,
 'https://picsum.photos/seed/mockey/300/400',
 'KRS-KEYRING-3', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='gau-bong-mini'), 3, 'ACTIVE', 4.6, 870, 1);

-- =============================================
-- QUÀ TẶNG
-- =============================================
INSERT INTO books (title, author, publisher, publish_year, description, price, discount_price, stock_quantity,
  image_url, isbn, page_count, language, category_id, seller_id, status, avg_rating, total_sold, active)
VALUES
('Hộp Quà Sinh Nhật Deluxe – Set 5 Món',
 'Gift Box VN', 'Gift Studio', 2024,
 'Bộ quà tặng sinh nhật 5 món: nến sinh nhật, băng rôn, bong bóng, thiệp và sticker trang trí. Đóng gói hộp cứng sang trọng, sẵn sàng tặng.',
 185000, 155000, 100,
 'https://picsum.photos/seed/quasinh/300/400',
 'GS-BDAY-DELUXE-5', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='qua-tang'), 3, 'ACTIVE', 4.8, 390, 1),

('Set Quà Tặng Spa Thư Giãn',
 'Relax Gift', 'Luxury Gift', 2024,
 'Bộ quà spa gồm: muối tắm hoa hồng, nến thơm, mặt nạ dưỡng da và khăn bông nhỏ. Đựng trong hộp cối xay gió bằng giấy cứng, kèm ruy băng vàng.',
 250000, 210000, 80,
 'https://picsum.photos/seed/spagift/300/400',
 'LG-SPA-SET', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='qua-tang'), 3, 'ACTIVE', 4.7, 240, 1),

('Túi Quà Giấy Cao Cấp Nhiều Size – Bộ 6',
 'Wrap Studio', 'Paper Love', 2024,
 'Bộ 6 túi giấy quà tặng nhiều size (S/M/L) họa tiết hoa lá và kẻ sọc pastel. Giấy dày, quai dây ruy băng, tái sử dụng được.',
 65000, NULL, 300,
 'https://picsum.photos/seed/tuiqua/300/400',
 'WS-GIFTBAG-6', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='qua-tang'), 3, 'ACTIVE', 4.5, 560, 1),

('Hộp Quà Tết Cao Cấp – Bánh Kẹo Mix',
 'Tết Gift', 'Luxury Gift', 2024,
 'Hộp quà Tết sang trọng đựng trong hộp sơn mài đỏ vàng, chứa: bánh đậu xanh, mứt dừa, trà ô long và kẹo dừa Bến Tre. Giao hàng toàn quốc.',
 320000, 275000, 150,
 'https://picsum.photos/seed/tetgift/300/400',
 'LG-TET-MIX', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='qua-tang'), 3, 'ACTIVE', 4.9, 720, 1),

('Khung Ảnh Polaroid Gỗ – Bộ 6 Chiếc',
 'Memory Frame', 'Decor Studio', 2024,
 'Bộ 6 khung ảnh Polaroid bằng gỗ tự nhiên có kẹp kẽm, treo tường bằng dây thừng. Thiết kế tối giản, phù hợp trang trí phòng ngủ hoặc làm quà tặng.',
 145000, 120000, 120,
 'https://picsum.photos/seed/framepolaroid/300/400',
 'DS-FRAME-6P', 0, 'Tiếng Việt',
 (SELECT id FROM categories WHERE slug='qua-tang'), 3, 'ACTIVE', 4.6, 480, 1);
