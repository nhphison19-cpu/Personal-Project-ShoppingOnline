const prisma = require('../../prisma/prismaClient');
const axios = require('axios');
const crypto = require('crypto');

// Các cấu hình môi trường của MoMo (Môi trường test - Sandbox)
const MOMO_CONFIG = {
    partnerCode: "MOMOBKUN20180810",
    accessKey: "W9vsnVvYmY77bAie",
    secretKey: "secretKey",
    apiEndpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
    returnUrl: "http://localhost:3000/api/payment/momo-return", // URL sau khi user thanh toán xong trên web
    notifyUrl: "https://your-domain.com/api/payment/momo-webhook", // URL nhận IPN Webhook từ MoMo (Phải là link public có HTTPS)
};

/**
 * 1. Khởi tạo đơn hàng trong DB và tạo link thanh toán sang MoMo
 */
const createPaymentUrl = async (userId, amount, shippingAddress) => {
    // Sử dụng transaction của Prisma để đảm bảo tạo Order thành công thì mới đi tiếp
    const newOrder = await prisma.order.create({
        data: {
            userId: userId,
            totalPrice: parseFloat(amount),
            paymentMethod: "MOMO",
            status: "PENDING",
            shippingAddress: shippingAddress || "Chưa cung cấp địa chỉ",
            payment: {
                create: {
                    status: "PENDING"
                }
            }
        }
    });

    // Cấu hình các tham số gửi sang cổng MoMo
    const orderId = newOrder.id; // Lấy luôn ID của Order vừa tạo trong Postgres làm mã đơn cho MoMo
    const requestId = orderId;
    const requestType = "captureWallet";
    const extraData = ""; 
    const orderInfo = `Thanh toan don hang #${orderId.substring(0, 8)}`; // Rút ngắn bớt ID hiển thị cho đẹp

    // Xây dựng chuỗi để ký số theo quy định khắt khe của MoMo (Sắp xếp theo Alphabet)
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&message=&notifyUrl=${MOMO_CONFIG.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&requestId=${requestId}&returnUrl=${MOMO_CONFIG.returnUrl}&requestType=${requestType}`;

    // Mã hóa Signature bằng HMAC-SHA256
    const signature = crypto
        .createHmac('sha256', MOMO_CONFIG.secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode: MOMO_CONFIG.partnerCode,
        accessKey: MOMO_CONFIG.accessKey,
        requestId: requestId,
        amount: amount.toString(),
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: MOMO_CONFIG.returnUrl,
        ipnUrl: MOMO_CONFIG.notifyUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'vi'
    };

    try {
        const response = await axios.post(MOMO_CONFIG.apiEndpoint, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        // Trả về dữ liệu gốc của MoMo bao gồm cả payUrl
        return response.data;
    } catch (error) {
        console.error("MoMo Service Connection Error:", error.response ? error.response.data : error.message);
        throw new Error("MOMO_CONNECTION_FAILED");
    }
};

/**
 * 2. Logic xử lý kết quả trả về tự động từ Webhook IPN MoMo
 */
const processWebhook = async (webhookData) => {
    const { orderId, transId, resultCode, message } = webhookData;

    // Tìm kiếm đơn hàng trong hệ thống xem có tồn tại không
    const orderExisted = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!orderExisted) {
        throw new Error("ORDER_NOT_FOUND");
    }

    // resultCode = 0 có nghĩa là giao dịch thành công hoàn toàn
    if (resultCode === 0) {
        // Chạy đồng thời cập nhật cả 2 bảng Order và Payment
        await prisma.$transaction([
            prisma.order.update({
                where: { id: orderId },
                data: { status: "PROCESSING" } // Chuyển từ PENDING sang PROCESSING để chuẩn bị đóng gói hàng
            }),
            prisma.payment.update({
                where: { orderId: orderId },
                data: { 
                    transactionId: transId.toString(),
                    status: "PAID" // Chuyển trạng thái thanh toán thành Đã trả tiền
                }
            })
        ]);
        return { status: "SUCCESS", message: "Đơn hàng đã thanh toán thành công." };
    } else {
        // Trường hợp người dùng hủy thanh toán hoặc giao dịch thất bại
        await prisma.$transaction([
            prisma.order.update({
                where: { id: orderId },
                data: { status: "CANCELLED" }
            }),
            prisma.payment.update({
                where: { orderId: orderId },
                data: { status: "FAILED" }
            })
        ]);
        return { status: "FAILED", message: message || "Giao dịch bị từ chối hoặc thất bại." };
    }
};

module.exports = {
    createPaymentUrl,
    processWebhook
};