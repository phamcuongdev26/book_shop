package buy_book.controller;


import buy_book.dto.request.CategoryRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.CategoryResponse;
import buy_book.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    // PUBLIC
    @GetMapping("/api/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.<List<CategoryResponse>>builder()
                .code(200)
                .data(categoryService.getAllCategories())
                .build());
    }

    @GetMapping("/api/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .code(200)
                .data(categoryService.getCategoryById(id))
                .build());
    }

    // ADMIN only
    @PostMapping("/api/admin/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .code(200)
                .message("Thêm danh mục thành công")
                .data(categoryService.createCategory(request))
                .build());
    }

    @PutMapping("/api/admin/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .code(200)
                .message("Cập nhật danh mục thành công")
                .data(categoryService.updateCategory(id, request))
                .build());
    }

    @DeleteMapping("/api/admin/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa danh mục thành công")
                .build());
    }
}