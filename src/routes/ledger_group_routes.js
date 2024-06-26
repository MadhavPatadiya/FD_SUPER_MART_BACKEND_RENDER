const LedgerGroupRoutes = require("express").Router();
const LedgerGroupController = require("../controllers/ledger_group_controller");
const verifyToken = require("../middleware/verifyToken");

LedgerGroupRoutes.post(
  "/create",
  verifyToken,
  LedgerGroupController.createLedgerGroup
);

LedgerGroupRoutes.delete(
  "/delete/:id",
  verifyToken,
  LedgerGroupController.deleteLedgerGroup
);

LedgerGroupRoutes.get(
  "/get-all",
  verifyToken,
  LedgerGroupController.getAllLedgerGroup
);
module.exports = LedgerGroupRoutes;
