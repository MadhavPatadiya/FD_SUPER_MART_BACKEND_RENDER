const mongoose = require("mongoose");

const ReceiptVoucherSchema = new mongoose.Schema({
    no: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    totaldebitamount: {
        type: Number,
        required: true,
    },
    totalcreditamount: {
        type: Number,
        required: true,
    },
    account: {
        type: String,
        required: true,
    },
    ledger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ledger",
        required: true,
    },
    remark: {
        type: String,
        required: false,
    },
    debit: {
        type: Number,
        required: false,
    },
    credit: {
        type: Number,
        required: false,
    },
    //---------
    cashaccount: {
        type: String,
        required: true,
    },
    cashtype: {
        type: String,
        required: true,
    },
    cashremark: {
        type: String,
        required: false,
    },
    cashdebit: {
        type: Number,
        required: false,
    },
    cashcredit: {
        type: Number,
        required: false,
    },



    // entries: [
    //     {
    //         account: {
    //             type: String,
    //             required: true,
    //         },
    //         ledger: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "Ledger",
    //             required: true,
    //         },
    //         remark: {
    //             type: String,
    //             required: false,
    //         },
    //         debit: {
    //             type: Number,
    //             required: true,
    //         },
    //         credit: {
    //             type: Number,
    //             required: true,
    //         },
    //     },
    // ],
    // cashtype: [
    //     {
    //         cashaccount: {
    //             type: String,
    //             required: true,
    //         },
    //         type: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "Ledger",
    //             required: true,
    //         },
    //         cashremark: {
    //             type: String,
    //             required: false,
    //         },
    //         cashdebit: {
    //             type: Number,
    //             required: true,
    //         },
    //         cashcredit: {
    //             type: Number,
    //             required: true,
    //         },
    //     },
    // ],

    naration: {
        type: String,
        required: false,
    },
    companyCode: {
        type: String,
        ref: "NewCompany",
        required: true,
    },
});

module.exports = mongoose.model("ReceiptVoucher", ReceiptVoucherSchema);
