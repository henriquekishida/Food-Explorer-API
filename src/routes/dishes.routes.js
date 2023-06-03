const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const dishesRoutes = Router();

const DishesImageController = require("../Controllers/DishesImageController.js");
const DishesController = require("../Controllers/DishesController.js");
const ensureAuthentication = require("../middlewares/ensureAuthentication.js");

const dishesController = new DishesController();
const dishesImageController = new DishesImageController();

const upload = multer(uploadConfig.MULTER_PLATE);

dishesRoutes.use(ensureAuthentication);

dishesRoutes.get("/", dishesController.index);
dishesRoutes.post("/", upload.single("imgDish"), dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", upload.single("imgDish"), dishesController.delete);
dishesRoutes.put("/:id", dishesController.update);

dishesRoutes.patch("/:id", upload.single("imgDish"), dishesImageController.update);

module.exports = dishesRoutes;