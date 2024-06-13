const ReceiptVoucher = require("../models/receipt_voucher_model");
const Ledger = require("../models/ledger_model");

const ReceiptVoucherController = {
    createReceiptVoucher: async (req, res) => {
        try {

            const receiptData = req.body;
            const debit = receiptData.debit;
            const credit = receiptData.credit;
            const ledgerID = receiptData.ledger;
            const receiptType = receiptData.account;

            if (receiptType == "Dr") {
                const ledgerfetch = await Ledger.findById(ledgerID);
                ledgerfetch.debitBalance += parseFloat(debit); // Parse debit as float
                await ledgerfetch.save(); // Save the ledger
            } else if (receiptType == "Cr") {
                const ledgerfetch = await Ledger.findById(ledgerID);
                ledgerfetch.debitBalance -= parseFloat(credit); // Parse credit as float
                await ledgerfetch.save(); // Save the ledger
            }



            const receiptvoucher = new ReceiptVoucher(req.body);
            const savedReceiptVoucher = await receiptvoucher.save();
            res.status(201).json(savedReceiptVoucher);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getReceiptVoucher: async (req, res) => {
        try {
            const receiptvoucher = await ReceiptVoucher.find();
            res.json({ success: true, data: receiptvoucher });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },




    getReceiptVoucherById: async (req, res) => {
        try {
            const { id } = req.params;

            const receiptvoucher = await ReceiptVoucher.findById(id);

            if (!receiptvoucher) {
                return res.status(404).json({ success: false, error: "Entry not found" });
            }
            res.json({ success: true, data: receiptvoucher });
        } catch (error) {
            res.json({ success: false, message: ex });
        }
    },



    updateReceiptVoucher: async (req, res) => {
        try {
            const updatedreceiptvoucher = await receiptvoucher.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedreceiptvoucher) {
                return res.status(404).json({ error: "ReceiptVoucher not found" });
            }
            res.status(200).json(updatedreceiptvoucher);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteReceiptVoucher: async (req, res) => {
        try {
            const deletedreceiptvoucher = await receiptvoucher.findByIdAndDelete(req.params.id);
            if (!deletedreceiptvoucher) {
                return res.status(404).json({ error: "ReceiptVoucher not found" });
            }
            res.status(200).json({ message: "ReceiptVoucher deleted successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
}


module.exports = ReceiptVoucherController;
