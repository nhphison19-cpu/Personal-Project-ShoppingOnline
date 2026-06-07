const jwt = require('jsonwebtoken')
const dotenv =  require('dotenv')
const prisma = require('../prisma/prismaClient')

dotenv.config()

const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: "ERROR",
                message: "Không tìm thấy thông tin định danh. Vui lòng gọi authMiddleware trước!"
            });
        }

        console.log("Kiểm tra quyền truy cập ADMIN cho User ID:", req.user.id);

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                status: "ERROR",
                message: "Quyền truy cập bị từ chối. Tính năng này chỉ dành cho tài khoản ADMIN.",
            });
        }

        next(); // Đạt chuẩn ADMIN, cho phép đi tiếp vào Controller nghiệp vụ
    } catch (e) {
        return res.status(500).json({
            status: "ERROR",
            message: "Lỗi hệ thống phân quyền: " + e.message,
        });
    }
};
module.exports = { adminMiddleware}