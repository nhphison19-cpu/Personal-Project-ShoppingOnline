const momoService = require('../../services/Payment/MomoService');

/**
 * API: Tạo yêu cầu thanh toán
 * POST /api/payment/momo
 */
const initPayment = async (req, res) => {
    try {
        const { userId, amount, shippingAddress } = req.body;

        // BƯỚC VALIDATE (Nhiệm vụ của Controller)
        if (!userId || !amount) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin userId hoặc số tiền (amount)." });
        }
        if (amount < 1000) {
            return res.status(400).json({ success: false, message: "Số tiền tối thiểu thanh toán qua MoMo là 1,000 VND." });
        }

        // GỌI XỬ LÝ NGHIỆP VỤ (Nhiệm vụ của Service)
        const momoData = await momoService.createPaymentUrl(userId, amount, shippingAddress);

        if (momoData.resultCode === 0) {
            return res.status(200).json({
                success: true,
                message: "Khởi tạo cổng thanh toán thành công.",
                payUrl: momoData.payUrl,         // Link dẫn đến trang quét mã của MoMo
                deeplink: momoData.deeplink,     // Dành cho thiết bị di động để mở thẳng App MoMo
                orderId: momoData.orderId        // ID đơn hàng hệ thống của bạn để Client theo dõi
            });
        } else {
            return res.status(422).json({
                success: false,
                message: momoData.message,
                momoCode: momoData.resultCode
            });
        }

    } catch (error) {
        if (error.message === "MOMO_CONNECTION_FAILED") {
            return res.status(502).json({ success: false, message: "Lỗi kết nối bên cổng MoMo, vui lòng thử lại sau." });
        }
        return res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
    }
};

/**
 * API: Tiếp nhận tín hiệu thông báo từ MoMo (IPN Webhook)
 * POST /api/payment/momo-webhook
 */
const handleWebhook = async (req, res) => {
    try {
        // Nhận gói dữ liệu MoMo bắn tự động về body
        const webhookData = req.body;

        // Đẩy toàn bộ cục data thô xuống lớp nghiệp vụ giải quyết dữ liệu
        const result = await momoService.processWebhook(webhookData);

        // MoMo yêu cầu bạn trả về HTTP Status 204 No Content để họ biết bạn đã xử lý thành công, không cần gửi lại nữa.
        return res.status(204).send();

    } catch (error) {
        console.error("Webhook controller error:", error.message);
        if (error.message === "ORDER_NOT_FOUND") {
            return res.status(404).json({ error: "Đơn hàng MoMo gửi về không khớp với database." });
        }
        // Trả lỗi 500 nếu có sự cố DB để MoMo thử bắn lại gói tin sau (IPN retry)
        return res.status(500).json({ error: "Lỗi xử lý nội bộ hệ thống." });
    }
};

module.exports = {
    initPayment,
    handleWebhook
};