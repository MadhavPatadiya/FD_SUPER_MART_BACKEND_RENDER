const deliveryChallanController = require('../controllers/delivery_challan_controller');
const express = require('express');
const router = express.Router();

router.post('/create', deliveryChallanController.createDeliveryChallan);
router.get('/delivery_challans', deliveryChallanController.getAllDeliveryChallans);
router.get('/delivery_challan/:id', deliveryChallanController.getDeliveryChallanById);
router.patch('/delivery_challan/:id', deliveryChallanController.updateDeliveryChallan);
router.delete('/delivery_challan/:id', deliveryChallanController.deleteDeliveryChallan);

module.exports = router;
