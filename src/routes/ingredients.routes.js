const { Router } = require("express")

const IngredientsController = require("../Controllers/IngredientsController")
const ensureAuthentication = require("../middlewares/ensureAuthentication")

const ingredientsRoutes = Router()

const ingredientsController = new IngredientsController()

ingredientsRoutes.use(ensureAuthentication)

ingredientsRoutes.get("/:id", ingredientsController.show)
ingredientsRoutes.put("/:id", ingredientsController.update)

module.exports = ingredientsRoutes