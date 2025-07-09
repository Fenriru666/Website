-- =================================================================
-- SCRIPT SQL HOÀN CHỈNH CHO OKAMI FOOD DATABASE
-- Tạo cơ sở dữ liệu, bảng, chèn dữ liệu mẫu và thêm cột payment_method
-- Ngày cập nhật: 02/07/2025
-- =================================================================

-- Bước 1: Tạo và chọn cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS okami_food_db;
USE okami_food_db;

-- ------------------------------------------------------------------
-- Bước 2: Xóa các bảng cũ theo đúng thứ tự (phụ thuộc khóa ngoại)
-- ------------------------------------------------------------------
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS user_carts;
DROP TABLE IF EXISTS mon_an;
DROP TABLE IF EXISTS khuyen_mai;
DROP TABLE IF EXISTS nguoi_dung;

-- ------------------------------------------------------------------
-- Bước 3: Tạo bảng NGƯỜI DÙNG (Users)
-- ------------------------------------------------------------------
CREATE TABLE nguoi_dung (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    joinDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatarUrl VARCHAR(512) DEFAULT 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg',
    role VARCHAR(50) NOT NULL DEFAULT 'customer'
);

-- Chèn dữ liệu mẫu cho bảng nguoi_dung
-- Mật khẩu đã được mã hóa (hash) sử dụng bcrypt, mật khẩu gốc cần được xác minh qua API
INSERT INTO nguoi_dung (id, fullName, email, password, phone, address, joinDate, role) VALUES
(1, 'Trần Văn An', 'an.tranvan@gmail.com', '$2b$10$ZfRqrSD3X5bIBXJ01Q79m.6Su4zCXE0YJXV5NfxmPENG4pI969UaW', '0901234567', '123 Đường ABC, Quận 1, TP. Hồ Chí Minh', '2024-01-15 00:00:00', 'customer'),
(2, 'Lê Khánh Luân', 'lle338227@gmail.com', '$2b$10$ZfRqrSD3X5bIBXJ01Q79m.6Su4zCXE0YJXV5NfxmPENG4pI969UaW', '0766895137', NULL, '2024-06-24 00:00:00', 'admin'),
(3, 'Nguyễn Thanh Trọng', 'Trong2402@gmail.com', '$2b$10$ZfRqrSD3X5bIBXJ01Q79m.6Su4zCXE0YJXV5NfxmPENG4pI969UaW', '0924022406', NULL, '2024-06-24 00:00:00', 'customer'),
(4, 'Huỳnh Văn Khuân', 'Khuan2506@gmail.com', '$2b$10$ZfRqrSD3X5bIBXJ01Q79m.6Su4zCXE0YJXV5NfxmPENG4pI969UaW', '0925062004', NULL, '2024-06-24 00:00:00', 'customer');

-- ------------------------------------------------------------------
-- Bước 4: Tạo bảng MÓN ĂN (Menu Items)
-- ------------------------------------------------------------------
CREATE TABLE mon_an (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 0) NOT NULL,
    imageUrl VARCHAR(512),
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE
);

-- Chèn dữ liệu mẫu cho bảng mon_an (38 món ăn)
INSERT INTO mon_an (id, name, description, price, imageUrl, category, is_featured) VALUES
(1, 'Pizza Hải Sản Đặc Biệt', 'Pizza với tôm tươi, mực ống, nghêu, thanh cua và sốt cà chua Pesto nhà làm, phủ phô mai Mozzarella hảo hạng.', 259000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60', 'Pizza', TRUE),
(2, 'Burger Bò Wagyu Phô Mai', 'Thịt bò Wagyu A5 xay nhuyễn, kẹp giữa bánh mì brioche nướng bơ, cùng phô mai Cheddar tan chảy, xà lách, cà chua và sốt đặc biệt.', 189000, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500&q=60', 'Burger', TRUE),
(3, 'Salad Caesar Gà Nướng', 'Ức gà nướng mềm thơm, xà lách Romain tươi giòn, bánh mì sấy bơ tỏi, phô mai Parmesan bào và sốt Caesar truyền thống.', 120000, 'https://www.sgtiepthi.vn/wp-content/uploads/2020/10/T3_caesar-salad-ga_shutterstock.jpg', 'Salad', TRUE),
(4, 'Mì Ý Sốt Bò Bằm', 'Sợi mì Ý dai ngon quyện cùng sốt bò bằm cà chua đậm đà, thêm chút lá húng quế và phô mai Parmesan.', 145000, 'https://images.unsplash.com/photo-1589227365533-cee630bd59bd?auto=format&fit=crop&w=500&q=60', 'Mỳ Ý', FALSE),
(5, 'Trà Chanh Dây Nha Đam', 'Trà xanh thanh mát kết hợp vị chua ngọt của chanh dây và những miếng nha đam giòn sần sật.', 45000, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/021/355/products/tra-xanh-chanh-leo-lo-hoi-1-28c280fd-e6ed-4ec5-864c-fe8e85175ae3.jpg?v=1570164190110', 'Đồ uống', FALSE),
(6, 'Cơm Phần Gà Rán', 'Một phần ăn đầy đặn bao gồm một miếng gà rán giòn rụm, ăn kèm với cơm trắng dẻo và salad bắp cải tươi mát.', 85000, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=60', 'Cơm', FALSE),
(7, 'Pizza Bò BBQ', 'Pizza với thịt bò nướng BBQ, hành tây, ớt chuông và sốt BBQ đặc trưng, phủ phô mai Mozzarella.', 239000, 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=500&q=60', 'Pizza', FALSE),
(8, 'Pizza Xúc Xích Ý', 'Pizza phủ đầy xúc xích Ý cay nhẹ, hành tây, và phô mai Mozzarella trên nền sốt cà chua truyền thống.', 249000, 'https://images.unsplash.com/photo-1604382355024-698b5b7b7c39?auto=format&fit=crop&w=500&q=60', 'Pizza', FALSE),
(9, 'Burger Gà Giòn Cay', 'Thịt gà phi lê tẩm ướp giòn tan, kèm sốt cay đặc biệt, rau xà lách tươi và cà chua.', 99000, 'https://images.unsplash.com/photo-1603903631895-263164200156?auto=format&fit=crop&w=500&q=60', 'Burger', FALSE),
(10, 'Salad Cá Ngừ Trộn Dầu Giấm', 'Cá ngừ ngâm dầu, trộn cùng xà lách, cà chua bi, dưa chuột và sốt dầu giấm chua ngọt thanh mát.', 110000, 'https://images.unsplash.com/photo-1505253758473-96720027d212?auto=format&fit=crop&w=500&q=60', 'Salad', FALSE),
(11, 'Mỳ Ý Sốt Cà Chua Xúc Xích', 'Sợi mì Ý dai ngon, kết hợp với xúc xích Ý, được xào trong sốt cà chua đậm đà và rắc thêm phô mai Parmesan.', 155000, 'https://images.unsplash.com/photo-1621996346565-e326b20f5451?auto=format&fit=crop&w=500&q=60', 'Mỳ Ý', FALSE),
(12, 'Nước Cam Ép Nguyên Chất', 'Nước cam tươi 100% ép tại chỗ, không đường, không chất bảo quản, giàu vitamin C.', 55000, 'https://images.unsplash.com/photo-1613478309399-6794729cf3c1?auto=format&fit=crop&w=500&q=60', 'Đồ uống', FALSE),
(13, 'Cơm Sườn Nướng Mật Ong', 'Sườn heo cốt lết nướng mật ong thơm lừng, mềm ngọt, ăn kèm cơm trắng và đồ chua.', 95000, 'https://images.unsplash.com/photo-1582576163090-09d3b6f54aac?auto=format&fit=crop&w=500&q=60', 'Cơm', FALSE),
(14, 'Khoai Tây Chiên Phô Mai', 'Khoai tây chiên giòn rụm, rắc bột phô mai béo ngậy, món ăn vặt không thể bỏ qua.', 60000, 'https://images.unsplash.com/photo-1630431340194-162872a0a2a1?auto=format&fit=crop&w=500&q=60', 'Khai vị', FALSE),
(15, 'Cánh Gà Sốt BBQ Cay', 'Cánh gà chiên vàng, áo đều lớp sốt BBQ cay đậm đà, kích thích vị giác.', 125000, 'https://images.unsplash.com/photo-1604648540090-b93196690c0f?auto=format&fit=crop&w=500&q=60', 'Khai vị', FALSE),
(16, 'Soda Chanh Bạc Hà', 'Soda mát lạnh kết hợp vị chua của chanh và hương thơm bạc hà sảng khoái.', 50000, 'https://images.unsplash.com/photo-1551024709-8f23eda2c5a5?auto=format&fit=crop&w=500&q=60', 'Đồ uống', FALSE),
(17, 'Pizza Pepperoni', 'Pizza Pepperoni cổ điển với lớp sốt cà chua đậm đà, phô mai Mozzarella và những lát xúc xích cay Pepperoni.', 219000, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=60', 'Pizza', FALSE),
(18, 'Pizza Thập Cẩm', 'Một sự kết hợp hoàn hảo của thịt nguội, xúc xích, hành tây, ớt chuông, nấm và oliu trên nền phô mai béo ngậy.', 269000, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=60', 'Pizza', FALSE),
(19, 'Pizza Rau Củ', 'Dành cho người ăn chay với sự kết hợp tươi mát của bông cải xanh, ớt chuông, hành tây, cà chua và nấm.', 199000, 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=500&q=60', 'Pizza', FALSE),
(20, 'Burger Gà Nướng', 'Ức gà được nướng mềm và thấm vị, ăn kèm với rau diếp, cà chua và sốt mayonnaise đặc biệt.', 119000, 'https://images.unsplash.com/photo-1596662951593-c1a41340725a?auto=format&fit=crop&w=500&q=60', 'Burger', FALSE),
(21, 'Burger 2 Tầng Bò Phô Mai', 'Thử thách cơn đói của bạn với hai lớp thịt bò nướng, hai lớp phô mai Cheddar, dưa chuột muối và sốt Okami.', 210000, 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=500&q=60', 'Burger', TRUE),
(22, 'Gà Rán Giòn (1 Miếng)', 'Một miếng gà tẩm ướp theo công thức đặc biệt, chiên giòn rụm bên ngoài, mềm ngọt bên trong.', 35000, 'https://images.unsplash.com/photo-1569058242253-92a9c5552db3?auto=format&fit=crop&w=500&q=60', 'Gà Rán', FALSE),
(23, 'Combo 3 Miếng Gà Rán', 'Combo tiết kiệm bao gồm 3 miếng gà rán giòn, ăn kèm khoai tây chiên và salad bắp cải.', 115000, 'https://images.unsplash.com/photo-1626645737590-705754408836?auto=format&fit=crop&w=500&q=60', 'Gà Rán', TRUE),
(24, 'Gà Popcorn', 'Những miếng gà không xương nhỏ xinh, giòn tan, hoàn hảo để chia sẻ cùng bạn bè.', 70000, 'https://images.unsplash.com/photo-1599923583393-947879176647?auto=format&fit=crop&w=500&q=60', 'Gà Rán', FALSE),
(25, 'Phô Mai Que', 'Phô mai Mozzarella que chiên xù, béo ngậy và kéo sợi, ăn kèm sốt cà chua.', 65000, 'https://images.unsplash.com/photo-1608219994243-f04a5b487d2c?auto=format&fit=crop&w=500&q=60', 'Khai vị', FALSE),
(26, 'Hành Vòng Chiên Giòn', 'Hành tây cắt khoanh, tẩm bột và chiên vàng giòn, món ăn kèm không thể thiếu.', 55000, 'https://images.unsplash.com/photo-1549836932-d434289541a2?auto=format&fit=crop&w=500&q=60', 'Khai vị', FALSE),
(27, 'Salad Bắp Cải Trộn', 'Salad bắp cải trộn với cà rốt và sốt kem, giúp cân bằng vị giác.', 40000, 'https://images.unsplash.com/photo-1604467794349-0b7428c5812c?auto=format&fit=crop&w=500&q=60', 'Salad', FALSE),
(28, 'Mỳ Ý Sốt Kem Nấm', 'Mỳ Ý sốt kem nấm béo ngậy, thơm lừng, một lựa chọn tuyệt vời cho người ăn chay.', 135000, 'https://images.unsplash.com/photo-1621996346565-e326b20f5451?auto=format&fit=crop&w=500&q=60', 'Mỳ Ý', FALSE),
(29, 'Cơm Bò Teriyaki', 'Thịt bò thái mỏng xào với sốt Teriyaki mặn ngọt đặc trưng của Nhật Bản, rắc thêm mè rang.', 125000, 'https://images.unsplash.com/photo-1615385563914-8774ab753a1d?auto=format&fit=crop&w=500&q=60', 'Cơm', FALSE),
(30, 'Cơm Gà Sốt Chua Ngọt', 'Thịt gà phi lê chiên giòn, rưới sốt chua ngọt cùng với dứa, hành tây và ớt chuông.', 110000, 'https://images.unsplash.com/photo-1598514983318-2f64f12be986?auto=format&fit=crop&w=500&q=60', 'Cơm', FALSE),
(31, 'Coca-Cola', 'Nước ngọt có gas giải khát tức thì.', 25000, 'https://images.unsplash.com/photo-1622483767028-3f66f32a64ba?auto=format&fit=crop&w=500&q=60', 'Đồ uống', FALSE),
(32, 'Sprite', 'Nước ngọt có gas hương chanh sảng khoái.', 25000, 'https://images.unsplash.com/photo-1625772242360-a6475b77893c?auto=format&fit=crop&w=500&q=60', 'Đồ uống', FALSE),
(33, 'Trà Chanh', 'Trà chanh truyền thống, giải nhiệt và thanh lọc cơ thể.', 35000, 'https://images.unsplash.com/photo-1556679343-c7306c80d41d?auto=format&fit=crop&w=500&q=60', 'Đồ uống', FALSE),
(34, 'Sữa Lắc Sôcôla', 'Sữa tươi xay cùng sôcôla và kem béo, ngọt ngào và hấp dẫn.', 65000, 'https://images.unsplash.com/photo-1600718374537-83b3353cf4a5?auto=format&fit=crop&w=500&q=60', 'Đồ uống', FALSE),
(35, 'Bánh Táo Nướng Mini', 'Bánh nướng nhỏ xinh với nhân táo và quế thơm lừng.', 45000, 'https://images.unsplash.com/photo-1618915865516-e3c31825a344?auto=format&fit=crop&w=500&q=60', 'Tráng miệng', FALSE),
(36, 'Kem Ly Vani', 'Một ly kem vani mát lạnh, đơn giản nhưng không kém phần hấp dẫn.', 30000, 'https://images.unsplash.com/photo-1570197788417-0e82375c934d?auto=format&fit=crop&w=500&q=60', 'Tráng miệng', FALSE),
(37, 'Bánh Donut Sôcôla', 'Bánh donut mềm xốp phủ một lớp sôcôla bóng mịn và rắc hạt cốm nhiều màu sắc.', 35000, 'https://images.unsplash.com/photo-1551024601-bec78d8d590d?auto=format&fit=crop&w=500&q=60', 'Tráng miệng', FALSE),
(38, 'Nước Suối', 'Nước suối tinh khiết.', 15000, 'https://images.unsplash.com/photo-1543274266-993d50897510?auto=format&fit=crop&w=500&q=60', 'Đồ uống', FALSE);

-- ------------------------------------------------------------------
-- Bước 5: Tạo bảng KHUYẾN MÃI (Promotions)
-- ------------------------------------------------------------------
CREATE TABLE khuyen_mai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(512),
    validity VARCHAR(255),
    promoCode VARCHAR(100),
    type VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE
);

-- Chèn dữ liệu mẫu cho bảng khuyen_mai (6 khuyến mãi)
INSERT INTO khuyen_mai (id, title, description, imageUrl, validity, promoCode, type, is_featured) VALUES
(1, 'Thứ Ba Vui Vẻ - Giảm 20% Pizza', 'Tận hưởng ngày Thứ Ba thật trọn vẹn với ưu đãi giảm ngay 20% cho tất cả các loại Pizza cỡ vừa và lớn.', 'https://images.unsplash.com/photo-1593504049358-7433075516a8?auto=format&fit=crop&w=500&q=60', 'Chỉ áp dụng vào các ngày Thứ Ba', 'PIZZATUESDAY', 'Giảm Giá', TRUE),
(2, 'Combo Gia Đình Siêu Tiết Kiệm', 'Gói combo hoàn hảo cho cả gia đình bao gồm 2 Pizza cỡ lớn, 1 phần Gà Rán (6 miếng) và 1 chai nước ngọt 1.5L.', 'https://images.unsplash.com/photo-1627923985677-17639c493f47?auto=format&fit=crop&w=500&q=60', 'Đến hết tháng này.', NULL, 'Combo', TRUE),
(3, 'Mua 1 Tặng 1 - Đồ Uống Giải Nhiệt', 'Chào hè sảng khoái! Mua 1 ly Trà Chanh Dây Nha Đam hoặc Trà Đào Cam Sả, tặng ngay 1 ly cùng loại.', 'https://images.unsplash.com/photo-1625943550300-15a4f68708f0?auto=format&fit=crop&w=500&q=60', 'Đến hết ngày 15 tháng sau.', 'BOGODRINK', 'Mua 1 Tặng 1', TRUE),
(4, 'Giảm Giá Đặc Biệt cho Sinh Viên', 'Chỉ cần xuất trình thẻ sinh viên, nhận ngay ưu đãi giảm 15% trên tổng hóa đơn.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&q=60', 'Quanh năm.', NULL, 'Giảm Giá', FALSE),
(5, 'Ưu đãi khai trương - Giảm 50% toàn bộ menu', 'Nhân dịp khai trương chi nhánh mới, Okami Food giảm giá 50% cho tất cả các món trong thực đơn.', 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=500&q=60', 'Chỉ trong 3 ngày khai trương.', 'GRANDOPENING', 'Sự kiện đặc biệt', FALSE),
(6, 'Cuối Tuần Thả Ga - Giảm 15% Burger', 'Áp dụng cho tất cả Burger vào Thứ Bảy và Chủ Nhật hàng tuần.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=60', 'Thứ Bảy, Chủ Nhật hàng tuần', 'WEEKEND15', 'Giảm Giá', FALSE);

-- ------------------------------------------------------------------
-- Bước 6: Tạo bảng ĐƠN HÀNG (Orders)
-- ------------------------------------------------------------------
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 0) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE
);

-- Chèn dữ liệu mẫu cho bảng orders (3 đơn hàng)
INSERT INTO orders (user_id, customer_name, customer_address, customer_phone, total_price, status, order_date) VALUES
(1, 'Trần Văn An', '123 Đường ABC, Quận 1, TP.HCM', '0901234567', 448000, 'Completed', NOW() - INTERVAL 5 DAY),
(1, 'Trần Văn An', '123 Đường ABC, Quận 1, TP.HCM', '0901234567', 265000, 'Completed', NOW() - INTERVAL 3 DAY),
(1, 'Trần Văn An', '123 Đường ABC, Quận 1, TP.HCM', '0901234567', 189000, 'Pending', NOW() - INTERVAL 1 DAY);

-- ------------------------------------------------------------------
-- Bước 7: Tạo bảng MỤC ĐƠN HÀNG (Order Items)
-- ------------------------------------------------------------------
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 0) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES mon_an(id) ON DELETE CASCADE
);

-- Chèn dữ liệu mẫu cho bảng order_items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
-- Đơn hàng 1 (id = 1, tổng 448000)
(1, 1, 1, 259000), -- Pizza Hải Sản
(1, 2, 1, 189000), -- Burger Bò
-- Đơn hàng 2 (id = 2, tổng 265000)
(2, 4, 1, 145000), -- Mỳ Ý
(2, 12, 2, 55000), -- Nước Cam
-- Đơn hàng 3 (id = 3, tổng 189000)
(3, 9, 1, 99000),  -- Burger Gà
(3, 14, 1, 60000); -- Khoai Tây Chiên

-- ------------------------------------------------------------------
-- Bước 8: Tạo bảng GIỎ HÀNG (User Carts)
-- ------------------------------------------------------------------
CREATE TABLE user_carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES mon_an(id) ON DELETE CASCADE,
    UNIQUE KEY user_product_unique (user_id, product_id)
);

-- Hiện tại không có dữ liệu mẫu cho giỏ hàng, có thể thêm nếu cần
-- Ví dụ:
-- INSERT INTO user_carts (user_id, product_id, quantity) VALUES
-- (1, 1, 2), -- Trần Văn An thêm 2 Pizza Hải Sản vào giỏ
-- (1, 5, 1); -- Trần Văn An thêm 1 Trà Chanh Dây Nha Đam

-- ------------------------------------------------------------------
-- Bước 9: Thêm cột payment_method vào bảng ĐƠN HÀNG (Orders)
-- ------------------------------------------------------------------
ALTER TABLE orders
ADD COLUMN payment_method VARCHAR(50) NOT NULL DEFAULT 'cod' AFTER status;

-- Cập nhật dữ liệu mẫu cho cột payment_method trong bảng orders
UPDATE orders SET payment_method = 'cod' WHERE id IN (1, 2, 3);

-- =================================================================
-- KẾT THÚC SCRIPT
-- =================================================================