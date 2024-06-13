const DeliveryChallanModel = require("../models/delivery_challan_model");
const ProductStockModel = require("../models/product_stock_model");
const ItemModel = require("../models/items_model");

// For creating a new inward challan
const createDeliveryChallan = async (req, res) => {
  try {
    const deliveryChallan = new DeliveryChallanModel(req.body);

    for (let entry of req.body.entries) {
      const item = await ItemModel.findById(entry.itemName);


      await item.updateOne(
        { _id: item._id },
        { $inc: { maximumStock: -entry.qty } }
      );

      const existingItem = await ItemModel.findOne({
        codeNo: item.codeNo,
        companyCode: req.body.companyCode,
      });

      if (existingItem) {
        await existingItem.updateOne(
          { _id: existingItem._id },
          { $inc: { maximumStock: entry.qty } }
        );
      } else {
        const newItem = new ItemModel({
          itemGroup: item.itemGroup,
          itemBrand: item.itemBrand,
          itemName: item.itemName,
          printName: item.printName,
          codeNo: item.codeNo,
          taxCategory: item.taxCategory,
          hsnCode: item.hsnCode,
          barcode: item.barcode,
          storeLocation: item.storeLocation,
          measurementUnit: item.measurementUnit,
          secondaryUnit: item.secondaryUnit,
          minimumStock: item.minimumStock,
          maximumStock: entry.qty,
          monthlySalesQty: item.monthlySalesQty,
          date: item.date,
          dealer: item.dealer,
          subDealer: item.subDealer,
          retail: item.retail,
          mrp: item.mrp,
          price: item.price,
          openingStock: item.openingStock,
          status: item.status,
          images: item.images,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          companyCode: req.body.companyCode,
        });

        // Save the new item
        await newItem.save();
      }
    }
    // Save the delivery challan
    await deliveryChallan.save();
    res.status(201).send(deliveryChallan);
  } catch (error) {
    res.status(400).send(error);
  }
};

// For getting all inward challans
const getAllDeliveryChallans = async (req, res) => {
  try {
    const deliveryChallan = await DeliveryChallanModel.find();
    res.json({ success: true, data: deliveryChallan });
  } catch (error) {
    res.status(500).send(error);
  }
};

// For getting a single inward challan
const getDeliveryChallan = async (req, res) => {
  try {
    const deliveryChallan = await DeliveryChallanModel.findById(req.params.id);
    if (!deliveryChallan) {
      return res.status(404).send("Inward Challan not found");
    }
    res.status(200).send(deliveryChallan);
  } catch (error) {
    res.status(500).send(error);
  }
};


const getDeliveryChallanById = async (req, res) => {
  try {
    const deliveryChallan = await DeliveryChallanModel.findById(req.params.id);

    if (deliveryChallan) {
      res.json({ success: true, data: deliveryChallan });
    } else {
      res.json({ success: false, message: "deliveryChallan not found" });
    }
  } catch (ex) {
    res.json({ success: false, message: ex });
  }
};


// For updating a inward challan
const updateDeliveryChallan = async (req, res) => {
  try {
    const deliveryChallan = await DeliveryChallanModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!deliveryChallan) {
      return res.status(404).send("Inward Challan not found");
    }
    res.status(200).send(deliveryChallan);
  } catch (error) {
    res.status(500).send(error);
  }
};

// For deleting a inward challan
const deleteDeliveryChallan = async (req, res) => {
  try {
    const inwardChallan = await DeliveryChallanModel.findByIdAndDelete(
      req.params.id
    );
    if (!deliveryChallan) {
      return res.status(404).send("Inward Challan not found");
    }
    res.status(200).send(deliveryChallan);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createDeliveryChallan,
  getAllDeliveryChallans,
  getDeliveryChallan,
  getDeliveryChallanById,
  updateDeliveryChallan,
  deleteDeliveryChallan,
};


