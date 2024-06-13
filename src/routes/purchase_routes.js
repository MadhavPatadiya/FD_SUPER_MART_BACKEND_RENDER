const PurchaseController = require("../controllers/purchase_controller");
const PurchaseRoutes = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

//For getting all purchase entry
PurchaseRoutes.get(
  "/fetchAll/:companyCode",
  verifyToken,
  PurchaseController.fetchAllPurchase
);
PurchaseRoutes.post("/create", verifyToken, PurchaseController.createPurchase);
PurchaseRoutes.get("/get/:id", verifyToken, PurchaseController.fetchPurchseById);
PurchaseRoutes.delete(
  "/delete/:id",
  // verifyToken,
  PurchaseController.deletePurchaseById
);
// updating purchase entry
PurchaseRoutes.put(
  "/update/:id",
  verifyToken,
  PurchaseController.updatePurchase
);

module.exports = PurchaseRoutes;
