const SalesEntry = require("../models/sales_entry_model");
const Items = require("../models/items_model");
const Ledger = require("../models/ledger_model");
const fs = require("fs");
const pdfdocument = require("pdfkit");
const pdfTable = require("voilab-pdf-table");

//For Creating Sales
const createSales = async (req, res) => {
  try {
    const salesData = req.body;
    salesData.totalamount = parseFloat(salesData.totalamount);
    salesData.cashAmount = parseFloat(salesData.cashAmount);
    salesData.dueAmount = parseFloat(salesData.dueAmount);
    const newsalesData = SalesEntry(salesData);

    const ledgerID = salesData.party;
    const saleType = salesData.type;
    let ledger = null;
    console.log(salesData);

    if (saleType === "MULTI MODE") {
      const ledger = await Ledger.findById(ledgerID);
      ledger.debitBalance += salesData.multimode[0].debit;

      // console.log(ledger.debitBalance);
      // console.log(typeof ledger.debitBalance);
      // console.log(salesData.multimode[0].debit);
      await ledger.save();
    }

    if (saleType === "DEBIT") {
      const ledger = await Ledger.findById(ledgerID);
      ledger.debitBalance += salesData.totalamount;
      await ledger.save();
    }
    // if (ledger.openingBalance < salesData.totalamount) {
    //   const remainingAmount =
    //     salesData.totalamount - ledger.openingBalance;
    //   salesData.dueAmount = remainingAmount;
    //   ledger.openingBalance = 0;
    //   newsalesData.dueAmount = salesData.dueAmount;
    // } else if (ledger.openingBalance >= salesData.totalamount) {
    //   ledger.openingBalance -= salesData.totalamount;
    // }


    if (saleType === "CASH") {
      newsalesData.cashAmount = salesData.totalamount;
    }
    // if (salesData.cashAmount < salesData.totalamount) {
    //   salesData.dueAmount =
    //     salesData.totalamount - salesData.cashAmount;

    //   newsalesData.dueAmount = salesData.dueAmount;
    // } else {
    //   salesData.dueAmount = 0;
    //   newsalesData.dueAmount = salesData.dueAmount;
    // }


    const existingSales = await SalesEntry.findOne({
      $or: [{ dcNo: req.body.dcNo }],
    });

    if (existingSales) {
      return res.json({
        success: false,
        message: "Bill No already exists.",
      });
    }

    await newsalesData.save();

    for (const entry of salesData.entries) {
      const salesId = entry.itemName;
      const quantity = entry.qty;

      const sales = await Items.findById(salesId);

      if (!sales) {
        return res.json({
          success: false,
          message: "sales not found.",
        });
      }

      // Update maximum stock
      // sales.maximumStock -= quantity;
      // await sales.save();
      await Items.updateOne(
        { _id: salesId },
        { $inc: { maximumStock: -quantity } }
      );
    }

    // const sales = await SalesEntry.create(req.body);
    // console.log(sales);
    return res.json({
      success: true,
      message: "Sales Created",
      data: newsalesData,
    });
  } catch (ex) {
    return res.json({ success: false, message: ex.message });
  }
};

//For updating Sales
const updateSales = async (req, res) => {
  try {
    const sales = await SalesEntry.updateOne({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!sales) {
      return res.json({ success: false, message: "Sales Entry not found" });
    }

    return res.json({ success: true, data: sales });
  } catch (ex) {
    return res.json({ success: false, message: ex });
  }
};
const deleteSales = async (req, res) => {
  try {
    const id = req.params.id;
    const getSales = await SalesEntry.findOne({ _id: id });
    const ledgerID = getSales.party;
    const salesType = getSales.type;
    const salesTotalAmount = parseFloat(getSales.totalamount);
    const salesDueAmount = parseFloat(getSales.dueAmount);

    for (const entry of getSales.entries) {
      const salesId = entry.itemName;
      const quantity = entry.qty;
      const sales = await Items.findById(salesId);
      // Update maximum stock
      sales.maximumStock += quantity;
      await sales.save();
    }

    if (salesType === "Debit") {
      const ledger = await Ledger.findById(ledgerID);
      if (salesDueAmount == 0) {
        const op = ledger.openingBalance + salesTotalAmount;
        ledger.openingBalance = op;
      } else if (getSales.dueAmount > 0) {
        const op = salesTotalAmount - salesDueAmount;
        ledger.openingBalance = op;
      }
      await ledger.save();
    }
    const getSalesAndDelete = await SalesEntry.findByIdAndDelete(id);

    if (!getSalesAndDelete) {
      return res.json({ success: false, message: "Sales not found" });
    }
    return res.json({ success: true, message: "Deleted Successfully!" });
  } catch (ex) {
    return res.json({ success: false, message: ex });
  }
};
//For Deleting Sales
// const deleteSales = async (req, res) => {
//   try {
//     const sales = await SalesEntry.deleteOne({ _id: req.params.id });
//     if (!sales) {
//       return res.json({ success: false, message: "Sales Entry not found" });
//     }
//     return res.json({
//       success: true,
//       message: "Sales Entry Deleted Successfully!",
//     });
//   } catch (ex) {
//     return res.json({ success: false, message: ex });
//   }
// };

//  Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await SalesEntry.find({});
    return res.json({ success: true, data: sales });
  } catch (ex) {
    return res.json({ success: false, message: ex });
  }
};
const fetchAllSales = async (req, res) => {
  try {
    const { companyCode } = req.params;
    const fetchAllSale = await SalesEntry.find({
      companyCode: companyCode,
    });
    return res.json({ success: true, data: fetchAllSale });
  } catch (ex) {
    return res.json({ success: false, message: ex });
  }
};
// Download Receipt
const downloadReceipt = async (req, res) => {
  try {
    const sales = await SalesEntry.findOne({ _id: req.params.id });
    if (!sales) {
      return res.json({ success: false, message: "Sales Entry not found" });
    }

    generateReceiptPDF(sales, (filePath) => {
      // Send the PDF file as a download response
      res.download(filePath, `receipt_${sales._id}.pdf`, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Error downloading PDF" });
        }
        fs.unlinkSync(filePath);
      });
    });
  } catch (ex) {
    return res.status(500).json({ success: false, message: ex });
  }
};

const generateReceiptPDF = async (salesData, callback) => {
  const doc = new pdfdocument({
    autoFirstPage: false,
  });

  const table = new pdfTable(doc, {
    bottomMargin: 30,
  });

  table
    .addPlugin(
      new (require("voilab-pdf-table/plugins/fitcolumn"))({
        column: "description",
      })
    )
    .setColumnsDefaults({
      headerBorder: "B",
      align: "right",
    })
    .addColumns([
      {
        id: "itemName",
        header: "Item Name",
        align: "left",
        width: 300,
      },
      {
        id: "qty",
        header: "Quantity",
        width: 50,
      },
      {
        id: "rate",
        header: "Rate",
        width: 50,
      },
      {
        id: "amount",
        header: "Amount",
        width: 50,
      },
    ])
    .onPageAdded(function (tb) {
      tb.addHeader();
    });

  doc.addPage();
  const populatedEntries = await Promise.all(
    salesData.entries.map(async (entry) => {
      const item = await Items.findById(entry.itemName);
      if (item) {
        return { ...entry.toObject(), itemName: item.itemName };
      }
      return entry;
    })
  );

  table.addBody(populatedEntries);

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);

    const fileName = `receipt_${salesData._id}.pdf`;
    const filePath = `${__dirname}/${fileName}`;
    fs.writeFileSync(filePath, pdfData);

    callback(filePath);
  });

  doc.end();
};

const getSingleSales = async (req, res) => {
  try {
    const sales = await SalesEntry.findOne({ _id: req.params.id });
    if (!sales) {
      return res.json({ success: false, message: "Sales Entry not found" });
    }
    return res.json({ success: true, data: sales });
  } catch (ex) {
    return res.json({ success: false, message: ex });
  }
};

module.exports = {
  createSales,
  updateSales,
  deleteSales,
  getAllSales,
  getSingleSales,
  downloadReceipt,
  fetchAllSales,
};
