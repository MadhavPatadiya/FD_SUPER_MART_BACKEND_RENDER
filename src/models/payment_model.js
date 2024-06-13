const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  no: {
    type: String,
    required: true,
  },
  totalamount: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  entries: [
    {
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
        required: true,
      },
      credit: {
        type: Number,
        required: true,
      },
    },
  ],
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

module.exports = mongoose.model("Payment", PaymentSchema);
