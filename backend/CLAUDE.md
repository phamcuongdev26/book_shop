# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run

# Run tests
mvn test

# Run a single test class
mvn test -Dtest=ClassName

# Skip tests during build
mvn clean package -DskipTests
```

The server starts on **port 8080**. Requires a MySQL database named `book_shop_db` running on localhost:3306. DDL is set to `none` — schema must be created manually before first run.

On startup, a default admin account is created: `admin` / `Admin1234`.

## Architecture

Spring Boot 3.5.4 REST API (Java 17) following a layered architecture:

```
Controller → Service (interface + impl) → Repository → Entity
```

All responses are wrapped in `ApiResponse<T>`. Paginated results use `PageResponse<T>`.

### Authentication

JWT-based via Spring Security OAuth2 Resource Server. RSA key pair lives in `src/main/resources/certs/`. Tokens carry a `scope` claim set to the user's role name (USER/SELLER/ADMIN). Token expiry is 24 hours.

Public endpoints (no token required): `POST /api/auth/**`, `GET /api/books/**`, `GET /api/categories/**`.

### Role System

Three roles — `USER`, `SELLER`, `ADMIN`:
- `USER`: cart and order operations
- `SELLER`: create/edit/delete own books (`/api/seller/books/**`); ADMIN also has seller access
- `ADMIN`: full user management and all order management (`/api/admin/**`)

### Error Handling

All exceptions flow through `GlobalExceptionHandler` (`@RestControllerAdvice`). Use `AppException(ErrorCode.XXX)` to throw business errors. `ErrorCode` enum defines HTTP status + numeric error code for each error case.

### Key Domain Flows

**Checkout** (`OrderServiceImpl.checkout`): validates cart items exist, checks stock, creates Order + OrderItems, decrements `stockQuantity` on each Book, clears the cart — all within a single `@Transactional`.

**Book search** (`BookRepository`): custom JPQL queries handle keyword search on title/author and price range filtering.

**Cart**: one Cart per user (enforced by unique constraint on `userId`). Cart is created lazily on first `add to cart` call.

## Package Structure

Main package: `buy_book`

| Package | Purpose |
|---|---|
| `controller` | REST endpoints |
| `service` / `service.impl` | Business logic |
| `entity` | JPA entities (direct DB mapping) |
| `repository` | Spring Data JPA DAOs |
| `dto.request` / `dto.response` | JSON in/out objects |
| `constant` | Enums: `Role`, `BookStatus`, `OrderStatus`, `PaymentMethod`, `PaymentStatus` |
| `exception` | `ErrorCode`, `AppException`, `GlobalExceptionHandler` |
| `configuration` | `SecurityConfig`, `ApplicationConfig` (startup admin seeding) |
| `properties` | `RsaKeyConfigProperties` |
