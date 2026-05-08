-- Run this in MySQL Workbench against book_shop_db
CREATE TABLE IF NOT EXISTS notifications (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT       NOT NULL,
    title            VARCHAR(255) NOT NULL,
    message          VARCHAR(1000) NOT NULL,
    type             VARCHAR(50)  NOT NULL,
    is_read          BOOLEAN      NOT NULL DEFAULT FALSE,
    related_order_id BIGINT,
    related_order_code VARCHAR(30),
    created_at       DATETIME,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
