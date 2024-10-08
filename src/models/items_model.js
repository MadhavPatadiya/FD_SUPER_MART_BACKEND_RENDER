const mongoose = require("mongoose");
const Barcode = require("./barcode_print_model");

const ItemsSchema = new mongoose.Schema({
  companyCode: {
    type: String,
    required: true,
  },
  itemGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemGroup",
    required: true,
  },
  itemBrand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemBrand",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  printName: {
    type: String,
    required: true,
  },
  codeNo: {
    type: String,
    required: false,
  },
  taxCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaxRate",
    required: true,
  },
  hsnCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HSN",
    required: true,
  },
  barcode: {
    type: String,
    // ref: "BarcodePrint",
    required: false,
  },
  storeLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StoreLocation",
    required: true,
  },
  measurementUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MeasurementUnit",
    required: true,
  },
  secondaryUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SecondaryUnit",
    required: false,
  },
  minimumStock: {
    type: Number,
    required: false,
  },
  maximumStock: {
    type: Number,
    required: true,
  },
  monthlySalesQty: {
    type: Number,
    required: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dealer: {
    type: Number,
    required: false,
    default: "",
  },
  subDealer: {
    type: Number,
    required: false,
    default: "",
  },
  retail: {
    type: Number,
    required: false,
    default: "",
  },
  mrp: {
    type: Number,
    required: false,
    default: "",
  },
  discountAmount: {
    type: Number,
    required: false,
    default: "",
  },

  price: {
    type: Number,
    required: false,
    default: 0.0,
  },
  openingStock: {
    type: String,
    required: false,
    default: "0",
  },
  status: {
    type: String,
    required: false,
    default: "",
  },

  images: {
    type: [String],
    required: false,
    default: [],
  },
  productMetadata: {
    overview: {
      type: String,
      required: false,
      default: "",
    },
    features: {
      type: [String],
      required: false,
      default: [],
    },
    ingredients: {
      type: [String],
      required: false,
      default: [],
    },
    benefits: {
      type: [String],
      required: false,
      default: [],
    },
  },

  // description: {
  //   type: String,
  //   required: false,
  //   default: "",
  // },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

ItemsSchema.pre("save", async function (next) {
  try {
    this.updateOn = new Date();
    this.createdOn = new Date();
    const barcodeDoc = await Barcode.create({ barcode: this.barcode });
    this.barcode = barcodeDoc._id;
    console.log("Barcode: ", barcodeDoc._id);
    next();
  } catch (error) {
    console.log("Error: ", error);
    next(error);
  }
});

module.exports = mongoose.model("Items", ItemsSchema);
