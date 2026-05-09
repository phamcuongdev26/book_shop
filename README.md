# Book Shop - Website Bán Sách

Website bán sách trực tuyến với đầy đủ tính năng: duyệt sách, giỏ hàng, đặt hàng, quản lý admin.

## Yêu cầu

| Công cụ | Phiên bản |
|---------|-----------|
| Java    | 17+       |
| Maven   | 3.8+ (hoặc dùng `mvnw` có sẵn) |
| MySQL   | 8.0+      |
| Node.js | 18+       |
| npm     | 9+        |

---

## Cách chạy

### Bước 1 — Tạo database và import dữ liệu mẫu

```sql
CREATE DATABASE book_shop_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Sau đó import toàn bộ schema + dữ liệu mẫu:

```bash
mysql -u root -p book_shop_db < backend/src/main/resources/data.sql
```

> File `data.sql` chứa đầy đủ: bảng, sách, danh mục, tài khoản mẫu.

### Bước 2 — Cấu hình kết nối database

Mở file `backend/src/main/resources/application.yaml` và sửa phần sau nếu cần:

```yaml
datasource:
  username: root          # username MySQL của bạn
  password: 12345678      # password MySQL của bạn
```

Hoặc truyền qua biến môi trường:

```bash
export DB_USERNAME=root
export DB_PASSWORD=your_password
```

### Bước 3 — Chạy Backend

```bash
cd backend

# Windows
mvnw.cmd spring-boot:run

# Mac / Linux
./mvnw spring-boot:run
```

Backend chạy tại: **http://localhost:8080**

**Tài khoản mặc định:**

| Username   | Password   | Vai trò |
|------------|------------|---------|
| admin      | Admin1234  | Admin   |
| levanc     | Pass1234   | User    |
| phamthid   | Pass1234   | User    |
| hoangvane  | Pass1234   | User    |
| tranthib   | Pass1234   | User    |
| nguyenvana | Pass1234   | User    |

### Bước 4 — Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: **http://localhost:5173**

---

## Cấu trúc dự án

```
book/
├── backend/          # Spring Boot 3.5 REST API (Java 17)
│   └── src/
│       ├── main/java/buy_book/    # Source code
│       └── main/resources/
│           ├── application.yaml   # Cấu hình chính
│           ├── data.sql           # Schema + dữ liệu mẫu
│           └── certs/             # RSA key pair (JWT)
└── frontend/         # React + Vite + TailwindCSS
    └── src/
```

## API

- Backend: `http://localhost:8080`
- Frontend proxy: Vite tự động chuyển `/api/*` → `http://localhost:8080`
- Swagger / Docs: chưa cấu hình (xem source code controller)

---

## Lưu ý

- `data.sql` cần import thủ công một lần duy nhất vào MySQL. Sau đó backend tự quản lý schema qua `ddl-auto: update`.
- RSA key pair trong `certs/` chỉ dùng cho mục đích học tập.
