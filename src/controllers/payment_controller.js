const Payment = require("../models/payment_model");

const PaymentController = {
  createPayment: async (req, res) => {
    try {
      const payment = new Payment(req.body);
      const savedPayment = await payment.save();
      res.status(201).json(savedPayment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getPayments: async (req, res) => {
    try {
      const payments = await Payment.find();
      res.status(200).json(payments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updatePayment: async (req, res) => {
    try {
      const updatedPayment = await Payment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.status(200).json(updatedPayment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deletePayment: async (req, res) => {
    try {
      const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
      if (!deletedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = PaymentController;


