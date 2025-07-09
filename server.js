require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// === Cấu hình ===
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Cấu hình DB
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Hàm query database
async function queryDatabase(sql, params, connection) {
  if (connection) return (await connection.execute(sql, params))[0];
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute(sql, params);
  await conn.end();
  return rows;
}

// Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không tìm thấy token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
    req.user = decoded.user;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Truy cập bị từ chối. Yêu cầu quyền quản trị viên.' });
};

// Hàm xử lý lỗi chung
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ message });
};

// === API Công khai ===
app.get('/api/menu', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM mon_an ORDER BY id');
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi lấy dữ liệu món ăn');
  }
});

app.get('/api/promotions', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM khuyen_mai ORDER BY id');
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi lấy dữ liệu khuyến mãi');
  }
});

app.get('/api/menu/featured', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM mon_an WHERE is_featured = TRUE LIMIT 3');
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi lấy dữ liệu món ăn nổi bật');
  }
});

app.get('/api/promotions/featured', async (req, res) => {
  try {
    const rows = await queryDatabase('SELECT * FROM khuyen_mai WHERE is_featured = TRUE LIMIT 3');
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi lấy dữ liệu khuyến mãi nổi bật');
  }
});

app.get('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await queryDatabase('SELECT * FROM mon_an WHERE id = ?', [id]);
    if (rows.length > 0) return res.json(rows[0]);
    res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  } catch (error) {
    handleError(res, error, `Lỗi máy chủ khi lấy chi tiết sản phẩm ${id}`);
  }
});

app.get('/api/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await queryDatabase('SELECT * FROM khuyen_mai WHERE id = ?', [id]);
    if (rows.length > 0) return res.json(rows[0]);
    res.status(404).json({ message: 'Không tìm thấy chương trình khuyến mãi' });
  } catch (error) {
    handleError(res, error, `Lỗi máy chủ khi lấy chi tiết khuyến mãi ${id}`);
  }
});

// === API Xác thực & Hồ sơ ===
app.post('/api/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
  try {
    const existingUser = await queryDatabase('SELECT * FROM nguoi_dung WHERE email = ?', [email]);
    if (existingUser.length > 0) return res.status(409).json({ message: 'Email này đã được sử dụng.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await queryDatabase('INSERT INTO nguoi_dung (fullName, email, password) VALUES (?, ?, ?)', [fullName, email, hashedPassword]);
    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ, vui lòng thử lại sau.');
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
  try {
    const [user] = await queryDatabase('SELECT * FROM nguoi_dung WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    const payload = { user: { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    delete user.password;
    res.json({ message: 'Đăng nhập thành công!', token, user });
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi đăng nhập.');
  }
});

app.put('/api/profile', verifyToken, upload.single('avatar'), async (req, res) => {
    const { fullName, phone, address } = req.body;
    const fieldsToUpdate = {};

    if (fullName !== undefined) fieldsToUpdate.fullName = fullName;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (address !== undefined) fieldsToUpdate.address = address;

    // Logic quan trọng: Nếu có file mới được upload, thêm đường dẫn vào object để cập nhật
    if (req.file) {
        fieldsToUpdate.avatarUrl = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'Không có thông tin nào để cập nhật.' });
    }

    try {
        const setClauses = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
        await queryDatabase(`UPDATE nguoi_dung SET ${setClauses} WHERE id = ?`, [...Object.values(fieldsToUpdate), req.user.id]);
        
        const [updatedUser] = await queryDatabase('SELECT id, fullName, email, phone, address, joinDate, avatarUrl, role FROM nguoi_dung WHERE id = ?', [req.user.id]);
        res.json({ message: 'Cập nhật thông tin thành công!', user: updatedUser });
    } catch (error) { 
        console.error("Lỗi khi cập nhật profile:", error);
        res.status(500).json({ message: 'Lỗi máy chủ' }); 
    }
});

app.put('/api/profile/change-password', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
  try {
    const [user] = await queryDatabase('SELECT password FROM nguoi_dung WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu hiện tại không chính xác.' });
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    await queryDatabase('UPDATE nguoi_dung SET password = ? WHERE id = ?', [newHashedPassword, userId]);
    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi đổi mật khẩu.');
  }
});

app.get('/api/payment-info', verifyToken, (req, res) => {
  try {
    const paymentInfo = {
      accountName: process.env.BANK_ACCOUNT_NAME,
      accountNumber: process.env.BANK_ACCOUNT_NUMBER,
      bankName: process.env.BANK_NAME,
      qrInfo: process.env.BANK_QR_INFO,
    };
    res.json(paymentInfo);
  } catch (error) {
    handleError(res, error, 'Lỗi khi lấy thông tin thanh toán.');
  }
});

// === API Giỏ hàng ===
app.get('/api/cart', verifyToken, async (req, res) => {
  try {
    const cartItems = await queryDatabase('SELECT p.*, uc.quantity FROM user_carts uc JOIN mon_an p ON uc.product_id = p.id WHERE uc.user_id = ?', [req.user.id]);
    res.json(cartItems);
  } catch (error) {
    handleError(res, error, 'Lỗi khi lấy giỏ hàng từ cơ sở dữ liệu.');
  }
});

app.post('/api/cart', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    await queryDatabase('INSERT INTO user_carts (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)', [req.user.id, productId, quantity]);
    res.status(200).json({ message: 'Giỏ hàng đã được cập nhật.' });
  } catch (error) {
    handleError(res, error, 'Lỗi khi cập nhật giỏ hàng.');
  }
});

app.put('/api/cart/item', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity === undefined) return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc số lượng.' });
  const newQuantity = parseInt(quantity, 10);
  if (isNaN(newQuantity) || newQuantity < 0) return res.status(400).json({ message: 'Số lượng không hợp lệ.' });
  try {
    if (newQuantity === 0) {
      await queryDatabase('DELETE FROM user_carts WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
    } else {
      await queryDatabase('UPDATE user_carts SET quantity = ? WHERE user_id = ? AND product_id = ?', [newQuantity, req.user.id, productId]);
    }
    res.status(200).json({ message: 'Cập nhật số lượng thành công.' });
  } catch (error) {
    handleError(res, error, 'Lỗi khi cập nhật số lượng sản phẩm.');
  }
});

app.delete('/api/cart', verifyToken, async (req, res) => {
  try {
    await queryDatabase('DELETE FROM user_carts WHERE user_id = ?', [req.user.id]);
    res.status(200).json({ message: 'Đã xóa giỏ hàng.' });
  } catch (error) {
    handleError(res, error, 'Lỗi khi xóa giỏ hàng.');
  }
});

app.post('/api/cart/merge', verifyToken, async (req, res) => {
  const { cartItems } = req.body;
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) return res.status(400).json({ message: 'Không có sản phẩm để hợp nhất.' });
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.beginTransaction();
    const query = 'INSERT INTO user_carts (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)';
    for (const item of cartItems) {
      await connection.execute(query, [req.user.id, item.id, item.quantity]);
    }
    await connection.commit();
    res.status(200).json({ message: 'Hợp nhất giỏ hàng thành công.' });
  } catch (error) {
    await connection.rollback();
    handleError(res, error, 'Lỗi khi hợp nhất giỏ hàng.');
  } finally {
    await connection.end();
  }
});

// === API Đơn hàng ===
app.post('/api/orders', verifyToken, async (req, res) => {
  const { customerInfo, cartItems, totalPrice, paymentMethod } = req.body;
  const userId = req.user.id;
  if (!customerInfo || !cartItems || cartItems.length === 0 || !totalPrice || !paymentMethod) {
    return res.status(400).json({ message: 'Dữ liệu đơn hàng không hợp lệ.' });
  }
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();
    const initialStatus = paymentMethod === 'bank_transfer' ? 'Awaiting Payment' : 'Pending';
    const orderQuery = 'INSERT INTO orders (user_id, customer_name, customer_address, customer_phone, total_price, status, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [orderResult] = await connection.execute(orderQuery, [userId, customerInfo.fullName, customerInfo.address, customerInfo.phone, totalPrice, initialStatus, paymentMethod]);
    const newOrderId = orderResult.insertId;
    const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
    const orderItemsValues = cartItems.map(item => [newOrderId, item.id, item.quantity, item.price]);
    await connection.query(orderItemsQuery, [orderItemsValues]);
    await connection.execute('DELETE FROM user_carts WHERE user_id = ?', [userId]);
    await connection.commit();
    res.status(201).json({ message: 'Đặt hàng thành công!', orderId: newOrderId });
  } catch (error) {
    if (connection) await connection.rollback();
    handleError(res, error, 'Lỗi máy chủ khi tạo đơn hàng.');
  } finally {
    if (connection) await connection.end();
  }
});

app.get('/api/orders/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await queryDatabase('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [req.user.id]);
    if (orders.length === 0) return res.json([]);
    const orderIds = orders.map(o => o.id);
    const items = await queryDatabase('SELECT oi.*, p.name as productName, p.imageUrl as productImageUrl FROM order_items oi JOIN mon_an p ON oi.product_id = p.id WHERE oi.order_id IN (?)', [orderIds]);
    const ordersWithItems = orders.map(order => ({ ...order, items: items.filter(item => item.order_id === order.id) }));
    res.json(ordersWithItems);
  } catch (error) {
    handleError(res, error, 'Lỗi khi lấy lịch sử đơn hàng.');
  }
});

app.get('/api/orders/:orderId', verifyToken, async (req, res) => {
  const { orderId } = req.params;
  try {
    const [order] = await queryDatabase('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, req.user.id]);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.' });
    const items = await queryDatabase('SELECT oi.*, p.name as productName, p.imageUrl as productImageUrl FROM order_items oi JOIN mon_an p ON oi.product_id = p.id WHERE oi.order_id = ?', [orderId]);
    res.json({ ...order, items });
  } catch (error) {
    handleError(res, error, `Lỗi máy chủ khi lấy chi tiết đơn hàng ${orderId}`);
  }
});

app.put('/api/orders/:orderId/cancel', verifyToken, async (req, res) => {
  const { orderId } = req.params;
  try {
    const [order] = await queryDatabase('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, req.user.id]);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.' });
    const cancellableStatuses = ['Pending', 'Awaiting Payment'];
    if (!cancellableStatuses.includes(order.status)) return res.status(403).json({ message: 'Không thể hủy đơn hàng ở trạng thái này. Vui lòng liên hệ hỗ trợ.' });
    await queryDatabase("UPDATE orders SET status = 'Cancelled' WHERE id = ?", [orderId]);
    res.status(200).json({ message: 'Đơn hàng đã được hủy thành công.' });
  } catch (error) {
    handleError(res, error, `Lỗi máy chủ khi hủy đơn hàng ${orderId}`);
  }
});

// === API Admin ===
app.post('/api/admin/products', verifyToken, verifyAdmin, upload.single('imageUrl'), async (req, res) => {
  const { name, description, price, category, is_featured } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await queryDatabase('INSERT INTO mon_an (name, description, price, category, is_featured, imageUrl) VALUES (?, ?, ?, ?, ?, ?)', [name, description, price, category, is_featured === 'true', imageUrl]);
    res.status(201).json({ message: 'Thêm món ăn thành công.' });
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi thêm món ăn.');
  }
});

app.put('/api/admin/products/:id', verifyToken, verifyAdmin, upload.single('imageUrl'), async (req, res) => {
    const { name, description, price, category, is_featured } = req.body;
    const fieldsToUpdate = {};

    if (name !== undefined) fieldsToUpdate.name = name;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (price !== undefined) fieldsToUpdate.price = price;
    if (category !== undefined) fieldsToUpdate.category = category;
    if (is_featured !== undefined) fieldsToUpdate.is_featured = (is_featured === 'true');

    // Logic quan trọng: Nếu có file mới, cập nhật đường dẫn ảnh
    if (req.file) {
        fieldsToUpdate.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'Không có thông tin để cập nhật.' });
    }

    try {
        const setClauses = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
        await queryDatabase(`UPDATE mon_an SET ${setClauses} WHERE id = ?`, [...Object.values(fieldsToUpdate), req.params.id]);
        res.status(200).json({ message: 'Cập nhật món ăn thành công.' });
    } catch (error) { 
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        res.status(500).json({ message: 'Lỗi máy chủ' }); 
    }
});

app.delete('/api/admin/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await queryDatabase('DELETE FROM mon_an WHERE id = ?', [id]);
    res.status(200).json({ message: 'Xóa món ăn thành công.' });
  } catch (error) {
    handleError(res, error, `Lỗi máy chủ khi xóa món ăn ${id}`);
  }
});

app.get('/api/admin/orders', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await queryDatabase('SELECT * FROM orders ORDER BY order_date DESC');
    res.json(orders);
  } catch (error) {
    handleError(res, error, 'Lỗi khi lấy danh sách đơn hàng.');
  }
});

app.put('/api/admin/orders/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ['Awaiting Payment', 'Pending', 'Preparing', 'Shipped', 'Completed', 'Cancelled'];
  if (!status || !allowedStatuses.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
  try {
    await queryDatabase('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công.' });
  } catch (error) {
    handleError(res, error, `Lỗi máy chủ khi cập nhật trạng thái ${id}`);
  }
});

app.post('/api/admin/promotions', verifyToken, verifyAdmin, upload.single('imageUrl'), async (req, res) => {
  const { title, description, validity, promoCode, type, is_featured } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await queryDatabase('INSERT INTO khuyen_mai (title, description, validity, promoCode, type, is_featured, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, description, validity, promoCode, type, is_featured === 'true', imageUrl]);
    res.status(201).json({ message: 'Thêm khuyến mãi thành công.' });
  } catch (error) {
    handleError(res, error, 'Lỗi máy chủ khi thêm khuyến mãi.');
  }
});

app.put('/api/admin/promotions/:id', verifyToken, verifyAdmin, upload.single('imageUrl'), async (req, res) => {
    const { title, description, validity, promoCode, type, is_featured } = req.body;
    const fieldsToUpdate = {};

    if (title !== undefined) fieldsToUpdate.title = title;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (validity !== undefined) fieldsToUpdate.validity = validity;
    if (promoCode !== undefined) fieldsToUpdate.promoCode = promoCode;
    if (type !== undefined) fieldsToUpdate.type = type;
    if (is_featured !== undefined) fieldsToUpdate.is_featured = (is_featured === 'true');

    // Logic quan trọng: Nếu có file mới, cập nhật đường dẫn ảnh
    if (req.file) {
        fieldsToUpdate.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'Không có thông tin để cập nhật.' });
    }
    
    try {
        const setClauses = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
        await queryDatabase(`UPDATE khuyen_mai SET ${setClauses} WHERE id = ?`, [...Object.values(fieldsToUpdate), req.params.id]);
        res.status(200).json({ message: 'Cập nhật khuyến mãi thành công.' });
    } catch (error) { 
        console.error("Lỗi khi cập nhật khuyến mãi:", error);
        res.status(500).json({ message: 'Lỗi máy chủ' }); 
    }
});

app.delete('/api/admin/promotions/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await queryDatabase('DELETE FROM khuyen_mai WHERE id = ?', [id]);
    res.status(200).json({ message: 'Xóa khuyến mãi thành công.' });
  } catch (error) {
    handleError(res, error, `Lỗi máy chủ khi xóa khuyến mãi ${id}`);
  }
});

app.get('/api/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [totalRevenue] = await queryDatabase("SELECT SUM(total_price) as totalRevenue FROM orders WHERE status = 'Completed'");
    const [todayOrders] = await queryDatabase("SELECT COUNT(*) as todayOrders FROM orders WHERE DATE(order_date) = CURDATE()");
    const [totalUsers] = await queryDatabase("SELECT COUNT(*) as totalUsers FROM nguoi_dung");
    const weeklyRevenue = await queryDatabase(`
      SELECT DATE_FORMAT(order_date, '%Y-%m-%d') as date, SUM(total_price) as revenue
      FROM orders WHERE status = 'Completed' AND order_date >= CURDATE() - INTERVAL 7 DAY
      GROUP BY DATE_FORMAT(order_date, '%Y-%m-%d') ORDER BY date ASC
    `);
    res.json({
      totalRevenue: totalRevenue.totalRevenue || 0,
      todayOrders: todayOrders.todayOrders,
      totalUsers: totalUsers.totalUsers,
      weeklyRevenue,
    });
  } catch (error) {
    handleError(res, error, 'Lỗi khi lấy dữ liệu thống kê.');
  }
});

// === Khởi động server ===
app.listen(port, () => {
  console.log(`Backend server đang chạy tại http://localhost:${port}`);
}); 