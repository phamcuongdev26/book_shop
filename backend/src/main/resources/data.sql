-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: book_shop_db
-- ------------------------------------------------------
-- Server version	8.0.46

SET FOREIGN_KEY_CHECKS=0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `avg_rating` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `page_count` int DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `publish_year` int DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','OUT_OF_STOCK') DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `total_sold` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `seller_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKleqa3hhc0uhfvurq6mil47xk0` (`category_id`),
  KEY `FKiwatvar9di52i9uxrseg0h65k` (`seller_id`),
  CONSTRAINT `FKiwatvar9di52i9uxrseg0h65k` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKleqa3hhc0uhfvurq6mil47xk0` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (36,_binary '','Paulo Coelho',4.8,NULL,'Câu chuyện về chàng chăn cừu Santiago và hành trình đi tìm kho báu. Một trong những tiểu thuyết bán chạy nhất mọi thời đại với hơn 65 triệu bản.',75000.00,'https://covers.openlibrary.org/b/isbn/0062315007-L.jpg','9780062315007','Tiếng Việt',208,89000.00,2020,'NXB Hội Nhà Văn','ACTIVE',150,'Nhà Giả Kim',520,NULL,1,3),(37,_binary '','Dale Carnegie',4.7,NULL,'Cuốn sách kinh điển về kỹ năng giao tiếp và ứng xử với con người. Đã bán hơn 30 triệu bản trên toàn thế giới.',NULL,'https://covers.openlibrary.org/b/isbn/0671027034-L.jpg','9780671027032','Tiếng Việt',320,95000.00,2019,'NXB Tổng Hợp TP.HCM','ACTIVE',199,'Đắc Nhân Tâm',891,'2026-05-07 15:56:07.521214',1,3),(38,_binary '','George Orwell',4.9,NULL,'Tiểu thuyết kinh điển về một xã hội độc tài toàn trị trong tương lai, nơi mọi suy nghĩ và hành động đều bị kiểm soát.',65000.00,'https://covers.openlibrary.org/b/isbn/0451524934-L.jpg','9780451524935','Tiếng Việt',328,79000.00,2021,'NXB Hội Nhà Văn','ACTIVE',79,'1984',341,'2026-05-07 15:56:07.521214',1,3),(39,_binary '','Khaled Hosseini',4.8,NULL,'Câu chuyện cảm động về tình bạn và sự chuộc lỗi ở Afghanistan, từ thời Taliban đến hiện tại.',85000.00,'https://covers.openlibrary.org/b/isbn/1594631931-L.jpg','9781594631931','Tiếng Việt',372,99000.00,2022,'NXB Văn Học','ACTIVE',120,'Người Đua Diều',270,NULL,1,3),(40,_binary '','Nguyễn Nhật Ánh',4.9,NULL,'Câu chuyện về tuổi thơ ở làng quê Việt Nam với tình anh em, tình bạn và những kỷ niệm đẹp.',NULL,'https://picsum.photos/seed/hoavang/300/400','9786041015739','Tiếng Việt',285,75000.00,2010,'NXB Trẻ','ACTIVE',300,'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',1200,NULL,1,3),(41,_binary '','Antoine de Saint-Exupéry',4.9,NULL,'Câu chuyện cổ tích dành cho người lớn về tình bạn, tình yêu và triết lý cuộc sống sâu sắc.',55000.00,'https://covers.openlibrary.org/b/isbn/9782070612758-L.jpg','9782070612758','Tiếng Việt',112,65000.00,2018,'NXB Hội Nhà Văn','ACTIVE',250,'Hoàng Tử Bé',670,NULL,1,3),(42,_binary '','James Clear',4.8,NULL,'Cuốn sách về việc xây dựng thói quen tốt và loại bỏ thói quen xấu thông qua những thay đổi nhỏ hàng ngày.',115000.00,'https://covers.openlibrary.org/b/isbn/0735211299-L.jpg','9780735211292','Tiếng Việt',320,139000.00,2022,'NXB Lao Động','ACTIVE',180,'Atomic Habits - Thay Đổi Tí Hon, Hiệu Quả Bất Ngờ',950,NULL,11,3),(43,_binary '','Stephen R. Covey',4.7,NULL,'Bảy nguyên tắc cốt lõi giúp bạn trở thành người hiệu quả trong cả công việc lẫn cuộc sống.',NULL,'https://covers.openlibrary.org/b/isbn/0743269519-L.jpg','9780743269513','Tiếng Việt',384,125000.00,2021,'NXB Tổng Hợp TP.HCM','ACTIVE',160,'7 Thói Quen Hiệu Quả',720,NULL,11,3),(44,_binary '','Keith Ferrazzi',4.5,NULL,'Nghệ thuật xây dựng mối quan hệ và mạng lưới kết nối để thành công trong cuộc sống và sự nghiệp.',95000.00,'https://picsum.photos/seed/networking/300/400','9780385512060','Tiếng Việt',352,110000.00,2020,'NXB Lao Động','ACTIVE',90,'Đừng Bao Giờ Đi Ăn Một Mình',380,NULL,11,3),(45,_binary '','Charles Duhigg',4.6,NULL,'Khám phá khoa học đằng sau việc hình thành và thay đổi thói quen trong cuộc sống và kinh doanh.',99000.00,'https://picsum.photos/seed/habit/300/400','9781400069286','Tiếng Việt',408,119000.00,2019,'NXB Lao Động','ACTIVE',130,'Sức Mạnh Của Thói Quen',460,NULL,11,3),(46,_binary '','Robert T. Kiyosaki',4.6,NULL,'Bài học tài chính của người cha giàu và người cha nghèo, nền tảng về đầu tư và tự do tài chính.',109000.00,'https://covers.openlibrary.org/b/isbn/1612680194-L.jpg','9781612680194','Tiếng Việt',336,129000.00,2021,'NXB Trẻ','ACTIVE',250,'Cha Giàu Cha Nghèo',1500,NULL,12,3),(47,_binary '','Eric Ries',4.5,NULL,'Phương pháp Lean Startup giúp các công ty khởi nghiệp xây dựng sản phẩm đúng với nhu cầu thị trường.',125000.00,'https://picsum.photos/seed/startup/300/400','9780307887894','Tiếng Việt',336,149000.00,2020,'NXB Lao Động','ACTIVE',100,'Khởi Nghiệp Tinh Gọn',280,NULL,12,3),(48,_binary '','Daniel Kahneman',4.7,NULL,'Khám phá hai hệ thống tư duy của não người: Hệ thống 1 (nhanh, bản năng) và Hệ thống 2 (chậm, lý trí).',135000.00,'https://covers.openlibrary.org/b/isbn/0374533555-L.jpg','9780374533557','Tiếng Việt',499,159000.00,2022,'NXB Lao Động','ACTIVE',75,'Tư Duy Nhanh Và Chậm',410,NULL,12,3),(49,_binary '','Peter Thiel',4.4,NULL,'Ghi chú về các startup và cách xây dựng tương lai từ nhà đồng sáng lập PayPal.',NULL,'https://picsum.photos/seed/zerotoone/300/400','9780804139021','Tiếng Việt',224,135000.00,2021,'NXB Lao Động','ACTIVE',120,'Zero to One',350,NULL,12,3),(50,_binary '','Yuval Noah Harari',4.9,NULL,'Hành trình 70.000 năm của loài người từ thời đồ đá đến thế kỷ 21, qua các cuộc cách mạng nhận thức, nông nghiệp và khoa học.',149000.00,'https://covers.openlibrary.org/b/isbn/0062316117-L.jpg','9780062316110','Tiếng Việt',464,175000.00,2021,'NXB Tri Thức','ACTIVE',200,'Sapiens: Lược Sử Loài Người',820,NULL,13,3),(51,_binary '','Stephen Hawking',4.7,NULL,'Hành trình khám phá các bí ẩn vũ trụ: lý thuyết dây, siêu đối xứng và thực tại lượng tử.',120000.00,'https://picsum.photos/seed/universe/300/400','9780553801583','Tiếng Việt',224,145000.00,2019,'NXB Trẻ','ACTIVE',60,'Vũ Trụ Trong Vỏ Hạt Dẻ',290,NULL,13,3),(52,_binary '','Robert C. Martin',4.8,NULL,'Hướng dẫn viết mã nguồn sạch, dễ đọc và bảo trì cho lập trình viên chuyên nghiệp.',169000.00,'https://picsum.photos/seed/cleancode/300/400','9780132350884','Tiếng Anh',464,199000.00,2022,'NXB Lao Động','ACTIVE',90,'Clean Code',420,NULL,13,3),(53,_binary '','Yuval Noah Harari',4.8,NULL,'Tương lai của loài người: trí tuệ nhân tạo, bất tử sinh học và sự kết thúc của con người như chúng ta biết.',155000.00,'https://picsum.photos/seed/homodeus/300/400','9780062464316','Tiếng Việt',464,179000.00,2021,'NXB Tri Thức','ACTIVE',140,'Homo Deus: Lược Sử Tương Lai',380,NULL,14,3),(54,_binary '','Trần Bạch Đằng',4.6,NULL,'Lịch sử Việt Nam từ thời Hùng Vương đến hiện đại được kể qua tranh vẽ sống động.',NULL,'https://picsum.photos/seed/lichsuvn/300/400','9786041040601','Tiếng Việt',180,89000.00,2020,'NXB Trẻ','ACTIVE',500,'Lịch Sử Việt Nam Bằng Tranh',650,NULL,14,3),(55,_binary '','Jared Diamond',4.7,NULL,'Tại sao một số xã hội lại thống trị thế giới trong khi các xã hội khác bị chinh phục? Câu trả lời từ lịch sử loài người.',139000.00,'https://picsum.photos/seed/gunsteel/300/400','9780393317558','Tiếng Việt',528,165000.00,2019,'NXB Tri Thức','ACTIVE',70,'Súng Thép Và Đại Dịch',210,NULL,14,3),(56,_binary '','J.K. Rowling',4.9,NULL,'Câu chuyện về cậu bé phù thủy Harry Potter và cuộc hành trình khám phá thế giới phép thuật tại trường Hogwarts.',140000.00,'https://covers.openlibrary.org/b/isbn/0439708184-L.jpg','9780439708180','Tiếng Việt',309,165000.00,2021,'NXB Trẻ','ACTIVE',300,'Harry Potter và Hòn Đá Phù Thủy',2100,NULL,15,3),(57,_binary '','Tô Hoài',4.8,NULL,'Cuộc phiêu lưu của chú dế mèn qua các miền đất khác nhau, học hỏi những bài học quý giá về cuộc sống.',NULL,'https://picsum.photos/seed/demen/300/400','9786041009820','Tiếng Việt',192,55000.00,2019,'NXB Kim Đồng','ACTIVE',400,'Dế Mèn Phiêu Lưu Ký',1800,NULL,15,3),(58,_binary '','Fujiko F. Fujio',4.9,NULL,'Chú mèo robot Doraemon từ tương lai đến giúp đỡ cậu bé Nobita với những bảo bối kỳ diệu.',NULL,'https://picsum.photos/seed/doraemon/300/400','9786041012883','Tiếng Việt',192,25000.00,2022,'NXB Kim Đồng','ACTIVE',600,'Doraemon - Tập 1',3500,NULL,15,3),(59,_binary '','Lê Khanh',4.5,NULL,'Hướng dẫn thực hành để vượt qua lo âu, trầm cảm và tìm lại cân bằng trong cuộc sống hiện đại.',89000.00,'https://picsum.photos/seed/psychology/300/400','9786041090316','Tiếng Việt',256,109000.00,2021,'NXB Tổng Hợp TP.HCM','ACTIVE',100,'Cân Bằng Tâm Lý',310,NULL,16,3),(60,_binary '','William Poundstone',4.4,NULL,'Khám phá cách giá cả và lựa chọn ảnh hưởng đến quyết định mua sắm của chúng ta.',109000.00,'https://picsum.photos/seed/decoy/300/400','9780809094691','Tiếng Việt',352,129000.00,2020,'NXB Lao Động','ACTIVE',85,'Hiệu Ứng Chim Mồi',195,NULL,16,3),(61,_binary '','Ichiro Kishimi',4.7,NULL,'Triết học Adlerian qua cuộc đối thoại giữa chàng trai trẻ và triết gia, về tự do và hạnh phúc.',NULL,'https://picsum.photos/seed/courage/300/400','9784478025819','Tiếng Việt',296,119000.00,2021,'NXB Lao Động','ACTIVE',180,'Dám Bị Ghét',780,NULL,16,3),(62,_binary '','Robert Bringhurst',4.8,NULL,'Kinh thánh của typography, hướng dẫn toàn diện về thiết kế chữ và bố cục văn bản.',210000.00,'https://picsum.photos/seed/typography/300/400','9780881792058','Tiếng Anh',398,249000.00,2004,'Hartley & Marks','ACTIVE',40,'The Elements of Typographic Style',120,NULL,17,3),(63,_binary '','Austin Kleon',4.6,NULL,'10 điều mà không ai nói với bạn về sự sáng tạo - cuốn sách truyền cảm hứng cho người sáng tạo.',79000.00,'https://picsum.photos/seed/stealartist/300/400','9780761169253','Tiếng Việt',160,99000.00,2020,'NXB Lao Động','ACTIVE',120,'Steal Like an Artist',280,NULL,17,3),(64,_binary '','Scott Kelby',4.5,NULL,'Hướng dẫn từng bước để chụp ảnh đẹp với máy DSLR, từ cài đặt cơ bản đến kỹ thuật nâng cao.',149000.00,'https://picsum.photos/seed/photography/300/400','9780321934437','Tiếng Việt',480,179000.00,2021,'NXB Lao Động','ACTIVE',60,'Nhiếp Ảnh Số Cho Người Mới Bắt Đầu',175,NULL,17,3),(65,_binary '','Trác Thúy Miêu',4.6,NULL,'Bí quyết ăn uống lành mạnh dựa trên khoa học dinh dưỡng hiện đại cho người Việt.',89000.00,'https://picsum.photos/seed/healthfood/300/400','9786041098770','Tiếng Việt',240,109000.00,2022,'NXB Phụ Nữ','ACTIVE',120,'Ăn Lành Để Thắng',420,NULL,18,3),(66,_binary '','Jeff Galloway',4.5,NULL,'Chương trình huấn luyện chạy bộ từ 0 đến 5km, 10km và marathon cho người mới bắt đầu.',NULL,'https://picsum.photos/seed/running/300/400','9780736074919','Tiếng Việt',256,89000.00,2020,'NXB Thể Dục Thể Thao','ACTIVE',150,'Chạy Bộ Cho Người Mới',380,NULL,18,3),(67,_binary '','Andy Puddicombe',4.7,NULL,'Hướng dẫn 10 phút thiền mỗi ngày để giảm stress, tập trung hơn và tìm lại sự bình yên.',95000.00,'https://picsum.photos/seed/meditation/300/400','9781250029034','Tiếng Việt',224,115000.00,2021,'NXB Lao Động','ACTIVE',100,'Thiền Định Cho Người Bận Rộn',290,NULL,18,3),(68,_binary '','Raymond Murphy',4.8,NULL,'Sách ngữ pháp tiếng Anh tham khảo và luyện tập bậc trung cấp được sử dụng rộng rãi nhất thế giới.',199000.00,'https://covers.openlibrary.org/b/isbn/9780521189064-L.jpg','9780521189064','Tiếng Anh',394,245000.00,2019,'Cambridge University Press','ACTIVE',200,'English Grammar in Use',1200,NULL,19,3),(69,_binary '','Tổ biên soạn 3A',4.7,NULL,'Giáo trình tiếng Nhật cơ bản phổ biến nhất, tổng hợp 25 bài học với bài tập phong phú.',NULL,'https://picsum.photos/seed/minna/300/400','9784883191079','Tiếng Việt',352,185000.00,2020,'NXB ĐH Quốc Gia','ACTIVE',300,'Tiếng Nhật Sơ Cấp Minna no Nihongo 1',850,NULL,19,3),(70,_binary '','Cambridge ESOL',4.6,NULL,'Bộ đề thi IELTS thật từ Cambridge với đáp án chi tiết, luyện tập 4 kỹ năng Nghe Nói Đọc Viết.',235000.00,'https://picsum.photos/seed/ielts/300/400','9781107464407','Tiếng Anh',222,279000.00,2021,'Cambridge University Press','ACTIVE',150,'IELTS 10 - Cambridge',680,NULL,19,3),(71,_binary '','Stephen King',4.8,NULL,'Bảy đứa trẻ ở thị trấn Derry đối mặt với thực thể quái dị mang hình dạng chú hề Pennywise. 27 năm sau, chúng phải quay về để chấm dứt nỗi kinh hoàng một lần và mãi mãi.',169000.00,'https://covers.openlibrary.org/b/isbn/1501142976-L.jpg','9781501142970','Tiếng Việt',1138,199000.00,2019,'NXB Hội Nhà Văn','ACTIVE',80,'It',620,NULL,20,3),(72,_binary '','Stephen King',4.7,NULL,'Jack Torrance đưa cả gia đình đến trông coi khách sạn Overlook bị bỏ hoang trong mùa đông. Ngôi khách sạn ẩn chứa những thứ kinh hoàng đang thức tỉnh.',125000.00,'https://picsum.photos/seed/theshining/300/400','9780307743657','Tiếng Việt',447,149000.00,2020,'NXB Văn Học','ACTIVE',60,'The Shining - Gã Khách Sạn Ma',380,NULL,20,3),(73,_binary '','Stephen King',4.6,NULL,'Tuyển tập truyện kinh dị ngắn của bậc thầy Stephen King — mỗi câu chuyện là một cơn ác mộng không thể thoát ra.',NULL,'https://picsum.photos/seed/room1408/300/400','9780743294669','Tiếng Việt',304,95000.00,2021,'NXB Trẻ','ACTIVE',120,'Căn Phòng Số 1408',290,NULL,20,3),(74,_binary '','Kwaidan Koizumi',4.5,NULL,'Tuyển tập truyện ma và huyền thoại kinh dị truyền thống Nhật Bản — từ yêu quái, hồn ma đến những câu chuyện rùng mình trong đêm tối.',70000.00,'https://picsum.photos/seed/kwaidan/300/400','9784882932543','Tiếng Việt',288,85000.00,2022,'NXB Hội Nhà Văn','ACTIVE',150,'Những Câu Chuyện Kinh Dị Nhật Bản',410,NULL,20,3),(75,_binary '','Nhiều tác giả',4.3,NULL,'Tổng hợp những câu chuyện ma nổi tiếng nhất trong dân gian Việt Nam — từ Bắc vào Nam, mỗi vùng đất một huyền thoại.',NULL,'https://picsum.photos/seed/mavietnam/300/400','9786041020481','Tiếng Việt',256,65000.00,2020,'NXB Thanh Niên','ACTIVE',200,'Truyện Ma Việt Nam',780,NULL,20,3),(76,_binary '','Charles Perrault',4.9,NULL,'Câu chuyện cổ tích kinh điển về cô gái hiền lành Lọ Lem và đôi giày thủy tinh. Bản minh họa màu sắc sống động dành cho trẻ từ 4 tuổi.',NULL,'https://picsum.photos/seed/cinderella/300/400','9786041082366','Tiếng Việt',64,45000.00,2022,'NXB Kim Đồng','ACTIVE',500,'Cô Bé Lọ Lem',1500,NULL,21,3),(77,_binary '','Brothers Grimm',4.9,NULL,'Nàng Bạch Tuyết xinh đẹp trốn thoát khỏi bà hoàng hậu độc ác và tìm thấy ngôi nhà của bảy chú lùn tốt bụng trong rừng.',NULL,'https://picsum.photos/seed/snowwhite/300/400','9786041082373','Tiếng Việt',60,45000.00,2022,'NXB Kim Đồng','ACTIVE',500,'Bạch Tuyết Và Bảy Chú Lùn',1300,NULL,21,3),(78,_binary '','Carlo Collodi',4.8,NULL,'Chú bé gỗ Pinocchio muốn trở thành người thật và học những bài học quý giá về sự trung thực, lòng dũng cảm và tình yêu thương.',NULL,'https://picsum.photos/seed/pinocchio/300/400','9786041078895','Tiếng Việt',256,55000.00,2021,'NXB Kim Đồng','ACTIVE',400,'Pinocchio',980,NULL,21,3),(79,_binary '','A.A. Milne',4.9,NULL,'Những cuộc phiêu lưu của chú gấu Pooh và các bạn trong Khu Rừng Trăm Mẫu — bộ truyện gối đầu giường của mọi thế hệ.',65000.00,'https://picsum.photos/seed/winniepooh/300/400','9786041090569','Tiếng Việt',176,75000.00,2023,'NXB Kim Đồng','ACTIVE',350,'Khu Rừng Kỳ Diệu - Winnie the Pooh',2100,NULL,21,3),(80,_binary '','Nhiều tác giả',4.9,NULL,'Tuyển tập 50 truyện cổ tích Việt Nam nổi tiếng nhất: Tấm Cám, Sự Tích Hồ Gươm, Con Rồng Cháu Tiên... với hình ảnh minh họa đẹp mắt.',75000.00,'https://picsum.photos/seed/cotichvn/300/400','9786041013735','Tiếng Việt',320,89000.00,2020,'NXB Kim Đồng','ACTIVE',600,'Truyện Cổ Tích Việt Nam Hay Nhất',3200,NULL,21,3),(81,_binary '','Jane Austen',4.8,NULL,'Câu chuyện tình yêu kinh điển giữa Elizabeth Bennet thông minh và Mr. Darcy kiêu hãnh — một trong những tiểu thuyết được yêu thích nhất mọi thời đại.',95000.00,'https://covers.openlibrary.org/b/isbn/0141439513-L.jpg','9780141439518','Tiếng Việt',432,115000.00,2021,'NXB Hội Nhà Văn','ACTIVE',200,'Kiêu Hãnh Và Định Kiến',560,NULL,22,3),(82,_binary '','Victor Hugo',4.9,NULL,'Sử thi vĩ đại của nền văn học Pháp theo chân Jean Valjean trong hành trình chuộc tội và tìm lại nhân phẩm.',155000.00,'https://covers.openlibrary.org/b/isbn/9782253004226-L.jpg','9782253004226','Tiếng Việt',1232,185000.00,2019,'NXB Văn Học','ACTIVE',120,'Những Người Khốn Khổ',340,NULL,22,3),(83,_binary '','Margaret Mitchell',4.7,NULL,'Thiên tình sử hùng tráng về Scarlett O\'Hara giữa bối cảnh Nội chiến Mỹ — tiểu thuyết đoạt giải Pulitzer 1937.',149000.00,'https://picsum.photos/seed/gwtw/300/400','9780743273465','Tiếng Việt',1037,175000.00,2020,'NXB Văn Học','ACTIVE',90,'Cuốn Theo Chiều Gió',280,NULL,22,3),(84,_binary '','Nguyễn Nhật Ánh',4.8,NULL,'Câu chuyện tình yêu trong sáng và đầy tiếc nuối của Ngạn dành cho Hà Lan suốt những năm tháng học trò đến lúc trưởng thành.',NULL,'https://picsum.photos/seed/matbiec/300/400','9786041097353','Tiếng Việt',266,85000.00,2018,'NXB Trẻ','ACTIVE',400,'Mắt Biếc',2800,NULL,22,3),(85,_binary '','Nguyễn Nhật Ánh',4.8,NULL,'Hành trình trở về tuổi thơ ngây thơ của bốn đứa trẻ — một tác phẩm nhẹ nhàng, hài hước và đầy cảm xúc của Nguyễn Nhật Ánh.',NULL,'https://picsum.photos/seed/tuoitho/300/400','9786041038998','Tiếng Việt',248,75000.00,2019,'NXB Trẻ','ACTIVE',350,'Cho Tôi Xin Một Vé Đi Tuổi Thơ',3100,NULL,22,3),(86,_binary '','Masashi Kishimoto',4.9,NULL,'Hành trình của Naruto Uzumaki — cậu bé mang Cửu Vĩ trong người, ước mơ trở thành Hokage vĩ đại nhất làng Lá.',NULL,'https://picsum.photos/seed/naruto1/300/400','9784088728490','Tiếng Việt',192,25000.00,2022,'NXB Kim Đồng','ACTIVE',800,'Naruto - Tập 1',5200,NULL,23,3),(87,_binary '','Eiichiro Oda',4.9,NULL,'Monkey D. Luffy với giấc mơ trở thành Vua Hải Tặc và tìm kho báu One Piece huyền thoại. Bộ manga bán chạy nhất lịch sử.',NULL,'https://picsum.photos/seed/onepiece1/300/400','9784088725017','Tiếng Việt',208,25000.00,2022,'NXB Kim Đồng','ACTIVE',1000,'One Piece - Tập 1',6800,NULL,23,3),(88,_binary '','Hajime Isayama',4.8,NULL,'Trong thế giới bị Titan khổng lồ thống trị, Eren Yeager thề sẽ tiêu diệt tất cả chúng sau khi chứng kiến thảm kịch đau thương.',NULL,'https://picsum.photos/seed/aot1/300/400','9784063842838','Tiếng Việt',192,30000.00,2021,'NXB Kim Đồng','ACTIVE',600,'Attack on Titan - Tập 1',3400,NULL,23,3),(89,_binary '','Akira Toriyama',4.9,NULL,'Cuộc phiêu lưu của Son Goku trong hành trình thu thập 7 viên ngọc rồng và trở thành võ sĩ mạnh nhất vũ trụ.',NULL,'https://picsum.photos/seed/dragonball1/300/400','9784088518435','Tiếng Việt',192,25000.00,2020,'NXB Kim Đồng','ACTIVE',700,'Dragon Ball - Tập 1',7200,NULL,23,3),(90,_binary '','Gosho Aoyama',4.9,NULL,'Thám tử tuổi teen Shinichi Kudo bị biến thành cậu bé Conan và phải tiếp tục phá án trong khi điều tra tổ chức bí ẩn Áo Đen.',NULL,'https://picsum.photos/seed/conan1/300/400','9784091234001','Tiếng Việt',192,25000.00,2021,'NXB Kim Đồng','ACTIVE',900,'Conan - Thám Tử Lừng Danh Tập 1',8100,NULL,23,3),(91,_binary '','Arthur Conan Doyle',4.8,NULL,'Tuyển tập những vụ án hay nhất của thám tử Sherlock Holmes cùng người bạn Watson — kinh điển trinh thám thế giới.',120000.00,'https://covers.openlibrary.org/b/isbn/0393064581-L.jpg','9780393064582','Tiếng Việt',640,145000.00,2021,'NXB Văn Học','ACTIVE',160,'Thám Tử Sherlock Holmes Tuyển Tập',720,NULL,24,3),(92,_binary '','Agatha Christie',4.9,NULL,'Mười người xa lạ bị mắc kẹt trên đảo hoang và lần lượt bị giết theo bài đồng dao. Ai là kẻ giết người? Tiểu thuyết trinh thám kinh điển nhất mọi thời.',95000.00,'https://picsum.photos/seed/tenindians/300/400','9780062073488','Tiếng Việt',256,115000.00,2020,'NXB Hội Nhà Văn','ACTIVE',200,'Mười Người Da Đen Nhỏ',850,NULL,24,3),(93,_binary '','Agatha Christie',4.8,NULL,'Thám tử Hercule Poirot điều tra vụ án mạng xảy ra ngay trên chuyến tàu Express đông khách. Hung thủ là ai trong 12 hành khách?',85000.00,'https://picsum.photos/seed/orientexpress/300/400','9780062693662','Tiếng Việt',256,105000.00,2022,'NXB Hội Nhà Văn','ACTIVE',180,'Vụ Án Mạng Trên Tàu Tốc Hành Phương Đông',620,NULL,24,3),(94,_binary '','Gillian Flynn',4.7,NULL,'Nick Dunne trở thành nghi phạm chính trong vụ mất tích bí ẩn của vợ Amy vào ngày kỷ niệm hôn nhân thứ 5. Sự thật bất ngờ sẽ phơi bày.',115000.00,'https://picsum.photos/seed/gonegirl/300/400','9780307588364','Tiếng Việt',432,135000.00,2021,'NXB Văn Học','ACTIVE',130,'Cô Gái Mất Tích',480,NULL,24,3),(95,_binary '','Thích Nhất Hạnh',4.8,NULL,'Thiền sư Thích Nhất Hạnh dẫn dắt độc giả vào hành trình khám phá Phật pháp qua những bài học thiết thực về chánh niệm và an lạc.',NULL,'https://picsum.photos/seed/phat/300/400','9786049315428','Tiếng Việt',280,95000.00,2020,'NXB Tôn Giáo','ACTIVE',250,'Đường Về Cõi Phật',920,NULL,25,3),(96,_binary '','Eckhart Tolle',4.7,NULL,'Hướng dẫn thiền định và sống trong hiện tại, thoát khỏi vòng xoáy của quá khứ và tương lai để tìm bình yên nội tâm.',105000.00,'https://picsum.photos/seed/powerofnow/300/400','9781577314806','Tiếng Việt',236,125000.00,2021,'NXB Lao Động','ACTIVE',180,'Sức Mạnh Của Bây Giờ',580,NULL,25,3),(97,_binary '','S.N. Goenka',4.6,NULL,'Giới thiệu phương pháp thiền Vipassana cổ xưa — con đường thanh lọc tâm trí và tìm kiếm hạnh phúc thực sự.',NULL,'https://picsum.photos/seed/vipassana/300/400','9780060637248','Tiếng Việt',200,89000.00,2019,'NXB Tôn Giáo','ACTIVE',200,'Nghệ Thuật Sống - Thiền Vipassana',340,NULL,25,3),(98,_binary '','Nguyễn Nhật Ánh',4.7,NULL,'Bộ ba nhân vật chuyên... giải quyết những vụ việc cực kỳ vô lý theo phong cách hài hước đặc trưng của Nguyễn Nhật Ánh.',NULL,'https://picsum.photos/seed/sherlockcheo/300/400','9786041135642','Tiếng Việt',220,75000.00,2022,'NXB Trẻ','ACTIVE',300,'Sherlock Chèo',1200,NULL,26,3),(99,_binary '','Aziz Ansari',4.4,NULL,'Tản văn hài hước về cuộc sống hiện đại, tình yêu thời công nghệ và những bi hài của thế hệ millennials.',75000.00,'https://picsum.photos/seed/modernromance/300/400','9780143109259','Tiếng Việt',272,89000.00,2021,'NXB Trẻ','ACTIVE',200,'Bố Già - Mario Puzo (Hài Bản Lồng Tiếng)',380,NULL,26,3),(100,_binary '','Nhiều tác giả',4.3,NULL,'Tuyển tập những câu hỏi mẹo, câu đố hài hước và những tình huống bất ngờ khiến bạn phải cười ngất.',NULL,'https://picsum.photos/seed/hoixoay/300/400','9786041107816','Tiếng Việt',192,55000.00,2022,'NXB Thanh Niên','ACTIVE',400,'Hỏi Xoáy Đáp Xoay',890,NULL,26,3),(101,_binary '','Staedtler',4.6,'2026-05-08 16:47:53.533147','Bút chì graphite 2B chuẩn quốc tế, ruột chắc không gãy, phù hợp vẽ phác thảo và tô hình. Hộp 10 cây tiện lợi.',NULL,'https://loremflickr.com/300/400/pencils,school?lock=11',NULL,NULL,NULL,38000.00,NULL,NULL,'ACTIVE',400,'Bộ bút chì 2B – 10 cây',730,'2026-05-08 16:47:53.533147',27,5),(102,_binary '','Thiên Long',4.3,'2026-05-08 16:47:53.548913','Thước kẻ nhựa trong suốt 30cm có vạch chia mm rõ ràng, không bị phai. Chất liệu nhựa cứng, cạnh thẳng.',NULL,'https://loremflickr.com/300/400/ruler,stationery?lock=12',NULL,NULL,NULL,12000.00,NULL,NULL,'ACTIVE',500,'Thước kẻ nhựa 30cm',450,'2026-05-08 16:47:53.548913',27,5),(103,_binary '','Hồng Hà',4.5,'2026-05-08 16:47:53.553921','Vở ô li 200 trang, giấy trắng 70gsm, mực không lem, bìa cứng. Lý tưởng cho học sinh tiểu học luyện chữ đẹp.',NULL,'https://loremflickr.com/300/400/notebook,school?lock=13',NULL,NULL,NULL,55000.00,NULL,NULL,'ACTIVE',300,'Vở ô li 200 trang – bộ 5 cuốn',640,'2026-05-08 16:47:53.553921',27,5),(104,_binary '','Thiên Long',4.7,'2026-05-08 16:47:53.557921','Bộ 24 màu sáp an toàn, không độc hại cho trẻ. Màu sắc tươi sáng, nét vẽ mịn. Thích hợp cho bé từ 3 tuổi.',38000.00,'https://loremflickr.com/300/400/crayons,colorful?lock=14',NULL,NULL,NULL,45000.00,NULL,NULL,'ACTIVE',500,'Bộ màu sáp 24 màu',820,'2026-05-08 16:47:53.557921',27,5),(105,_binary '','NXB Giáo Dục',4.8,'2026-05-08 16:47:53.561921','200 thẻ flash card tiếng Anh có hình minh họa màu sắc, kèm phiên âm và nghĩa Việt. Phù hợp bé 4–8 tuổi.',72000.00,'https://loremflickr.com/300/400/flashcards,learning?lock=15',NULL,NULL,NULL,89000.00,NULL,NULL,'ACTIVE',200,'Flash card tiếng Anh 200 thẻ',510,'2026-05-08 16:47:53.561921',27,5),(106,_binary '','Deli',4.4,'2026-05-08 16:47:53.565921','Compa kim loại chắc chắn, đầu kim cứng không bị lệch, khớp xoay trơn tru. Kèm đầu bút chì thay thế.',NULL,'https://loremflickr.com/300/400/compass,geometry?lock=16',NULL,NULL,NULL,25000.00,NULL,NULL,'ACTIVE',400,'Compa vẽ tròn kim loại',380,'2026-05-08 16:47:53.565921',27,5),(107,_binary '','Handmade VN',4.8,'2026-05-08 16:47:53.574933','Thiệp sinh nhật 3D khi mở ra sẽ tạo thành bó hoa nở rộ, kèm phong bì sang trọng. In nổi tinh tế.',60000.00,'https://loremflickr.com/300/400/birthday,card?lock=21',NULL,NULL,NULL,75000.00,NULL,NULL,'ACTIVE',200,'Thiệp sinh nhật 3D hoa nở',430,'2026-05-08 16:47:53.574933',28,5),(108,_binary '','Quilling Art',4.9,'2026-05-08 16:47:53.578132','Thiệp tình yêu làm thủ công bằng kỹ thuật quilling tạo hình trái tim và hoa. Độc đáo, tinh tế.',95000.00,'https://loremflickr.com/300/400/heart,card?lock=22',NULL,NULL,NULL,120000.00,NULL,NULL,'ACTIVE',100,'Thiệp Valentine handmade quilled',310,'2026-05-08 16:47:53.578132',28,5),(109,_binary '','Mỹ Thuật Việt',4.7,'2026-05-08 16:47:53.590990','Bộ 10 tấm thiệp Tết với họa tiết hoa mai, câu đối, đèn lồng. In màu sắc rực rỡ, kèm 10 phong bì đỏ.',NULL,'https://loremflickr.com/300/400/lunar,newyear?lock=23',NULL,NULL,NULL,85000.00,NULL,NULL,'ACTIVE',300,'Thiệp chúc Tết truyền thống – bộ 10',680,'2026-05-08 16:47:53.590990',28,5),(110,_binary '','Paper Love',4.6,'2026-05-08 16:47:53.597999','Bộ 20 tấm thiệp cảm ơn nhỏ xinh màu pastel, kèm túi đựng. Phù hợp ghi lời cảm ơn trong quà, sự kiện.',35000.00,'https://loremflickr.com/300/400/thankyou,card?lock=24',NULL,NULL,NULL,45000.00,NULL,NULL,'ACTIVE',500,'Thiệp cảm ơn mini – bộ 20 tấm',920,'2026-05-08 16:47:53.597999',28,5),(111,_binary '','Grad Studio',4.5,'2026-05-08 16:47:53.603995','Bộ 5 tấm thiệp chúc mừng tốt nghiệp thiết kế hiện đại màu vàng–trắng, kèm phong bì. In Việt & Anh.',NULL,'https://loremflickr.com/300/400/graduation,celebration?lock=25',NULL,NULL,NULL,65000.00,NULL,NULL,'ACTIVE',150,'Thiệp chúc mừng tốt nghiệp',270,'2026-05-08 16:47:53.603995',28,5),(112,_binary '','Shine Cards',4.7,'2026-05-08 16:47:53.609988','Thiệp hologram phủ lớp nhũ lấp lánh đặc biệt, đổi màu theo ánh sáng. Phù hợp nhiều dịp, kèm phong bì.',28000.00,'https://loremflickr.com/300/400/greeting,card?lock=26',NULL,NULL,NULL,35000.00,NULL,NULL,'ACTIVE',500,'Thiệp hologram lấp lánh',540,'2026-05-08 16:47:53.609988',28,5),(113,_binary '','Soft Toys VN',4.9,'2026-05-08 16:47:53.636649','Gấu bông teddy 15cm, lông nhung mịn màng, màu be cổ điển. Nhân bông PP an toàn cho trẻ từ 0 tuổi.',75000.00,'https://loremflickr.com/300/400/teddy,bear?lock=31',NULL,NULL,NULL,89000.00,NULL,NULL,'ACTIVE',300,'Gấu bông Teddy Bear mini 15cm',760,'2026-05-08 16:47:53.636649',29,5),(114,_binary '','Cute Plush',4.8,'2026-05-08 16:47:53.643657','Gấu trúc panda 12cm với đôi mắt hột cườm long lanh. Màu đen–trắng đặc trưng, phù hợp làm quà.',NULL,'https://loremflickr.com/300/400/panda,plush?lock=32',NULL,NULL,NULL,75000.00,NULL,NULL,'ACTIVE',250,'Gấu trúc Panda mini 12cm',580,'2026-05-08 16:47:53.643657',29,5),(115,_binary '','Kawaii Toys',4.7,'2026-05-08 16:47:53.656646','Chó Corgi nhồi bông 10cm, dáng đứng cute, lông màu vàng nâu mềm mại. Thích hợp trang trí bàn học.',55000.00,'https://loremflickr.com/300/400/corgi,cute?lock=33',NULL,NULL,NULL,65000.00,NULL,NULL,'ACTIVE',200,'Chó Corgi nhồi bông 10cm',440,'2026-05-08 16:47:53.656646',29,5),(116,_binary '','Berry Plush',4.9,'2026-05-08 16:47:53.663653','Gấu bông dâu tây 8cm màu đỏ hồng dễ thương với chiếc nón lá xanh. Hot trend, rất được giới trẻ yêu thích.',45000.00,'https://loremflickr.com/300/400/strawberry,cute?lock=34',NULL,NULL,NULL,55000.00,NULL,NULL,'ACTIVE',400,'Gấu bông dâu tây hot trend 8cm',1100,'2026-05-08 16:47:53.663653',29,5),(117,_binary '','Bunny Plush',4.8,'2026-05-08 16:47:53.670643','Thỏ nhồi bông tai dài 15cm tông màu pastel nhẹ nhàng. Lông mềm mịn, phù hợp trang trí phòng hoặc làm quà.',NULL,'https://loremflickr.com/300/400/bunny,plush?lock=35',NULL,NULL,NULL,79000.00,NULL,NULL,'ACTIVE',200,'Thỏ bông tai dài pastel 15cm',620,'2026-05-08 16:47:53.670643',29,5),(118,_binary '','Key Ring Studio',4.6,'2026-05-08 16:47:53.678656','Bộ 3 móc khóa thú nhồi bông 6cm ngẫu nhiên. Lông mềm, móc inox chắc chắn. Dễ thương gắn lên ba lô, túi xách.',NULL,'https://loremflickr.com/300/400/keychain,cute?lock=36',NULL,NULL,NULL,45000.00,NULL,NULL,'ACTIVE',600,'Móc khóa gấu bông mini – bộ 3',870,'2026-05-08 16:47:53.678656',29,5),(119,_binary '','Mug Studio',4.8,'2026-05-08 16:47:53.695653','Cốc sứ cao cấp 350ml in hình \"Book Lover\" font chữ đẹp. Sứ trắng không phai màu khi rửa máy. Kèm hộp quà.',79000.00,'https://loremflickr.com/300/400/mug,coffee?lock=41',NULL,NULL,NULL,95000.00,NULL,NULL,'ACTIVE',100,'Cốc sứ in hình \"Book Lover\"',560,'2026-05-08 16:47:53.695653',30,5),(120,_binary '','ThermoBook',4.7,'2026-05-08 16:47:53.701646','Bình giữ nhiệt inox 304 dung tích 500ml, giữ nóng 12h / lạnh 24h. Nắp kín, không rò rỉ. Tặng kèm khi đặt đơn từ 500.000đ.',155000.00,'https://loremflickr.com/300/400/thermos,bottle?lock=42',NULL,NULL,NULL,185000.00,NULL,NULL,'ACTIVE',80,'Bình giữ nhiệt 500ml',390,'2026-05-08 16:47:53.701646',30,5),(121,_binary '','Tote VN',4.6,'2026-05-08 16:47:53.718703','Túi tote canvas dày in hình sách và câu trích dẫn hay. Quai chắc, thân thiện môi trường, giặt máy được. Tặng khi mua 2 sách.',NULL,'https://loremflickr.com/300/400/tote,bag?lock=43',NULL,NULL,NULL,65000.00,NULL,NULL,'ACTIVE',200,'Túi tote canvas in hình sách',720,'2026-05-08 16:47:53.718703',30,5),(122,_binary '','Bookmark Art',4.5,'2026-05-08 16:47:53.723689','Bộ 5 bookmark kim loại khắc laser hình hoa lá và câu trích dẫn sách nổi tiếng. Đựng trong hộp thiếc xinh xắn.',38000.00,'https://loremflickr.com/300/400/bookmark,reading?lock=44',NULL,NULL,NULL,45000.00,NULL,NULL,'ACTIVE',500,'Set bookmark kim loại – 5 chiếc',940,'2026-05-08 16:47:53.723689',30,5),(123,_binary '','Note & Pen',4.8,'2026-05-08 16:47:53.728679','Sổ A5 bìa da tổng hợp 160 trang kèm bút bi ký tên. Giấy kem 80gsm không nhòe mực. Tặng khi mua từ 4 sách.',120000.00,'https://loremflickr.com/300/400/notebook,pen?lock=45',NULL,NULL,NULL,145000.00,NULL,NULL,'ACTIVE',120,'Sổ tay bìa da + bút bi cao cấp',480,'2026-05-08 16:47:53.728679',30,5),(124,_binary '','Light Studio',4.7,'2026-05-08 16:47:53.732680','Đèn kẹp vào gáy sách, 3 chế độ sáng, sạc USB-C. Ánh sáng dịu bảo vệ mắt. Tặng khi đặt đơn từ 300.000đ.',NULL,'https://loremflickr.com/300/400/reading,lamp?lock=46',NULL,NULL,NULL,79000.00,NULL,NULL,'ACTIVE',150,'Đèn đọc sách clip LED mini',350,'2026-05-08 16:47:53.732680',30,5);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `book_id` bigint NOT NULL,
  `cart_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhiu1jw80o45wfiw5tgok1xpkl` (`book_id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  CONSTRAINT `FKhiu1jw80o45wfiw5tgok1xpkl` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (6,1,56,1),(7,2,41,1),(8,1,79,1),(9,1,89,2);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,5),(2,6);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `slug` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_t8o6pivur7nn124jehx7cygw5` (`name`),
  UNIQUE KEY `UK_oul14ho7bctbefv8jywp5v3i2` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Tiểu thuyết, truyện ngắn, thơ ca trong và ngoài nước',NULL,'Văn học',_binary '','van-hoc'),(11,'Phát triển bản thân, tư duy tích cực, quản lý thời gian',NULL,'Kỹ Năng Sống',_binary '','ky-nang-song'),(12,'Đầu tư, tài chính cá nhân, khởi nghiệp, quản trị',NULL,'Kinh Tế - Kinh Doanh',_binary '','kinh-te-kinh-doanh'),(13,'Vật lý, toán học, AI, lập trình, khoa học vũ trụ',NULL,'Khoa Học - Công Nghệ',_binary '','khoa-hoc-cong-nghe'),(14,'Lịch sử thế giới, văn minh cổ đại, địa lý nhân văn',NULL,'Lịch Sử - Địa Lý',_binary '','lich-su-dia-ly'),(15,'Truyện tranh, truyện cổ tích, sách giáo dục cho trẻ',NULL,'Thiếu Nhi',_binary '','thieu-nhi'),(16,'Tâm lý con người, trị liệu, nhận thức và hành vi',NULL,'Tâm Lý Học',_binary '','tam-ly-hoc'),(17,'Hội họa, thiết kế đồ họa, nhiếp ảnh, kiến trúc',NULL,'Nghệ Thuật - Thiết Kế',_binary '','nghe-thuat'),(18,'Dinh dưỡng, yoga, chạy bộ, thể hình, thiền định',NULL,'Sức Khỏe - Thể Thao',_binary '','suc-khoe-the-thao'),(19,'Tiếng Anh, Nhật, Trung, Hàn, Pháp cho mọi trình độ',NULL,'Ngoại Ngữ',_binary '','ngoai-ngu'),(20,'Truyện ma, kinh dị, horror, thriller tâm lý',NULL,'Truyện Kinh Dị',_binary '','truyen-kinh-di'),(21,'Truyện cổ tích, truyện tranh, sách giáo dục cho trẻ 3–12 tuổi',NULL,'Truyện Trẻ Em',_binary '','truyen-tre-em'),(22,'Tiểu thuyết trong và ngoài nước, romance, drama',NULL,'Tiểu Thuyết',_binary '','tieu-thuyet'),(23,'Truyện tranh Nhật Bản, Hàn Quốc, Mỹ và Việt Nam',NULL,'Manga - Comic',_binary '','manga-comic'),(24,'Truyện trinh thám, điều tra, hành động, spy thriller',NULL,'Trinh Thám - Hành Động',_binary '','trinh-tham'),(25,'Phật giáo, Thiên Chúa giáo, thiền, tâm linh học',NULL,'Tôn Giáo - Tâm Linh',_binary '','ton-giao-tam-linh'),(26,'Truyện vui, hài hước, tản văn giải trí',NULL,'Hài Hước - Giải Trí',_binary '','hai-huoc-giai-tri'),(27,'Vở, bút, màu vẽ, flash card và dụng cụ học tập cho trẻ',NULL,'Đồ Dùng Học Tập',_binary '','do-dung-hoc-tap'),(28,'Thiệp sinh nhật, thiệp chúc mừng, thiệp handmade đẹp',NULL,'Thiệp',_binary '','thiep'),(29,'Gấu bông nhỏ xinh, thú nhồi bông dễ thương làm quà',NULL,'Gấu Bông Mini',_binary '','gau-bong-mini'),(30,'Bộ quà tặng ý nghĩa cho sinh nhật, lễ, tết và sự kiện đặc biệt',NULL,'Quà Tặng',_binary '','qua-tang');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` varchar(1000) NOT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `related_order_code` varchar(30) DEFAULT NULL,
  `related_order_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('ORDER_PLACED','ORDER_STATUS_CHANGED','SYSTEM') NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `book_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi4ptndslo2pyfp9r1x0eulh9g` (`book_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKi4ptndslo2pyfp9r1x0eulh9g` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (2,1,95000.00,95000.00,37,2),(3,1,65000.00,65000.00,38,2);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL,
  `order_code` varchar(30) DEFAULT NULL,
  `payment_method` enum('COD','BANK_TRANSFER','MOMO','VNPAY') DEFAULT NULL,
  `payment_status` enum('UNPAID','PAID','REFUNDED') DEFAULT NULL,
  `recipient_name` varchar(150) DEFAULT NULL,
  `recipient_phone` varchar(20) DEFAULT NULL,
  `shipping_address` varchar(500) NOT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPING','DELIVERED','CANCELLED','RETURNED') NOT NULL,
  `total_amount` decimal(14,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_dhk2umg8ijjkg4njg6891trit` (`order_code`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-05-07 15:35:43.979260','','ORD1778168143979','MOMO','UNPAID','á','s','s','PENDING',396000.00,'2026-05-07 15:35:43.979786',5),(2,'2026-05-07 15:56:07.511260','a','ORD1778169367511','COD','UNPAID','s','s','á','PENDING',160000.00,'2026-05-07 15:56:07.511260',5);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `role` enum('USER','SELLER','ADMIN') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,NULL,NULL,'2026-05-06 19:07:43.925457','test@gmail.com','Test User',_binary '','$2a$10$3V0ZLBa1Qj7vekTha3y0TuFKyCzTDtUAStUmD7OEGBXbx2enE/VEO',NULL,'USER','2026-05-06 19:07:43.925457','testuser'),(3,NULL,NULL,'2026-05-06 19:20:00.171009','seller1@gmail.com','Seller One',_binary '','$2a$10$fEzyT6NBjqJ26YiO2TlDw.CK6jCKtj8Eu/MySIm5ss/mmcvmwSdHy',NULL,'SELLER','2026-05-06 19:20:00.171009','seller1'),(4,'Hà Nội',NULL,'2026-05-06 20:07:22.064657','nguyenvana@gmail.com','Nguyễn Văn A',_binary '','$2a$10$w4jkHEKsodmqFY3fQrXkVexjZvUW1/YuGV5/09UTLt.gG0wtH/Ore','0912345678','USER','2026-05-06 20:07:22.064657','nguyenvana'),(5,NULL,NULL,'2026-05-07 14:49:24.455902','admin@bookshop.com','ADMIN',_binary '','$2a$10$KWV..zPNJk3X4Vpfgo7UZe.rgDmvgfoE9keVFiyLOyzKlFZ2yYwRC',NULL,'ADMIN','2026-05-07 14:49:24.455902','admin'),(6,NULL,NULL,'2026-05-08 16:07:40.082706','zz@gmail.com','Ácasc',_binary '','$2a$10$V6jsWddJQulsWzQVG1qyouUE2twzwIfU8TOdl2px823jbz7CqG.dG',NULL,'USER','2026-05-08 16:07:40.082706','ácc');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09  0:00:13

SET FOREIGN_KEY_CHECKS=1;
