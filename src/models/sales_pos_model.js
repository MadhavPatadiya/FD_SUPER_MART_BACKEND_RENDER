const mongoose = require("mongoose");

const SalesPosSchema = new mongoose.Schema({
  no: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  companyCode: {
    type: String,
    ref: "NewCompany",
    required: true,
  },
  place: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    trim: true,
    required: true,
  },

  entries: [
    {
      itemName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items",
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      netAmount: {
        type: Number,
        required: true,
      },
    },
  ],
  accountNo: {
    type: String,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  billedTo: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SalesPos", SalesPosSchema);
