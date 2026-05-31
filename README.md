# Book Shop - Website Bán Sách Trực Tuyến

Website bán sách với đầy đủ tính năng: duyệt sách, giỏ hàng, đặt hàng, quản lý Seller và Admin.

---

## Chạy nhanh bằng Docker (Khuyến nghị)

> Chỉ cần cài **Docker Desktop**, không cần Java, Maven, Node, MySQL.

```bash
git clone https://github.com/cuongpham2345/book_shop_deploy.git
cd book_shop_deploy
docker compose up --build
```

Mở trình duyệt: **http://localhost:8080**

> Lần đầu build mất khoảng 3–5 phút. Lần sau chạy lại thì dùng `docker compose up` (không cần `--build`).

### Tài khoản có sẵn

| Email | Password | Vai trò |
|-------|----------|---------|
| admin@bookshop.com | 123456 | Admin |
| seller@bookshop.com | 123456 | Seller |
| user@bookshop.com | 123456 | User |

> Tài khoản mới: tự đăng ký tại trang `/register`

### Dừng ứng dụng

```bash
docker compose down
```

Muốn xóa luôn dữ liệu database (reset sạch):

```bash
docker compose down -v
```

---

## Chạy thủ công (không dùng Docker)

Yêu cầu: **Java 17+**, **Maven**, **Node.js 18+**, **MySQL 8**

### Bước 1 — Tạo database và import dữ liệu mẫu

```bash
mysql -u root -p -e "CREATE DATABASE book_shop_db CHARACTER SET utf8mb4;"
mysql -u root -p book_shop_db < data.sql
```

### Bước 2 — Cấu hình kết nối database

Sửa `backend/src/main/resources/application.yaml` nếu password MySQL khác mặc định:

```yaml
datasource:
  username: root
  password: 12345678   # đổi thành password MySQL của bạn
```

### Bước 3 — Chạy Backend

```bash
cd backend

# Mac / Linux
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

Backend chạy tại: **http://localhost:8080**

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
book_shop_deploy/
├── backend/                    # Spring Boot 3.5 REST API (Java 17)
│   └── src/main/
│       ├── java/buy_book/      # Source code
│       └── resources/
│           ├── application.yaml
│           └── certs/          # RSA key pair (JWT)
├── frontend/                   # React 19 + TypeScript + TailwindCSS
├── data.sql                    # Schema + dữ liệu mẫu
├── Dockerfile                  # Multi-stage build
├── docker-compose.yml          # Chạy app + MySQL cùng lúc
└── railway.json                # Cấu hình deploy Railway
```

## Công nghệ

| Phần | Công nghệ |
|------|-----------|
| Backend | Spring Boot 3.5, Spring Security, JWT (RSA), JPA/Hibernate |
| Frontend | React 19, TypeScript, Vite, TailwindCSS, React Router v7 |
| Database | MySQL 8 |
| Deploy | Docker, Railway |
