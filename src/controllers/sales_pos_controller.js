const SalesPos = require("../models/sales_pos_model");
const Items = require("../models/items_model");

//For Creating Sales
const createSalesPos = async (req, res) => {
  try {
    const salesData = req.body;

    salesData.totalAmount = parseFloat(salesData.totalAmount);
    const newsalesData = SalesPos(salesData);
    
    const salesEntry = await SalesPos.create(newsalesData);

    return res.json({
      success: true,
      message: "Sales created successfully.",
      data: salesEntry,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//For Getting All Sales
const getAllSalesPos = async (req, res) => {
  try {
    const salesCode = req.params.code;
    const sales = await SalesPos.find({ companyCode: salesCode });

    return res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//For Updating Sales
const updateSalesPos = async (req, res) => {
  try {
    const salesId = req.params.id;
    const salesData = req.body;

    const sales = await SalesPos.findByIdAndUpdate(salesId, salesData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//For Deleting Sales
const deleteSalesPos = async (req, res) => {
  try {
    const salesId = req.params.id;
    const sales = await SalesPos.findByIdAndDelete(salesId);

    return res.json({
      success: true,
      message: "Sales deleted successfully.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Exporting the functions
module.exports = {
  createSalesPos,
  getAllSalesPos,
  updateSalesPos,
  deleteSalesPos,
};
