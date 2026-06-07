const express = require('express');
const router = express.Router();
const {initPayment , handleWebhook} = require('../controllers/Payment/MomoPay')
// Đường dẫn gốc thực tế khi chạy sẽ là: /api/payment/momo
router.post('/momo', initPayment);

// Đường dẫn gốc thực tế khi chạy sẽ là: /api/payment/momo-webhook
router.post('/momo-webhook', handleWebhook);

module.exports = router;