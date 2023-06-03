const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class DishesImageController {
  async update(request, response) {
    const dish_id = request.params
    const imgPlateFilename = request.file.filename
    const diskStorage = new DiskStorage()

    const dish = await knex("dishes")
      .where(dish_id).first()

    if (!dish) {
      throw new AppError("Ação negada.", 401)
    }

    if (dish.imagem) {
      await diskStorage.deleteFile(dish.imagem)
    }

    const filename = await diskStorage.saveFile(imgPlateFilename)
    dish.imagem = filename

    await knex("dishes").update({ imagem: dish.imagem }).where({ id: dish_id.id })
    await knex("favorites").update({ imagem: dish.imagem }).where({ id: dish_id.id })

    return response.json(dish)
  }
}

module.exports = DishesImageController;