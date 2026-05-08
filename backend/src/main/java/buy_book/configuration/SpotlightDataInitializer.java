package buy_book.configuration;

import buy_book.constant.BookStatus;
import buy_book.entity.Book;
import buy_book.entity.Category;
import buy_book.entity.User;
import buy_book.repository.BookRepository;
import buy_book.repository.CategoryRepository;
import buy_book.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class SpotlightDataInitializer {

    // ── helper record ─────────────────────────────────────────────────────────
    record ProductData(
            String title, String author, String description,
            double price, Double discountPrice,
            int stock, String imageUrl,
            double avgRating, int totalSold
    ) {}

    // ── image helper ──────────────────────────────────────────────────────────
    private static String img(String keyword, int lock) {
        return "https://loremflickr.com/300/400/" + keyword + "?lock=" + lock;
    }

    @Bean
    ApplicationRunner spotlightRunner(
            CategoryRepository categoryRepo,
            BookRepository     bookRepo,
            UserRepository     userRepo
    ) {
        return args -> {
            // Dùng admin làm seller (ADMIN có quyền seller)
            User seller = userRepo.findByEmail("admin@bookshop.com").orElse(null);
            if (seller == null) return;

            seedSection(categoryRepo, bookRepo, seller,
                    "Đồ Dùng Học Tập",
                    "Vở, bút, màu vẽ, flash card và dụng cụ học tập cho trẻ",
                    "do-dung-hoc-tap",
                    List.of(
                            new ProductData("Bộ bút chì 2B – 10 cây", "Staedtler",
                                    "Bút chì graphite 2B chuẩn quốc tế, ruột chắc không gãy, phù hợp vẽ phác thảo và tô hình. Hộp 10 cây tiện lợi.",
                                    38000, null, 400, img("pencils,school", 11), 4.6, 730),
                            new ProductData("Thước kẻ nhựa 30cm", "Thiên Long",
                                    "Thước kẻ nhựa trong suốt 30cm có vạch chia mm rõ ràng, không bị phai. Chất liệu nhựa cứng, cạnh thẳng.",
                                    12000, null, 500, img("ruler,stationery", 12), 4.3, 450),
                            new ProductData("Vở ô li 200 trang – bộ 5 cuốn", "Hồng Hà",
                                    "Vở ô li 200 trang, giấy trắng 70gsm, mực không lem, bìa cứng. Lý tưởng cho học sinh tiểu học luyện chữ đẹp.",
                                    55000, null, 300, img("notebook,school", 13), 4.5, 640),
                            new ProductData("Bộ màu sáp 24 màu", "Thiên Long",
                                    "Bộ 24 màu sáp an toàn, không độc hại cho trẻ. Màu sắc tươi sáng, nét vẽ mịn. Thích hợp cho bé từ 3 tuổi.",
                                    45000, 38000.0, 500, img("crayons,colorful", 14), 4.7, 820),
                            new ProductData("Flash card tiếng Anh 200 thẻ", "NXB Giáo Dục",
                                    "200 thẻ flash card tiếng Anh có hình minh họa màu sắc, kèm phiên âm và nghĩa Việt. Phù hợp bé 4–8 tuổi.",
                                    89000, 72000.0, 200, img("flashcards,learning", 15), 4.8, 510),
                            new ProductData("Compa vẽ tròn kim loại", "Deli",
                                    "Compa kim loại chắc chắn, đầu kim cứng không bị lệch, khớp xoay trơn tru. Kèm đầu bút chì thay thế.",
                                    25000, null, 400, img("compass,geometry", 16), 4.4, 380)
                    )
            );

            seedSection(categoryRepo, bookRepo, seller,
                    "Thiệp",
                    "Thiệp sinh nhật, thiệp chúc mừng, thiệp handmade đẹp",
                    "thiep",
                    List.of(
                            new ProductData("Thiệp sinh nhật 3D hoa nở", "Handmade VN",
                                    "Thiệp sinh nhật 3D khi mở ra sẽ tạo thành bó hoa nở rộ, kèm phong bì sang trọng. In nổi tinh tế.",
                                    75000, 60000.0, 200, img("birthday,card", 21), 4.8, 430),
                            new ProductData("Thiệp Valentine handmade quilled", "Quilling Art",
                                    "Thiệp tình yêu làm thủ công bằng kỹ thuật quilling tạo hình trái tim và hoa. Độc đáo, tinh tế.",
                                    120000, 95000.0, 100, img("heart,card", 22), 4.9, 310),
                            new ProductData("Thiệp chúc Tết truyền thống – bộ 10", "Mỹ Thuật Việt",
                                    "Bộ 10 tấm thiệp Tết với họa tiết hoa mai, câu đối, đèn lồng. In màu sắc rực rỡ, kèm 10 phong bì đỏ.",
                                    85000, null, 300, img("lunar,newyear", 23), 4.7, 680),
                            new ProductData("Thiệp cảm ơn mini – bộ 20 tấm", "Paper Love",
                                    "Bộ 20 tấm thiệp cảm ơn nhỏ xinh màu pastel, kèm túi đựng. Phù hợp ghi lời cảm ơn trong quà, sự kiện.",
                                    45000, 35000.0, 500, img("thankyou,card", 24), 4.6, 920),
                            new ProductData("Thiệp chúc mừng tốt nghiệp", "Grad Studio",
                                    "Bộ 5 tấm thiệp chúc mừng tốt nghiệp thiết kế hiện đại màu vàng–trắng, kèm phong bì. In Việt & Anh.",
                                    65000, null, 150, img("graduation,celebration", 25), 4.5, 270),
                            new ProductData("Thiệp hologram lấp lánh", "Shine Cards",
                                    "Thiệp hologram phủ lớp nhũ lấp lánh đặc biệt, đổi màu theo ánh sáng. Phù hợp nhiều dịp, kèm phong bì.",
                                    35000, 28000.0, 500, img("greeting,card", 26), 4.7, 540)
                    )
            );

            seedSection(categoryRepo, bookRepo, seller,
                    "Gấu Bông Mini",
                    "Gấu bông nhỏ xinh, thú nhồi bông dễ thương làm quà",
                    "gau-bong-mini",
                    List.of(
                            new ProductData("Gấu bông Teddy Bear mini 15cm", "Soft Toys VN",
                                    "Gấu bông teddy 15cm, lông nhung mịn màng, màu be cổ điển. Nhân bông PP an toàn cho trẻ từ 0 tuổi.",
                                    89000, 75000.0, 300, img("teddy,bear", 31), 4.9, 760),
                            new ProductData("Gấu trúc Panda mini 12cm", "Cute Plush",
                                    "Gấu trúc panda 12cm với đôi mắt hột cườm long lanh. Màu đen–trắng đặc trưng, phù hợp làm quà.",
                                    75000, null, 250, img("panda,plush", 32), 4.8, 580),
                            new ProductData("Chó Corgi nhồi bông 10cm", "Kawaii Toys",
                                    "Chó Corgi nhồi bông 10cm, dáng đứng cute, lông màu vàng nâu mềm mại. Thích hợp trang trí bàn học.",
                                    65000, 55000.0, 200, img("corgi,cute", 33), 4.7, 440),
                            new ProductData("Gấu bông dâu tây hot trend 8cm", "Berry Plush",
                                    "Gấu bông dâu tây 8cm màu đỏ hồng dễ thương với chiếc nón lá xanh. Hot trend, rất được giới trẻ yêu thích.",
                                    55000, 45000.0, 400, img("strawberry,cute", 34), 4.9, 1100),
                            new ProductData("Thỏ bông tai dài pastel 15cm", "Bunny Plush",
                                    "Thỏ nhồi bông tai dài 15cm tông màu pastel nhẹ nhàng. Lông mềm mịn, phù hợp trang trí phòng hoặc làm quà.",
                                    79000, null, 200, img("bunny,plush", 35), 4.8, 620),
                            new ProductData("Móc khóa gấu bông mini – bộ 3", "Key Ring Studio",
                                    "Bộ 3 móc khóa thú nhồi bông 6cm ngẫu nhiên. Lông mềm, móc inox chắc chắn. Dễ thương gắn lên ba lô, túi xách.",
                                    45000, null, 600, img("keychain,cute", 36), 4.6, 870)
                    )
            );

            seedSection(categoryRepo, bookRepo, seller,
                    "Quà Tặng",
                    "Bộ quà tặng ý nghĩa cho sinh nhật, lễ, tết và sự kiện đặc biệt",
                    "qua-tang",
                    List.of(
                            new ProductData("Cốc sứ in hình \"Book Lover\"", "Mug Studio",
                                    "Cốc sứ cao cấp 350ml in hình \"Book Lover\" font chữ đẹp. Sứ trắng không phai màu khi rửa máy. Kèm hộp quà.",
                                    95000, 79000.0, 100, img("mug,coffee", 41), 4.8, 560),
                            new ProductData("Bình giữ nhiệt 500ml", "ThermoBook",
                                    "Bình giữ nhiệt inox 304 dung tích 500ml, giữ nóng 12h / lạnh 24h. Nắp kín, không rò rỉ. Tặng kèm khi đặt đơn từ 500.000đ.",
                                    185000, 155000.0, 80, img("thermos,bottle", 42), 4.7, 390),
                            new ProductData("Túi tote canvas in hình sách", "Tote VN",
                                    "Túi tote canvas dày in hình sách và câu trích dẫn hay. Quai chắc, thân thiện môi trường, giặt máy được. Tặng khi mua 2 sách.",
                                    65000, null, 200, img("tote,bag", 43), 4.6, 720),
                            new ProductData("Set bookmark kim loại – 5 chiếc", "Bookmark Art",
                                    "Bộ 5 bookmark kim loại khắc laser hình hoa lá và câu trích dẫn sách nổi tiếng. Đựng trong hộp thiếc xinh xắn.",
                                    45000, 38000.0, 500, img("bookmark,reading", 44), 4.5, 940),
                            new ProductData("Sổ tay bìa da + bút bi cao cấp", "Note & Pen",
                                    "Sổ A5 bìa da tổng hợp 160 trang kèm bút bi ký tên. Giấy kem 80gsm không nhòe mực. Tặng khi mua từ 4 sách.",
                                    145000, 120000.0, 120, img("notebook,pen", 45), 4.8, 480),
                            new ProductData("Đèn đọc sách clip LED mini", "Light Studio",
                                    "Đèn kẹp vào gáy sách, 3 chế độ sáng, sạc USB-C. Ánh sáng dịu bảo vệ mắt. Tặng khi đặt đơn từ 300.000đ.",
                                    79000, null, 150, img("reading,lamp", 46), 4.7, 350)
                    )
            );
        };
    }

    private void seedSection(
            CategoryRepository categoryRepo,
            BookRepository     bookRepo,
            User               seller,
            String             catName,
            String             catDesc,
            String             catSlug,
            List<ProductData>  products
    ) {
        if (categoryRepo.existsBySlug(catSlug)) {
            log.debug("Spotlight category already exists: {}", catSlug);
            return;
        }

        Category cat = categoryRepo.save(
                Category.builder()
                        .name(catName)
                        .description(catDesc)
                        .slug(catSlug)
                        .active(true)
                        .build()
        );

        for (ProductData p : products) {
            bookRepo.save(
                    Book.builder()
                            .title(p.title())
                            .author(p.author())
                            .description(p.description())
                            .price(BigDecimal.valueOf(p.price()))
                            .discountPrice(p.discountPrice() != null ? BigDecimal.valueOf(p.discountPrice()) : null)
                            .stockQuantity(p.stock())
                            .imageUrl(p.imageUrl())
                            .category(cat)
                            .seller(seller)
                            .status(BookStatus.ACTIVE)
                            .avgRating(p.avgRating())
                            .totalSold(p.totalSold())
                            .active(true)
                            .build()
            );
        }

        log.info("Seeded spotlight category '{}' with {} products", catName, products.size());
    }
}
