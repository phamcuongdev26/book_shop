package buy_book.specification;

import buy_book.entity.Book;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class BookSpecification {

    public static Specification<Book> filter(
            String title,
            String author,
            Integer publishYear,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Long categoryId,
            Boolean hasDiscount
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isTrue(root.get("active")));

            if (title != null && !title.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")),
                        "%" + title.trim().toLowerCase() + "%"));
            }
            if (author != null && !author.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("author")),
                        "%" + author.trim().toLowerCase() + "%"));
            }
            if (publishYear != null) {
                predicates.add(cb.equal(root.get("publishYear"), publishYear));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (Boolean.TRUE.equals(hasDiscount)) {
                predicates.add(cb.and(
                    cb.isNotNull(root.get("discountPrice")),
                    cb.lessThan(root.get("discountPrice"), root.get("price"))
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}