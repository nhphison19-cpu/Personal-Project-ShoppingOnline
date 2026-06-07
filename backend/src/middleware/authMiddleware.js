const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.token || req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: "ERROR",
                message: "Yêu cầu cung cấp Token xác thực.",
            });
        }

        console.log("Check token nhận được:", authHeader);

        // 🛠️ Xử lý cắt chuỗi an toàn: Chấp nhận cả "Bearer <token>" lẫn token thô
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        // Tiến hành giải mã Token
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    status: 'ERROR',
                    message: "Xác thực thất bại. Token không hợp lệ hoặc đã hết hạn."
                });
            }
            
            req.user = decoded; // Gắn dữ liệu đã giải mã (id, role...) vào req
            next(); // Cho phép đi tiếp qua middleware hoặc controller tiếp theo
        });

    } catch (e) { // 🛠️ Đã sửa từ error.message thành e.message để tránh crash server
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống trong quá trình xác thực: " + e.message,
        });
    }
};
module.exports = {
    authMiddleware
}